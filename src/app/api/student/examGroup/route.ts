import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examGroupModel from "@/models/examGroup.model";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

export const POST = async (req: requestType) => {
    try {

        // db connection
        await dbConnect()

        // authentication
        const authResponse = isStudent(req)
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        // parameters
        const { id } = req.user
        const { examGroupId } = await req.json()

        // exam group validation
        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        // organization validation
        const oraganization = await organizationModel.findById(examGroup?.organizationId)
        if (!oraganization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        // user validation
        const user = await studentModel.findById(id)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // validate if user is a member of the organization
        const userInOrg = oraganization.students.find((e: { email: string }) => e?.email === user.email)
        if (!userInOrg) {
            return NextResponse.json({ success: false, error: `You are not a student at ${oraganization.name}` }, { status: 404 });
        }
        
        // update exam group
        const alreadyEnrolled = examGroup.students.some((s: { email: string }) => s.email === user.email)
        if (!alreadyEnrolled) {
            examGroup.students.push({ 
                name: user.name, 
                email: user.email, 
                prn: userInOrg.prn,
                joined: new Date()
            })
            await examGroup.save()
        }

        return NextResponse.json({ success: true, message: "Exam group joined successfully", data: examGroup }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
