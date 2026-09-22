import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to view tickets.",
        },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);
    const userRole = session.user.role;

    const isSupportOrAdmin =
      userRole === "SUPPORT" || userRole === "ADMIN";

    const tickets = await prisma.ticket.findMany({
      where: isSupportOrAdmin
        ? undefined
        : {
            customerId: userId,
          },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Ticket fetch error FULL:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching tickets.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to submit a ticket.",
        },
        { status: 401 }
      );
    }

    const customerId = Number(session.user.id);

    const body = await request.json();

    const {
      subject,
      category,
      priority,
      device,
      description,
    } = body;

    if (!subject || !category || !priority || !description) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Subject, category, priority, and description are required.",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Your user account could not be found.",
        },
        { status: 404 }
      );
    }

    const ticketNumber = `AVQ-${Date.now()}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        subject,
        description,
        category,
        priority,
        device: device || null,
        customerId: customer.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ticket created successfully.",
        ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ticket creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}