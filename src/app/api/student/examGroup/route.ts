import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examGroupModel from "@/models/examGroup.model";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

export const POST = async (req: requestType) => {
  try {
    await dbConnect();

    // Auth check
    const authResponse = isStudent(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const { id } = req.user;
    const { examGroupId, subjectIds } = await req.json(); // subjectIds is an array of subject ObjectIds

    console.log("examGroup id : ", examGroupId);
    console.log("subjectIds : ", subjectIds);

    // Validate student
    const student = await studentModel.findById(id);
    if (!student) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // console.log("student : ", student);

    // Validate exam group
    const examGroup = await examGroupModel.findById(examGroupId);
    if (!examGroup) {
      return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
    }

    if (examGroup.status === "INACTIVE") {
      return NextResponse.json({ success: false, error: "Exam group is inactive" }, { status: 400 });
    }

    // Validate organization
    const organization = await organizationModel.findById(examGroup.organizationId);
    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
    }

    // Ensure student is part of the org
    const studentInOrg = organization.students.find((s: { email: string }) => s.email === student.email);
    if (!studentInOrg) {
      return NextResponse.json({ success: false, error: `You are not a student at ${organization.name}` }, { status: 403 });
    }

    // Enroll in ExamGroup if not already
    let studentDetails = examGroup.students.find((s: { email: string }) => s.email === student.email);

    console.log("studentDetails : ", studentDetails);

    if (!studentDetails) {
      studentDetails = {
        name: student.name,
        email: student.email,
        prn: studentInOrg.prn,
      };
      examGroup.students.push(studentDetails);
      await examGroup.save();
    }

    // Enroll in subjects
    const enrolledSubjects = [];

    for (const subjectId of subjectIds) {
      const subject = await subjectModel.findById(subjectId);
      console.log("subject : ", subject);
      if (subject) {
        const alreadyEnrolled = subject.students.some((s: { email: string }) => s.email === student.email);
        console.log("alreadyEnrolled : ", alreadyEnrolled);
        if (!alreadyEnrolled) {
          subject.students.push({
            name: studentDetails.name,
            email: studentDetails.email,
            prn: studentDetails.prn,
          });
          await subject.save();
          enrolledSubjects.push(subject);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Joined exam group and enrolled in selected subjects",
      data: {
        examGroup: {
          id: examGroup._id,
          name: examGroup.name,
        },
        subjects: enrolledSubjects.map((s) => ({ id: s._id, name: s.name })),
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error joining exam group and subjects:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
