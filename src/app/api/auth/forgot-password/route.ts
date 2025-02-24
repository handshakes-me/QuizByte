import dbConnect from "@/config/dbConnect";
import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { render } from "@react-email/components";
import DropboxResetPasswordEmail from "../../../../../emails/ResetPassword";
import { sendMail } from "@/utils/sendmail";

export async function POST(req: NextRequest) {

    await dbConnect()

    const { email } = await req.json()

    if (!email) {
        return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    try {

        const user =
            await superAdminModel.findOne({ email }) ||
            await adminModel.findOne({ email }) ||
            await studentModel.findOne({ email })

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        const token = crypto.randomBytes(20).toString('hex')

        const tamplate = await render(DropboxResetPasswordEmail({ username: user?.name, resetToken: token }))
        await sendMail(email, "Reset your password", tamplate)

        user.resetPasswordToken = token
        await user.save()

        return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 })

    } catch (e) {
        console.log("error ", e)
        return NextResponse.json({ success: false, error: "Error verifying email" }, { status: 500 })
    }
}