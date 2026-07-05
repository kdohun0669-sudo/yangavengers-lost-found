import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { createClient } from "@libsql/client";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error("TURSO_DATABASE_URL 과 TURSO_AUTH_TOKEN 이 필요합니다.");
  process.exit(1);
}

async function main() {
  const client = createClient({ url, authToken: token });
  const sqlPath = path.resolve(
    process.cwd(),
    "prisma/migrations/20260705055600_init/migration.sql"
  );
  const sql = fs.readFileSync(sqlPath, "utf8");

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log("Turso DB에 스키마 적용 중...");

  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("already exists")) continue;
      throw error;
    }
  }

  console.log("완료!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
