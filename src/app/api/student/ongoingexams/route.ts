import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import studentModel from "@/models/student.model";
import subjectModel from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

export const GET = async (req: requestType) => {
  try {
    await dbConnect();

    const authResponse = await isStudent(req);
    if (authResponse) return authResponse;

    const user = await studentModel.findById(req.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find all subjects the student is enrolled in
    const subjects = await subjectModel.find({
      "students.email": user.email,
    });

    const subjectIds = subjects.map((subject) => subject._id);

    // Current time
    const now = new Date();

    // Fetch exams that are ongoing
    const exams = await examModel.find({
      subjectId: { $in: subjectIds },
      startTime: { $lte: now },
      endTime: { $gte: now },
    //   status: "ongoing",
    })
      .select("-questions -hints -isResultPublished -passingMarks -attemptCount")
      .populate("subjectId", "name code")
      .sort({ startTime: 1 });

    return NextResponse.json({
      success: true,
      message: "Ongoing exams fetched successfully",
      data: exams,
    });

  } catch (error) {
    console.error("Error fetching ongoing exams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ongoing exams" },
      { status: 500 }
    );
  }
};
