import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
  user: {
    id: string;
    role: string;
  };
}

export function authorizeRole(requiredRole: string) {
  return function (req: requestType) {

    try {
      const response = auth(req)
      if (response instanceof NextResponse) {
        return response;
      }

      // Check if user has the required role
      if (req?.user?.role !== requiredRole) {
        return NextResponse.json({ success: false, error: `Forbidden - you do not have access to this resource` }, { status: 403 });
      }

      console.log(`${requiredRole} authorized...`)

    } catch (error) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }
  };
}

export const auth = (req: NextRequest) => {
  try {
    // Get the JWT token from cookies
    const cookies = req.cookies || {};
    const token = cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized - No token provided" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    (req as any).user = decoded;

    console.log("decoded token: ", decoded)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
  }
};

export const isSuperAdmin = authorizeRole("SUPERADMIN");
export const isAdmin = authorizeRole("ADMIN");
export const isStudent = authorizeRole("STUDENT");