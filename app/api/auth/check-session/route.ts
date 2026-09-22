import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("CHECK SESSION:", session);

    return NextResponse.json({
      authenticated: !!session,
      email: session?.user?.email ?? null,
      name: session?.user?.name ?? null,
      role: session?.user?.role ?? null,
    });
  } catch (error) {
    console.error("CHECK SESSION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to check session.",
      },
      {
        status: 500,
      }
    );
  }
}