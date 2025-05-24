import dbConnect from "@/config/dbConnect"
import { isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examModel from "@/models/exam.model";
import examAttemptModel from "@/models/examAttempt.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

export const GET = async (req: RequestType, { params }: { params: Promise<{ examId: string }> }) => {
    try {
        await dbConnect();

        const authResponse = isAdmin(req);
        if (authResponse) return authResponse;

        const { examId } = await params;
        if (!examId) {
            return NextResponse.json(
                { success: false, message: "Exam ID is required" },
                { status: 400 }
            );
        }

        const userId = req.user?.id;
        const user = await adminModel.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const exam = await examModel.findOne({ _id: examId, adminId: userId })
        if (!exam) {
            return NextResponse.json(
                { success: false, message: "Exam not found" },
                { status: 404 }
            );
        }

        // const now = new Date();
        // if (exam.endTime > now) {
        //     return NextResponse.json(
        //         { success: false, message: "Exam is not finished yet" },
        //         { status: 400 }
        //     );
        // }

        const examAttempts = await examAttemptModel.find({ examId: exam._id }).populate("studentId", "name email").sort({ createdAt: -1 });
        if (!examAttempts || examAttempts.length === 0) {
            return NextResponse.json(
                { success: false, message: "No exam attempts found" },
                { status: 404 }
            );
        }

        // --- ANALYTICS CALCULATION ---
        const totalAttempts = examAttempts.length;
        const completedAttempts = examAttempts.filter(attempt => attempt.status === "completed").length;
        const passedAttempts = examAttempts.filter(attempt => attempt.obtainedMarks >= exam.passingMarks).length;
        const autoSubmitted = examAttempts.filter(attempt => attempt.autoSubmitted).length;

        const avgMarks = totalAttempts > 0
            ? examAttempts.reduce((sum, attempt) => sum + attempt.obtainedMarks, 0) / totalAttempts
            : 0;

        const avgTimeTaken = totalAttempts > 0
            ? examAttempts.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0) / totalAttempts
            : 0;

        const avgHintsUsed = totalAttempts > 0
            ? examAttempts.reduce((sum, attempt) => sum + (attempt.hintsUsed || 0), 0) / totalAttempts
            : 0;

        const passingPercentage = totalAttempts > 0
            ? (passedAttempts / totalAttempts) * 100
            : 0;

        const analytics = {
            totalAttempts,
            completedAttempts,
            autoSubmitted,
            averageMarks: parseFloat(avgMarks.toFixed(2)),
            averageTimeTaken: parseFloat(avgTimeTaken.toFixed(2)),
            averageHintsUsed: parseFloat(avgHintsUsed.toFixed(2)),
            passingPercentage: parseFloat(passingPercentage.toFixed(2)),
        };

        return NextResponse.json(
            {
                success: true,
                data: {
                    exam,
                    examAttempts,
                    analytics,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in GET /api/result/:examId", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
};
