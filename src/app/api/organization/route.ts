import dbConnect from "@/config/dbConnect";
import organizationModel from "@/models/organization.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin, isStudent, isSuperAdmin } from '@/middlewares/authMiddleware';
import superAdminModel from "@/models/superAdmin.model";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function POST(req: requestType) {

    try {

        await dbConnect();

        // Run the authorization middleware
        const authResponse = isSuperAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { name, email, contactNumber } = await req.json();
        const userId = req.user.id

        if (!name || !email || !contactNumber) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const user = await superAdminModel.findById(userId)

        if(!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
    
        const isUnique = await organizationModel.findOne({ email });

        if (isUnique) {
            return NextResponse.json({ success: false, error: "This Organization already exists" }, { status: 400 });
        }

        const adminToken = crypto.randomBytes(32).toString("hex");
        const inviteLinkToken = crypto.randomBytes(32).toString("hex");
        // const inviteLink = `${process.env.NEXT_BASE_URL}/register?token=${inviteLinkToken}`;
        // const adminLink = `${process.env.NEXT_BASE_URL}/register?token=${adminToken}`;

        const organization = new organizationModel({
            name,
            email,
            contactNumber,
            token: adminToken,
            inviteLink: inviteLinkToken,
        });
        
        user.organizationId = organization._id
        await user.save();

        await organization.save();

        return NextResponse.json({
            success: true,
            data: organization,
            message: "Organization created successfully"
        }, { status: 201 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: requestType) {

    try {

        await dbConnect();

        // Run the authorization middleware
        const authResponse = isSuperAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const organizations = await organizationModel.find();

        return NextResponse.json({
            success: true,
            data: organizations,
            message: "Organizations fetched successfully"
        }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}