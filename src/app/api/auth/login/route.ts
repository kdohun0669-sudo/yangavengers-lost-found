import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import { validateStudentId } from "@/lib/student-id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, password } = body;

    if (!studentId || !password) {
      return NextResponse.json(
        { error: "학번과 비밀번호를 입력해 주세요." },
        { status: 400 }
      );
    }

    const idError = validateStudentId(String(studentId));
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { studentId: String(studentId) },
    });

    if (!user || !(await verifyPassword(String(password), user.password))) {
      return NextResponse.json(
        { error: "학번 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    await createSession(toPublicUser(user));

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
