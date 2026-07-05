"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItemCard, { type ItemListItem } from "@/components/ItemCard";
import { formatStudentId } from "@/lib/student-id";

type User = {
  studentId: string;
  name: string;
  isAdmin: boolean;
};

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ItemListItem[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
    fetch("/api/items?mine=true")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">내 정보</h1>

      {user && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-600">
            {formatStudentId(user.studentId)}
          </p>
          {user.isAdmin && (
            <span className="mt-2 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              학생회 관리자
            </span>
          )}
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">내가 올린 글</h2>
        <span className="text-sm text-slate-500">{items.length}건</span>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="text-slate-500">아직 등록한 글이 없습니다.</p>
            <Link
              href="/register"
              className="mt-3 inline-block text-sm font-semibold text-blue-600"
            >
              등록하러 가기
            </Link>
          </div>
        ) : (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600"
      >
        로그아웃
      </button>
    </main>
  );
}
