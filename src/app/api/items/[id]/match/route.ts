import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { isPubliclyVisible } from "@/lib/items";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message = body.message?.trim() || null;

    const item = await prisma.item.findUnique({ where: { id } });

    if (!item || !isPubliclyVisible(item)) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (item.authorId === session.id) {
      return NextResponse.json(
        { error: "본인 글에는 매칭 요청을 할 수 없습니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.matchRequest.findUnique({
      where: {
        itemId_userId: { itemId: id, userId: session.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "이미 매칭 요청을 보냈습니다." },
        { status: 409 }
      );
    }

    await prisma.matchRequest.create({
      data: {
        itemId: id,
        userId: session.id,
        message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "매칭 요청에 실패했습니다." },
      { status: 500 }
    );
  }
}
