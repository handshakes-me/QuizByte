import dbConnect from "@/config/dbConnect";
import { isSuperAdmin } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

// get organization by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        await dbConnect();

        const { id } = await params

        if (!id) {
            return NextResponse.json({ success: false, error: "Organization ID is required" }, { status: 400 });
        }

        const organization = await organizationModel.findById(id).populate("examGroups").populate("students");

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: organization }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }

}

// update organization by id
export async function PATCH(req: requestType, { params }: { params: Promise<{ id: string }> }) {
    try {

        await dbConnect();

        // Run the authorization middleware
        const authResponse = isSuperAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { name, contactNumber } = await req.json();
        const { id } = await params

        if (!id) {
            return NextResponse.json({ success: false, error: "Organization ID is required" }, { status: 400 });
        }

        const organization = await organizationModel.findById(id);

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        if (name) organization.name = name;
        if (contactNumber) organization.contactNumber = contactNumber;

        await organization.save();

        return NextResponse.json({ success: true, data: organization }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}