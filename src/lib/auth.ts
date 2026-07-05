import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "yangavengers_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "yangavengers-dev-secret-change-in-production"
);

export type SessionUser = {
  id: string;
  studentId: string;
  name: string;
  isAdmin: boolean;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    isAdmin: user.isAdmin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      studentId: payload.studentId as string,
      name: payload.name as string,
      isAdmin: payload.isAdmin as boolean,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (!session.isAdmin) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function toPublicUser(user: {
  id: string;
  studentId: string;
  name: string;
  isAdmin: boolean;
}) {
  return {
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}

export async function getUserWithKakao(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      studentId: true,
      name: true,
      kakaoId: true,
      isAdmin: true,
    },
  });
}
