"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "홈", icon: "🏠" },
  { href: "/search", label: "찾기", icon: "🔍" },
  { href: "/register", label: "등록", icon: "➕" },
  { href: "/my", label: "내 정보", icon: "👤" },
];

export default function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const allTabs = isAdmin
    ? [...tabs, { href: "/admin", label: "관리", icon: "⚙️" }]
    : tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {allTabs.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-xs transition ${
                active
                  ? "font-semibold text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
