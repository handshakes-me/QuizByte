import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import adminModel from "@/models/admin.model";
interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function PATCH(request: requestType, context: { params: { id: string } }) {
    try {
        await dbConnect();

        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }
        const { id } = await context.params;

        const organization = await organizationModel.findById(id);

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const user = await adminModel.findById(request.user.id)

        if (user.organizationId.toString() !== organization._id.toString()) {
            return NextResponse.json({ success: false, error: "You are not authorized to update this organization" }, { status: 403 });
        }

        const newToken = crypto.randomBytes(32).toString("hex");
        organization.inviteLink = newToken;

        await organization.save();

        return NextResponse.json({ success: true, message: "Invitation link refreshed successfully", data: newToken }, { status: 200 });

    } catch (e) {
        console.log("Error while refreshing invitation link : ", e)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}