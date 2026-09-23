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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const role = String(body.role || "").trim();

    if (!id || !name || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and role are required.",
        },
        { status: 400 }
      );
    }

    if (!["SUPPORT", "ADMIN"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid support user role.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Support user not found.",
        },
        { status: 404 }
      );
    }

    const emailInUse = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

    if (emailInUse) {
      return NextResponse.json(
        {
          success: false,
          error: "That email address is already in use.",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        role: role as "SUPPORT" | "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update support user error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while updating the support user.",
      },
      { status: 500 }
    );
  }
}