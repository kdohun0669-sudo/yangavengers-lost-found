import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg">
          🔍
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-slate-600">
          학번과 비밀번호로 로그인하세요
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <AuthForm mode="login" />
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        처음이신가요?{" "}
        <Link href="/signup" className="font-semibold text-blue-600">
          가입하기
        </Link>
      </p>
    </main>
  );
}
