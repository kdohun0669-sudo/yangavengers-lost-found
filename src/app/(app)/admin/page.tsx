import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.isAdmin) {
    redirect("/home");
  }
  return <AdminPanel />;
}
