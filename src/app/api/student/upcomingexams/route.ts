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

        // Step 1: Find all subjects where student with this email is enrolled
        const subjects = await subjectModel.find({
            "students.email": user?.email,
        });

        // Step 2: Extract subject IDs
        const subjectIds = subjects.map((subject) => subject._id);

        // Step 3: Fetch exams where subjectId is in subjectIds and startTime is in the future
        const now = new Date();
        const exams = await examModel.find({
            subjectId: { $in: subjectIds },
            startTime: { $gt: now },
            status: { $in: ["scheduled", "ongoing"] },
        }).select("-questions -hints -isResultPublished -passingMarks -attemptCount") // this line excludes fields from Exam
            .populate("subjectId", "name code") // optional populate for subject info
            .sort({ startTime: 1 });

        return NextResponse.json({
            success: true,
            message: "Upcoming exams fetched successfully",
            data: exams,
        });

    } catch (error) {
        console.error("Error fetching upcoming exams:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch exams" },
            { status: 500 }
        );
    }
};
