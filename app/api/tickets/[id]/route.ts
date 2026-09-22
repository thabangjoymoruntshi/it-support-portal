import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);

  if (Number.isNaN(userId)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to view this ticket.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const ticketId = Number(id);

    if (Number.isNaN(ticketId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket ID.",
        },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const isSupportOrAdmin =
      user.role === "SUPPORT" || user.role === "ADMIN";

    if (!isSupportOrAdmin && ticket.customerId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized to view this ticket.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Ticket details fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the ticket.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to send a message.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const ticketId = Number(id);

    if (Number.isNaN(ticketId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    const isSupportOrAdmin =
      user.role === "SUPPORT" || user.role === "ADMIN";

    if (!isSupportOrAdmin && ticket.customerId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized to reply to this ticket.",
        },
        { status: 403 }
      );
    }

    if (ticket.status === "CLOSED") {
      return NextResponse.json(
        {
          success: false,
          error: "This ticket is closed and can no longer receive messages.",
        },
        { status: 400 }
      );
    }

    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        message: message.trim(),
        ticketId: ticket.id,
        senderId: user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (user.role === "CUSTOMER") {
      await prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: "IN_PROGRESS",
          resolvedAt: null,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: ticketMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ticket message creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the message.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    console.log("=== TICKET PATCH AUTH DEBUG ===");
    console.log("Authenticated user:", user);
    console.log("User ID:", user?.id);
    console.log("User name:", user?.name);
    console.log("User email:", user?.email);
    console.log("User role:", user?.role);
    console.log("================================");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const isSupportOrAdmin =
      user.role === "SUPPORT" || user.role === "ADMIN";

    if (!isSupportOrAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Only support staff or administrators can update tickets.",
          debug: {
            userId: user.id,
            role: user.role,
          },
        },
        { status: 403 }
      );
    }

    // KEEP THE REST OF YOUR EXISTING PATCH CODE BELOW THIS POINT

    const { id } = await params;
    const ticketId = Number(id);

    if (Number.isNaN(ticketId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, priority, assignedToId } = body;

    const allowedStatuses = [
      "NEW",
      "OPEN",
      "IN_PROGRESS",
      "WAITING_FOR_CUSTOMER",
      "RESOLVED",
      "CLOSED",
    ];

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket status.",
        },
        { status: 400 }
      );
    }

    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ticket priority.",
        },
        { status: 400 }
      );
    }

    if (
      assignedToId !== undefined &&
      assignedToId !== null &&
      (typeof assignedToId !== "number" || Number.isNaN(assignedToId))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assigned staff member.",
        },
        { status: 400 }
      );
    }

    if (
      status === undefined &&
      priority === undefined &&
      assignedToId === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No ticket changes were provided.",
        },
        { status: 400 }
      );
    }

    if (assignedToId !== undefined && assignedToId !== null) {
      const assignedUser = await prisma.user.findUnique({
        where: {
          id: assignedToId,
        },
      });

      if (!assignedUser) {
        return NextResponse.json(
          {
            success: false,
            error: "Support staff member not found.",
          },
          { status: 404 }
        );
      }

      if (
        assignedUser.role !== "SUPPORT" &&
        assignedUser.role !== "ADMIN"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Ticket can only be assigned to support staff or an admin.",
          },
          { status: 400 }
        );
      }
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        ...(status !== undefined && {
          status,
          resolvedAt:
            status === "RESOLVED" || status === "CLOSED"
              ? new Date()
              : null,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(assignedToId !== undefined && {
          assignedToId,
        }),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Ticket update error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating the ticket.",
      },
      { status: 500 }
    );
  }
}