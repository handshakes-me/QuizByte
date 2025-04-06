import adminModel from "@/models/admin.model";
import organizationModel from "@/models/organization.model";
import superAdminModel from "@/models/superAdmin.model";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/utils/sendmail";
import studentModel from "@/models/student.model";
import { render } from "@react-email/components";
import { Welcome } from "../../../../../emails/welcome";
import dbConnect from "@/config/dbConnect";
import jwt from "jsonwebtoken";

type ResponseData = {
    success: boolean
    message?: string
    error?: string
    data?: any
}

const superAdminToken = process.env.SUPERADMIN_TOKEN!;

export async function POST(req: NextRequest) {

    await dbConnect();

    try {
        const {
            email,
            password,
            confirmPassword,
            name,
            role,
            token,
            organizationId
        } = await req.json();

        if (!role) {
            return NextResponse.json({ success: false, error: "Role is required" }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ success: false, error: "Password and confirm password do not match" }, { status: 400 })
        }

        if (role !== "SUPERADMIN" && role !== "ADMIN" && role !== "STUDENT") {
            return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
        }

        if (role === "SUPERADMIN") {

            if (!token || !email || !password || !name) {
                return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
            }

            if (token !== superAdminToken) {
                return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
            }

            const isExists =
                await superAdminModel.findOne({ email }) ||
                await adminModel.findOne({ email }) ||
                await studentModel.findOne({ email });

            if (isExists) {
                return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new superAdminModel({
                email,
                password: hashedPassword,
                name,
                role,
            })

            await user.save();

            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

            // send mail
            const html = await render(Welcome({ username: name, token: verificationToken }));
            await sendMail(email, "Welcome to the platform", html);

            user.password = undefined

            return NextResponse.json({ success: true, message: "Super Admin registered successfully", data: user }, { status: 201 });
        }

        else if (role === "ADMIN") {
            const isExists =
                await superAdminModel.findOne({ email }) ||
                await adminModel.findOne({ email }) ||
                await studentModel.findOne({ email });

            if (isExists) {
                return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
            }

            if (!name || !password || !email || !token) {
                return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
            }

            const organization = await organizationModel.findOne({ token });

            if (!organization) {
                return NextResponse.json({ success: false, error: "Admin token has already been used." }, { status: 404 });
            }

            if (!organization.token || organization.token !== token) {
                return NextResponse.json({ success: false, error: "Invalid Admin token" }, { status: 401 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new adminModel({
                email,
                password: hashedPassword,
                name,
                role,
                organizationId: organization._id,
            })

            await user.save();

            user.password = undefined

            organization.token = null;
            await organization.save();

            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

            // send mail
            const html = await render(Welcome({ username: name, token: verificationToken }));
            await sendMail(email, "Welcome to the platform", html);

            return NextResponse.json({ success: true, message: "Admin registered successfully", data: user }, { status: 201 });
        }

        else if (role === 'STUDENT') {
            if (!name || !password || !email) {
                return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
            }

            const isExists =
                await superAdminModel.findOne({ email }) ||
                await adminModel.findOne({ email }) ||
                await studentModel.findOne({ email });

            if (isExists) {
                return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new studentModel({
                email,
                password: hashedPassword,
                name,
                role,
            })

            await user.save();

            const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

            // sehd mail
            const html = await render(Welcome({ username: name, token: verificationToken }));
            await sendMail(email, "Welcome to the platform", html);

            user.password = undefined

            return NextResponse.json({ success: true, message: "Student registered successfully", data: user }, { status: 201 });
        }

    } catch (e) {
        console.log("Something went wrong while registering the user", e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
} 