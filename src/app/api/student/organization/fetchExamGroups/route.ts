import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export const POST = async (req: requestType) => {
    try {

        await dbConnect()

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { organizationId } = await req.json();

        if (!organizationId) {
            return NextResponse.json({ success: false, error: "Organization ID is required" }, { status: 400 });
        }

        const organizationDetails = await organizationModel.findById(organizationId).populate({
            path: "examGroups",
            populate: {
                path: "subjects",
                // model: "subject",
            }
        })
        if (!organizationDetails) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        if (organizationDetails?.students?.includes(req.user.id)) {
            return NextResponse.json({ success: false, error: "You are already a member of this organization" }, { status: 400 });
        }

        const activeExamGroups = organizationDetails?.examGroups?.filter((grp: any) => grp.status === 'ACTIVE')

        if (activeExamGroups.length === 0) {
            return NextResponse.json({ success: false, error: "No active exam groups found" }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: activeExamGroups }, { status: 200 });

    } catch (error) {
        console.log("Error while fetching exam groups : ", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}