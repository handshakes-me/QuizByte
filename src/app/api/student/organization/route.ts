import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export const GET = async (req: requestType) => {

    try {
        await dbConnect();

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const userId = req.user.id;

        const user = await studentModel.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const organizations = await organizationModel.find({
            students: {
                $elemMatch: { email: user?.email }
            }
        }).populate([
            {
                path: "examGroups",
                select: "name description exams subjects status"
            }
        ]).lean();
        if (!organizations) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        organizations.forEach((org: any) => {
            const activeExamGroups = org.examGroups.filter((grp: any) => grp.status === 'ACTIVE')
            org.examGroups = activeExamGroups;
            delete org.inviteLink;
            delete org.token;
            org.students = org?.students?.length;
        });

        return NextResponse.json({ success: true, message: "oraganizations found", data: organizations }, { status: 200 });

    } catch (error) {
        console.error("Error getting student:", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
};