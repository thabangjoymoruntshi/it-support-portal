import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Knowledge base fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while loading the knowledge base.",
      },
      { status: 500 }
    );
  }
}