import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import studentModel from "@/models/student.model";
import subjectModel from "@/models/subject.model";
import ExamAttempt from "@/models/examAttempt.model"; // Assuming this is the correct import
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

    const now = new Date();

    // Fetch exams that are ongoing
    const exams = await examModel.find({
      subjectId: { $in: subjectIds },
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .select("title subjectId startTime endTime attemptCount totalMarks duration") // Select necessary fields
      .populate("subjectId", "name code")
      .sort({ startTime: 1 });

    // Fetch all attempts by current student for these exams
    const examIds = exams.map((exam) => exam._id);

    const attempts = await ExamAttempt.find({
      examId: { $in: examIds },
      studentId: req.user.id,
    });

    // Map examId to attempt count
    const attemptsMap: Record<string, number> = {};
    attempts.forEach((attempt) => {
      const examIdStr = attempt.examId.toString();
      attemptsMap[examIdStr] = (attemptsMap[examIdStr] || 0) + 1;
    });

    // Add remainingAttempts to each exam
    const examsWithRemaining = exams.map((exam) => {
      const attemptsMade = attemptsMap[exam._id.toString()] || 0;
      const remainingAttempts = Math.max(0, exam.attemptCount - attemptsMade);
      return {
        ...exam.toObject(),
        remainingAttempts,
        attemptsMade,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Ongoing exams fetched successfully",
      data: examsWithRemaining,
    });

  } catch (error) {
    console.error("Error fetching ongoing exams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ongoing exams" },
      { status: 500 }
    );
  }
};
