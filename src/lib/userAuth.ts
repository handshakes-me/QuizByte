// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromCookies(requiredRole?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    if (requiredRole && decoded.role !== requiredRole) return null;
    return decoded;
  } catch {
    return null;
  }
}
