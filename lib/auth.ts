import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "skillbridge_super_secure_jwt_secret_key_2026_sih26044";
export const COOKIE_NAME = "skillbridge_session";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "FACULTY" | "INDUSTRY" | "INSTITUTION" | "ADMIN";
  avatarUrl?: string | null;
  profileId?: string;
  companyName?: string;
  institutionName?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifySessionToken(token);
    if (!decoded) return null;

    // Verify user is active in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) return null;
    return decoded;
  } catch {
    return null;
  }
}
