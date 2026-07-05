"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryIcon, StatusBadge, TypeBadge } from "@/components/Badges";
import StatusTimeline from "@/components/StatusTimeline";
import {
  CATEGORIES,
  STORAGE_LOCATION,
  type Category,
} from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/items";

type ItemDetail = {
  id: string;
  type: string;
  title: string;
  category: string;
  location: string;
  eventDate: string;
  eventTimeNote: string | null;
  description: string;
  photos: string[];
  contactTime: string | null;
  status: string;
  createdAt: string;
  author?: { studentId: string; name: string; kakaoId: string };
};

type MatchRequest = {
  id: string;
  message: string | null;
  createdAt: string;
  user: { studentId: string; name: string; kakaoId: string };
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<ItemDetail | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [hasMatchRequest, setHasMatchRequest] = useState(false);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/items/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "글을 불러올 수 없습니다.");
      setLoading(false);
      return;
    }
    setItem(data.item);
    setIsAuthor(data.isAuthor);
    setHasMatchRequest(data.hasMatchRequest);
    setMatchRequests(data.matchRequests ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function requestMatch() {
    setError("");
    setSuccess("");
    const res = await fetch(`/api/items/${id}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "요청에 실패했습니다.");
      return;
    }
    setSuccess("학생회에 매칭 요청을 보냈습니다. 카카오톡으로 연락드릴 예정입니다.");
    setHasMatchRequest(true);
    load();
  }

  async function updateStatus(status: string) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  if (loading) {
    return (
      <main className="px-4 py-6">
        <p className="text-center text-slate-500">불러오는 중...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="px-4 py-6">
        <p className="text-center text-rose-600">{error || "글을 찾을 수 없습니다."}</p>
      </main>
    );
  }

  const categoryLabel =
    CATEGORIES[item.category as Category]?.label ?? item.category;
  const isAdminView = !!item.author;

  return (
    <main className="px-4 py-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 text-sm text-blue-600"
      >
        ← 뒤로
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              <CategoryIcon category={item.category} />
            </span>
            <div>
              <TypeBadge type={item.type} />
              <h1 className="mt-1 text-xl font-bold">{item.title}</h1>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">분류</dt>
            <dd className="font-medium">{categoryLabel}</dd>
          </div>
          <div>
            <dt className="text-slate-500">장소</dt>
            <dd className="font-medium">{item.location}</dd>
          </div>
          <div>
            <dt className="text-slate-500">날짜</dt>
            <dd className="font-medium">
              {formatDate(item.eventDate)}
              {item.eventTimeNote ? ` · ${item.eventTimeNote}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">설명</dt>
            <dd className="whitespace-pre-wrap font-medium">{item.description}</dd>
          </div>
          {item.contactTime && (
            <div>
              <dt className="text-slate-500">연락 가능 시간</dt>
              <dd className="font-medium">{item.contactTime}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500">등록일</dt>
            <dd className="font-medium">{formatDateTime(item.createdAt)}</dd>
          </div>
        </dl>

        {item.photos.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {item.photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-32 w-32 shrink-0 rounded-xl object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {isAuthor && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold">처리 상태</h2>
          <StatusTimeline status={item.status} />
          <p className="mt-4 text-sm text-slate-600">
            학생회가 확인 후 카카오톡으로 연락합니다. 수령 장소:{" "}
            <strong>{STORAGE_LOCATION}</strong>
          </p>
        </section>
      )}

      {isAdminView && item.author && (
        <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="mb-3 font-semibold text-blue-900">관리자 정보</h2>
          <p className="text-sm">
            작성자: {item.author.name} ({item.author.studentId})
          </p>
          <p className="text-sm text-blue-800">
            카카오톡: {item.author.kakaoId}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["REVIEWING", "CONTACT_PENDING", "COMPLETED", "HIDDEN"].map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(s)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                >
                  {s === "REVIEWING"
                    ? "확인 중"
                    : s === "CONTACT_PENDING"
                      ? "연락 대기"
                      : s === "COMPLETED"
                        ? "완료"
                        : "숨김"}
                </button>
              )
            )}
          </div>
        </section>
      )}

      {matchRequests.length > 0 && (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-3 font-semibold">매칭 요청</h2>
          <ul className="space-y-3">
            {matchRequests.map((r) => (
              <li key={r.id} className="rounded-xl bg-white p-3 text-sm">
                <p className="font-medium">
                  {r.user.name} ({r.user.studentId})
                </p>
                <p className="text-blue-700">카톡: {r.user.kakaoId}</p>
                {r.message && (
                  <p className="mt-1 text-slate-600">{r.message}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isAuthor && !isAdminView && item.status !== "COMPLETED" && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 font-semibold">
            {item.type === "LOST" ? "제가 주웠어요" : "이게 제 물건이에요"}
          </h2>
          <p className="mb-3 text-sm text-slate-600">
            학생회에 매칭 요청을 보내면 카카오톡으로 연락드립니다.
          </p>
          {!hasMatchRequest && (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="추가 설명 (선택)"
              rows={3}
              className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          )}
          {error && (
            <p className="mb-3 text-sm text-rose-600">{error}</p>
          )}
          {success && (
            <p className="mb-3 text-sm text-green-700">{success}</p>
          )}
          <button
            type="button"
            disabled={hasMatchRequest}
            onClick={requestMatch}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white disabled:bg-slate-300"
          >
            {hasMatchRequest ? "요청 완료" : "매칭 요청 보내기"}
          </button>
        </section>
      )}
    </main>
  );
}
