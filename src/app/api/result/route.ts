import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import ExamGroup from "@/models/examGroup.model";
import Exam from "@/models/exam.model";
import ExamAttempt from "@/models/examAttempt.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

export async function POST(req: RequestType) {
  try {
    await dbConnect();

    const authResponse = isAdmin(req);
    if (authResponse) return authResponse;

    const { examGroupId } = await req.json();

    if (!examGroupId) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam group ID is required",
        },
        { status: 400 }
      );
    }

    const examGroup = await ExamGroup.findById(examGroupId);
    if (!examGroup) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam group not found",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const finishedExams = await Exam.find({
      _id: { $in: examGroup.exams },
      endTime: { $lte: now },
    })
      .populate("subjectId", "name")
      .lean();

    const examsWithAttempts = await Promise.all(
      finishedExams.map(async (exam) => {
        const examAttempts = await ExamAttempt.find({ examId: exam._id })
          .populate("studentId", "name email prn")
          .lean();

        return {
          ...exam,
          examAttempts,
        };
      })
    );

    const resultData = {
      _id: examGroup._id,
      name: examGroup.name,
      description: examGroup.description,
      organizationId: examGroup.organizationId,
      students: examGroup.students,
      subjects: examGroup.subjects,
      exams: examsWithAttempts,
    };

    return NextResponse.json(
      {
        success: true,
        data: resultData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
