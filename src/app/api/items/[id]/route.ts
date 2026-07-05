import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth";
import { isPubliclyVisible, toItemResponse } from "@/lib/items";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, studentId: true, name: true, kakaoId: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    const isAuthor = item.authorId === session.id;
    const canView =
      session.isAdmin || isAuthor || isPubliclyVisible(item);

    if (!canView) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    let hasMatchRequest = false;
    if (!session.isAdmin && !isAuthor) {
      const mine = await prisma.matchRequest.findUnique({
        where: { itemId_userId: { itemId: id, userId: session.id } },
      });
      hasMatchRequest = !!mine;
    }

    let matchRequests:
      | Array<{
          id: string;
          message: string | null;
          createdAt: string;
          user: { studentId: string; name: string; kakaoId: string };
        }>
      | undefined;

    if (session.isAdmin) {
      const requests = await prisma.matchRequest.findMany({
        where: { itemId: id },
        include: {
          user: {
            select: { studentId: true, name: true, kakaoId: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      matchRequests = requests.map((r) => ({
        id: r.id,
        message: r.message,
        createdAt: r.createdAt.toISOString(),
        user: r.user,
      }));
    }

    const response = toItemResponse(item, {
      includeAuthorPrivate: session.isAdmin,
    });

    return NextResponse.json({
      item: response,
      isAuthor,
      hasMatchRequest,
      matchRequests,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "상세 정보를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { status, adminNote } = body;

    const data: {
      status?: string;
      adminNote?: string | null;
      completedAt?: Date | null;
    } = {};

    if (status) {
      data.status = status;
      if (status === "COMPLETED") {
        data.completedAt = new Date();
      }
      if (status !== "COMPLETED") {
        data.completedAt = null;
      }
    }
    if (adminNote !== undefined) {
      data.adminNote = adminNote || null;
    }

    const item = await prisma.item.update({
      where: { id },
      data,
      include: {
        author: { select: { studentId: true, name: true, kakaoId: true } },
        _count: { select: { matchRequests: true } },
      },
    });

    return NextResponse.json({
      item: toItemResponse(item, { includeAuthorPrivate: true }),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }
    return NextResponse.json(
      { error: "상태 변경에 실패했습니다." },
      { status: 500 }
    );
  }
}
