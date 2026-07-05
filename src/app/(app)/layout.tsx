import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { getSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-slate-50 pb-20">
      {children}
      <BottomNav isAdmin={session.isAdmin} />
    </div>
  );
}
