import dbConnect from "@/config/dbConnect";
import { auth, isStudent } from "@/middlewares/authMiddleware";
import Exam from "@/models/exam.model";
import ExamAttempt from "@/models/examAttempt.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

export async function GET(req: RequestType) {
  try {
    // Connect to database
    await dbConnect();

    // Authenticate user
    const authResponse = auth(req);
    if (authResponse) return authResponse;

    // Ensure only students can access this endpoint
    const studentCheck = isStudent(req);
    if (studentCheck) return studentCheck;

    const studentId = req.user.id;

    // Find all exam attempts for the student
    const attempts = await ExamAttempt.find({ studentId })
      .populate({
        path: 'examId',
        select: 'title subjectId totalMarks duration startTime endTime',
        populate: {
          path: 'subjectId',
          select: 'name'
        }
      })
      .sort({ submittedAt: -1 });

    // Format the results
    const results = attempts.map(attempt => ({
      examId: attempt.examId._id,
      examTitle: attempt.examId.title,
      subject: attempt.examId.subjectId?.name || 'N/A',
      totalMarks: attempt.examId.totalMarks,
      obtainedMarks: attempt.obtainedMarks,
      percentage: ((attempt.obtainedMarks / attempt.examId.totalMarks) * 100).toFixed(2),
      submittedAt: attempt.submittedAt,
      status: attempt.status,
      duration: attempt.duration,
      examDate: attempt.examId.startTime
    }));

    return NextResponse.json(
      {
        success: true,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student results:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch results. Please try again later.",
      },
      { status: 500 }
    );
  }
}
