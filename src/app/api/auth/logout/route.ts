import { auth } from "@/middlewares/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function POST(req: requestType) {
    try {

        // const authResponse = auth(req);
        // if (authResponse instanceof NextResponse) {
        //     return authResponse;
        // }

        // const user = req?.user;

        const response = NextResponse.json({
            success: true,
            message: "User logged in successfully",
        })

        // if(user.id && user.role) {
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        // }

        return response;

    } catch (e) {
        console.log("Error while logging out user : ", e);

        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: e
        }, { status: 500 })
    }
}