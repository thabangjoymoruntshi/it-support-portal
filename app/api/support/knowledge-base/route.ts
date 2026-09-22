import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

async function checkSupportAccess() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const role = session.user.role;

  if (role !== "SUPPORT" && role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await checkSupportAccess();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to access knowledge articles.",
        },
        { status: 403 }
      );
    }

    const articles = await prisma.knowledgeArticle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Support knowledge base fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while loading knowledge articles.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await checkSupportAccess();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not have permission to create knowledge articles.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { title, content, category, published } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, content, and category are required.",
        },
        { status: 400 }
      );
    }

    const article = await prisma.knowledgeArticle.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        published: Boolean(published),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Knowledge article created successfully.",
        article,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Knowledge article creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating the article.",
      },
      { status: 500 }
    );
  }
}