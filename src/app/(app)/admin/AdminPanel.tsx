"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ItemCard, { type ItemListItem } from "@/components/ItemCard";
import { STATUSES, type ItemStatus } from "@/lib/constants";

type AdminItem = ItemListItem & {
  author?: { studentId: string; name: string; kakaoId: string };
  matchRequestCount?: number;
};

const TABS: { key: string; label: string; statuses: ItemStatus[] }[] = [
  { key: "pending", label: "대기", statuses: ["RECEIVED"] },
  {
    key: "processing",
    label: "처리 중",
    statuses: ["REVIEWING", "CONTACT_PENDING"],
  },
  { key: "done", label: "완료", statuses: ["COMPLETED"] },
  { key: "hidden", label: "숨김", statuses: ["HIDDEN"] },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/items?admin=true");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "불러오기 실패");
        return;
      }
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const current = TABS.find((t) => t.key === tab)!;
  const filtered = items.filter((item) =>
    current.statuses.includes(item.status as ItemStatus)
  );

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadItems();
  }

  return (
    <main className="px-4 py-6">
      <h1 className="mb-1 text-xl font-bold">학생회 관리</h1>
      <p className="mb-4 text-sm text-slate-600">
        등록 확인 · 카카오톡 연락 · 상태 변경
      </p>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-12 text-center text-slate-500">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
          해당 상태의 글이 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <ItemCard item={item} />
              {item.author && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                  <p>
                    <strong>{item.author.name}</strong> ({item.author.studentId})
                  </p>
                  <p className="text-blue-700">카톡: {item.author.kakaoId}</p>
                </div>
              )}
              {(item.matchRequestCount ?? 0) > 0 && (
                <p className="mt-2 text-sm text-amber-700">
                  매칭 요청 {item.matchRequestCount}건
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(STATUSES).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateStatus(item.id, key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      item.status === key
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
              <Link
                href={`/items/${item.id}`}
                className="mt-3 inline-block text-sm text-blue-600"
              >
                상세 보기 →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
