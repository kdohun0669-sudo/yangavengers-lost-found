import { COMPLETED_HIDE_DAYS } from "./constants";

export function parsePhotos(photos: string): string[] {
  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isPubliclyVisible(item: {
  status: string;
  completedAt: Date | null;
}): boolean {
  if (item.status === "HIDDEN") return false;
  if (item.status !== "COMPLETED") return true;
  if (!item.completedAt) return true;

  const hideAfter = new Date(item.completedAt);
  hideAfter.setDate(hideAfter.getDate() + COMPLETED_HIDE_DAYS);
  return new Date() < hideAfter;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toItemResponse(
  item: {
    id: string;
    type: string;
    title: string;
    category: string;
    location: string;
    eventDate: Date;
    eventTimeNote: string | null;
    description: string;
    photos: string;
    contactTime: string | null;
    status: string;
    adminNote: string | null;
    completedAt: Date | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author?: { studentId: string; name: string; kakaoId?: string };
    _count?: { matchRequests: number };
  },
  options?: { includeAuthorPrivate?: boolean }
) {
  const base = {
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    location: item.location,
    eventDate: item.eventDate.toISOString(),
    eventTimeNote: item.eventTimeNote,
    description: item.description,
    photos: parsePhotos(item.photos),
    contactTime: item.contactTime,
    status: item.status,
    completedAt: item.completedAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    matchRequestCount: item._count?.matchRequests ?? 0,
  };

  if (options?.includeAuthorPrivate && item.author) {
    return {
      ...base,
      author: {
        studentId: item.author.studentId,
        name: item.author.name,
        kakaoId: item.author.kakaoId,
      },
    };
  }

  return base;
}
