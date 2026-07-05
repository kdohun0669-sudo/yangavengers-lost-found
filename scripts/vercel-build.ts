import "dotenv/config";
import { execSync } from "child_process";

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  console.log("Turso DB 스키마 동기화...");
  execSync("tsx scripts/push-turso.ts", { stdio: "inherit" });
} else {
  console.log("Turso 환경 변수 없음 — 로컬 DB 사용 (prisma db push 생략)");
}
