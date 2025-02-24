import dbConnect from "@/config/dbConnect";
import { isSuperAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    try {

        await dbConnect();

        const id = params.id

        if (!id) {
            return NextResponse.json({ success: false, error: "Organization ID is required" }, { status: 400 });
        }

        const organization = await organizationModel.findById(id);

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: organization }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }

}

export async function PATCH(req: requestType, { params }: { params: { id: string } }) {
    try {

        await dbConnect();

        // Run the authorization middleware
        const authResponse = isSuperAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }
        
        const { name, email, contactNumber } = await req.json();
        const id = params.id

        if (!id) {
            return NextResponse.json({ success: false, error: "Organization ID is required" }, { status: 400 });
        }

        const organization = await organizationModel.findById(id);

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const user = await adminModel.findById(req.user.id)
        if(!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if(user.organizationId.toString() !== organization._id) {
            return NextResponse.json({ success: false, error: "You are not authorized to update this organization" }, { status: 403 });
        }

        if (name) organization.name = name;
        if (email) organization.email = email;
        if (contactNumber) organization.contactNumber = contactNumber;

        await organization.save();

        return NextResponse.json({ success: true, data: organization }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }

}