import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { isPubliclyVisible, toItemResponse } from "@/lib/items";
import { CATEGORIES, ITEM_TYPES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim() ?? "";
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const days = searchParams.get("days");
    const mine = searchParams.get("mine") === "true";
    const admin = searchParams.get("admin") === "true";
    const session = await requireSession();

    if (admin && !session.isAdmin) {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const items = await prisma.item.findMany({
      where: {
        ...(mine ? { authorId: session.id } : {}),
        ...(type && type in ITEM_TYPES ? { type } : {}),
        ...(category && category in CATEGORIES ? { category } : {}),
        ...(days
          ? {
              createdAt: {
                gte: new Date(
                  Date.now() - parseInt(days, 10) * 24 * 60 * 60 * 1000
                ),
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { location: { contains: q } },
              ],
            }
          : {}),
      },
      include: {
        author: admin
          ? { select: { studentId: true, name: true, kakaoId: true } }
          : false,
        _count: admin ? { select: { matchRequests: true } } : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    const filtered = admin
      ? items
      : items.filter((item) => isPubliclyVisible(item));

    return NextResponse.json({
      items: filtered.map((item) =>
        toItemResponse(item, { includeAuthorPrivate: admin })
      ),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const {
      type,
      title,
      category,
      location,
      eventDate,
      eventTimeNote,
      description,
      photos,
      contactTime,
    } = body;

    if (!type || !(type in ITEM_TYPES)) {
      return NextResponse.json({ error: "유형을 선택해 주세요." }, { status: 400 });
    }
    if (!title?.trim()) {
      return NextResponse.json({ error: "제목을 입력해 주세요." }, { status: 400 });
    }
    if (!category || !(category in CATEGORIES)) {
      return NextResponse.json({ error: "분류를 선택해 주세요." }, { status: 400 });
    }
    if (!location?.trim()) {
      return NextResponse.json({ error: "장소를 입력해 주세요." }, { status: 400 });
    }
    if (!eventDate) {
      return NextResponse.json({ error: "날짜를 선택해 주세요." }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "설명을 입력해 주세요." }, { status: 400 });
    }

    const photoList = Array.isArray(photos) ? photos.slice(0, 3) : [];

    const item = await prisma.item.create({
      data: {
        type,
        title: title.trim(),
        category,
        location: location.trim(),
        eventDate: new Date(eventDate),
        eventTimeNote: eventTimeNote || null,
        description: description.trim(),
        photos: JSON.stringify(photoList),
        contactTime: contactTime?.trim() || null,
        authorId: session.id,
      },
    });

    return NextResponse.json({ item: toItemResponse(item) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    return NextResponse.json(
      { error: "등록 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
