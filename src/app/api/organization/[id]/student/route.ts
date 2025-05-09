import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

// join organization
export const POST = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {
        await dbConnect();

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { prn, token } = await req.json() || {};
        const { id } = await params;
        const userId = req.user.id;

        if (!prn || !token) {
            return NextResponse.json({ success: false, error: "PRN is required" }, { status: 400 });
        }

        const organization = await organizationModel.findById(id);
        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const user = await studentModel.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (organization.inviteLink !== token) {
            return NextResponse.json({ success: false, error: "Invalid invitation token" }, { status: 401 });
        }

        const studentExists = organization.students.some((s: { email: string }) => s.email === user.email);
        if (!studentExists) {
            organization.students.push({ name: user.name, email: user.email, prn });
        }

        const isOrgAlreadyAdded = user.organizations.some((orgId: string) => orgId.toString() === organization._id.toString());
        if (!isOrgAlreadyAdded) {
            user.organizations.push(organization._id);
        }

        await organization.save();
        await user.save();

        return NextResponse.json({ success: true, message: "Joined organization successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error joining organization:", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
};

// leave organization
export const DELETE = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {
        await dbConnect();

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { id } = await params;
        const userId = req.user.id;

        const organization = await organizationModel.findById(id);
        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const user = await studentModel.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const studentIndex = organization.students.findIndex((s: { email: string }) => s.email === user.email);
        if (studentIndex !== -1) {
            organization.students.splice(studentIndex, 1);
        } else {
            return NextResponse.json({ success: false, error: "Student not found in organization" }, { status: 404 });
        }

        const orgIndex = user.organizations.findIndex((orgId: string) => orgId.toString() === organization._id.toString());
        if (orgIndex !== -1) {
            user.organizations.splice(orgIndex, 1);
        }

        await organization.save();
        await user.save();

        return NextResponse.json({ success: true, message: "Left organization successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error leaving organization:", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
};
