import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

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
  const customer = await prisma.user.upsert({
    where: {
      email: "customer@example.com",
    },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@example.com",
      password: "test123",
      role: "CUSTOMER",
    },
  });

  console.log("Customer created:", customer.email);

  const support = await prisma.user.upsert({
    where: {
      email: "support@example.com",
    },
    update: {},
    create: {
      name: "Avenqora Support",
      email: "support@example.com",
      password: "support123",
      role: "SUPPORT",
    },
  });

  console.log("Support user created:", support.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });