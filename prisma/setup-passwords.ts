import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const customerPassword = await bcrypt.hash("customer693", 10);
  const supportPassword = await bcrypt.hash("support693", 10);

  await prisma.user.update({
    where: {
      id: 1,
    },
    data: {
      password: customerPassword,
    },
  });

  await prisma.user.update({
    where: {
      id: 2,
    },
    data: {
      password: supportPassword,
    },
  });

  console.log("Test user passwords updated successfully.");
}

main()
  .catch((error) => {
    console.error("Password setup error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });