"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatStudentId } from "@/lib/student-id";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body =
        mode === "login"
          ? { studentId, password }
          : { studentId, password, name, kakaoId };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "처리에 실패했습니다.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const preview =
    studentId.length === 5 && /^\d{5}$/.test(studentId)
      ? formatStudentId(studentId)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          학번 (5자리)
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={studentId}
          onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
          placeholder="10215"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
        {preview && (
          <p className="mt-1 text-xs text-blue-600">{preview}</p>
        )}
      </div>

      {mode === "signup" && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              카카오톡 ID
            </label>
            <input
              type="text"
              value={kakaoId}
              onChange={(e) => setKakaoId(e.target.value)}
              placeholder="학생회 연락용 (다른 사용자에게 비공개)"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "8자 이상, 영문+숫자" : "비밀번호"}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading
          ? "처리 중..."
          : mode === "login"
            ? "로그인"
            : "가입하기"}
      </button>
    </form>
  );
}
