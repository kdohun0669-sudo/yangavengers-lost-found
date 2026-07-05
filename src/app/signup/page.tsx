import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { APP_NAME } from "@/lib/constants";

export default function SignupPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link href="/login" className="text-sm text-blue-600">
          ← 로그인으로
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">가입하기</h1>
        <p className="mt-2 text-sm text-slate-600">
          {APP_NAME}는 양벤져스 학교 구성원만 이용할 수 있습니다.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <AuthForm mode="signup" />
      </div>

      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium">학번 형식</p>
        <p className="mt-1">5자리 숫자 = 학년(1) + 반(2) + 번호(2)</p>
        <p className="mt-1 text-blue-700">예: 10215 → 1학년 2반 15번</p>
      </div>
    </main>
  );
}
