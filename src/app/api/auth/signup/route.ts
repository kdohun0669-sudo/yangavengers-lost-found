import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  hashPassword,
  toPublicUser,
} from "@/lib/auth";
import {
  validatePassword,
  validateStudentId,
} from "@/lib/student-id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, password, name, kakaoId } = body;

    if (!studentId || !password || !name || !kakaoId) {
      return NextResponse.json(
        { error: "모든 항목을 입력해 주세요." },
        { status: 400 }
      );
    }

    const idError = validateStudentId(String(studentId));
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    const pwError = validatePassword(String(password));
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 });
    }

    if (String(name).trim().length < 2) {
      return NextResponse.json(
        { error: "이름을 2자 이상 입력해 주세요." },
        { status: 400 }
      );
    }

    if (String(kakaoId).trim().length < 2) {
      return NextResponse.json(
        { error: "카카오톡 ID를 입력해 주세요." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { studentId: String(studentId) },
    });
    if (existing) {
      return NextResponse.json(
        { error: "이미 가입된 학번입니다." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        studentId: String(studentId),
        password: await hashPassword(String(password)),
        name: String(name).trim(),
        kakaoId: String(kakaoId).trim(),
      },
    });

    await createSession(toPublicUser(user));

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
