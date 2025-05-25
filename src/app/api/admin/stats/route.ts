import dbConnect from "@/config/dbConnect";
import { isSuperAdmin } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import examAttemptModel from "@/models/examAttempt.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

// Helper to get monthly counts (last 12 months)
const getMonthlyCounts = (docs: any[], dateField: string) => {
  const monthlyCounts = Array(12).fill(0); // Index 0 = Jan, 11 = Dec
  const now = new Date();

  docs.forEach(doc => {
    const date = new Date(doc[dateField]);
    const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    if (diffInMonths >= 0 && diffInMonths < 12) {
      monthlyCounts[11 - diffInMonths]++;
    }
  });

  return monthlyCounts; // From Jan to Dec (sorted from oldest to latest)
};

export const GET = async (req: RequestType) => {
  try {
    await dbConnect();

    const authResponse = isSuperAdmin(req);
    if (authResponse) return authResponse;

    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // Fetch last 12 months of data
    const [organizations, students, exams, examAttempts] = await Promise.all([
      organizationModel.find({ createdAt: { $gte: oneYearAgo } }),
      studentModel.find({ createdAt: { $gte: oneYearAgo } }),
      examModel.find({ createdAt: { $gte: oneYearAgo } }),
      examAttemptModel.find({ createdAt: { $gte: oneYearAgo } }),
    ]);

    // Monthly distribution for charts
    const monthlyStats = {
      organizations: getMonthlyCounts(organizations, "createdAt"),
      students: getMonthlyCounts(students, "createdAt"),
      exams: getMonthlyCounts(exams, "createdAt"),
    };

    // Quick totals for cards
    const quickStats = {
      totalOrganizations: await organizationModel.countDocuments(),
      totalStudents: await studentModel.countDocuments(),
      totalExams: await examModel.countDocuments(),
      totalExamAttempts: await examAttemptModel.countDocuments(),
      examsCreatedLast30Days: await examModel.countDocuments({ createdAt: { $gte: last30Days } }),
      upcomingExams: await examModel.countDocuments({ endTime: { $gte: now } }),
      completedExams: await examModel.countDocuments({ endTime: { $lt: now } }),
    };

    return NextResponse.json({
      success: true,
      quickStats,
      monthlyStats,
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
