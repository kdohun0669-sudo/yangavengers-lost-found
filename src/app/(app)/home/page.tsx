"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemCard, { type ItemListItem } from "@/components/ItemCard";
import { APP_NAME, STORAGE_LOCATION } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemListItem[]>([]);
  const [query, setQuery] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    fetch("/api/items?type=FOUND")
      .then((r) => r.json())
      .then((d) => setItems((d.items ?? []).slice(0, 5)));
  }, []);

  return (
    <main className="px-4 py-6">
      <header className="mb-6">
        <p className="text-sm font-medium text-blue-600">양벤져스 고등학교</p>
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
      </header>

      <button
        type="button"
        onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
        className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm"
      >
        <span>🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }
          }}
          placeholder="무엇을 잃어버리셨나요?"
          className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
          onClick={(e) => e.stopPropagation()}
        />
      </button>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          href="/register?type=LOST"
          className="rounded-2xl bg-rose-50 px-4 py-5 text-center font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          <span className="text-2xl">😢</span>
          <p className="mt-2">분실했어요</p>
        </Link>
        <Link
          href="/register?type=FOUND"
          className="rounded-2xl bg-emerald-50 px-4 py-5 text-center font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          <span className="text-2xl">🎁</span>
          <p className="mt-2">주웠어요</p>
        </Link>
      </div>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">최근 습득물</h2>
          <Link href="/search?type=FOUND" className="text-sm text-blue-600">
            더보기
          </Link>
        </div>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">
              아직 등록된 습득물이 없습니다.
            </p>
          ) : (
            items.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setGuideOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-4 text-left font-semibold"
        >
          <span>💡 이용 방법</span>
          <span className="text-slate-400">{guideOpen ? "▲" : "▼"}</span>
        </button>
        {guideOpen && (
          <ol className="space-y-3 border-t border-slate-100 px-4 py-4 text-sm text-slate-600">
            <li>1. 분실 또는 습득 사실을 등록합니다.</li>
            <li>2. 학생회가 내용을 확인합니다.</li>
            <li>3. 학생회가 카카오톡으로 연락합니다.</li>
            <li>
              4. <strong>{STORAGE_LOCATION}</strong>에서 물건을 수령합니다.
            </li>
          </ol>
        )}
      </section>
    </main>
  );
}
