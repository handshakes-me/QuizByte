import dbConnect from "@/config/dbConnect";
import { auth } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, { params }: { params: Promise<{ token: string }> }) => {
    try {

        await dbConnect();

        const authResponse = auth(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { token } = await params;
        console.log("token: ", token);

        const organization = await organizationModel.findOne({ inviteLink: token });
        if (!organization) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 400 });
        }

        return NextResponse.json({ data: organization, success: true, message: "Organization found" }, { status: 200 });

    } catch (error) {
        console.log("Error while fetching organization by token : ", error)
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}