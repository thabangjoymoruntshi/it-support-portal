import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["SUPPORT", "ADMIN"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Support users error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while loading support staff.",
      },
      { status: 500 }
    );
  }
}