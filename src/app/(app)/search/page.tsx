"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ItemCard, { type ItemListItem } from "@/components/ItemCard";
import { CATEGORIES, ITEM_TYPES } from "@/lib/constants";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<ItemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [days, setDays] = useState(searchParams.get("days") ?? "");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (days) params.set("days", days);

    fetch(`/api/items?${params}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, [q, type, category, days]);

  function applyFilters(next: {
    q?: string;
    type?: string;
    category?: string;
    days?: string;
  }) {
    const nq = next.q ?? q;
    const nt = next.type ?? type;
    const nc = next.category ?? category;
    const nd = next.days ?? days;
    setQ(nq);
    setType(nt);
    setCategory(nc);
    setDays(nd);

    const params = new URLSearchParams();
    if (nq) params.set("q", nq);
    if (nt) params.set("type", nt);
    if (nc) params.set("category", nc);
    if (nd) params.set("days", nd);
    router.replace(`/search?${params.toString()}`);
  }

  return (
    <main className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">찾기</h1>

      <input
        type="search"
        value={q}
        onChange={(e) => applyFilters({ q: e.target.value })}
        placeholder="제목, 설명, 장소 검색"
        className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm outline-none focus:border-blue-500"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => applyFilters({ type: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">전체 유형</option>
          {Object.entries(ITEM_TYPES).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => applyFilters({ category: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">전체 분류</option>
          {Object.entries(CATEGORIES).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
        <select
          value={days}
          onChange={(e) => applyFilters({ days: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">전체 기간</option>
          <option value="7">최근 7일</option>
          <option value="30">최근 30일</option>
        </select>
      </div>

      {loading ? (
        <p className="py-12 text-center text-slate-500">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="px-4 py-6">불러오는 중...</main>}>
      <SearchContent />
    </Suspense>
  );
}
