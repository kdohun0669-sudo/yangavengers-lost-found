import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const demoPassword = await bcrypt.hash("test1234", 10);

  const admin = await prisma.user.upsert({
    where: { studentId: "10101" },
    update: {},
    create: {
      studentId: "10101",
      password: adminPassword,
      name: "학생회",
      kakaoId: "yangavengers_admin",
      isAdmin: true,
    },
  });

  const demo = await prisma.user.upsert({
    where: { studentId: "10215" },
    update: {},
    create: {
      studentId: "10215",
      password: demoPassword,
      name: "김양벤",
      kakaoId: "demo_student",
      isAdmin: false,
    },
  });

  const existingItems = await prisma.item.count();
  if (existingItems === 0) {
    await prisma.item.createMany({
      data: [
        {
          type: "FOUND",
          title: "검은색 에어팟 케이스",
          category: "ELECTRONICS",
          location: "2층 복도",
          eventDate: new Date(),
          eventTimeNote: "점심시간",
          description:
            "케이스만 있고 이어폰은 없습니다. Apple 로고 스티커가 붙어 있어요.",
          status: "REVIEWING",
          authorId: demo.id,
        },
        {
          type: "LOST",
          title: "학생증",
          category: "WALLET",
          location: "매점 앞",
          eventDate: new Date(),
          eventTimeNote: "5교시",
          description: "양벤져스 고등학교 학생증, 이름 김양벤",
          status: "RECEIVED",
          authorId: demo.id,
        },
        {
          type: "FOUND",
          title: "남색 후드 집업",
          category: "CLOTHING",
          location: "체육관",
          eventDate: new Date(Date.now() - 86400000),
          eventTimeNote: "방과 후",
          description: "M사이즈, 왼쪽 소매에 작은 로고",
          status: "CONTACT_PENDING",
          authorId: admin.id,
        },
      ],
    });
  }

  console.log("Seed complete");
  console.log("Admin: 학번 10101 / 비밀번호 admin1234");
  console.log("Demo:  학번 10215 / 비밀번호 test1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
