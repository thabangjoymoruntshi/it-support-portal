
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  message: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    role: string;
  };
};

type SupportUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Ticket = {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  device: string | null;
  createdAt: string;
  assignedToId: number | null;
  assignedTo: SupportUser | null;
  messages: Message[];
};

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);

const [supportUsers, setSupportUsers] = useState<SupportUser[]>([]);
const [selectedAssignee, setSelectedAssignee] = useState("");
const [assigning, setAssigning] = useState(false);
const [assignmentSuccess, setAssignmentSuccess] = useState("");
const [assignmentError, setAssignmentError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  async function loadTicket() {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load ticket.");
      }

      setTicket(result.ticket);
setSelectedAssignee(
  result.ticket.assignedToId
    ? String(result.ticket.assignedToId)
    : ""
);
setError("");
    } catch (error) {
      console.error("Ticket detail loading error:", error);

      setError(
        "Unable to load this ticket right now. Please refresh the page and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSupportUsers() {
  try {
    const response = await fetch("/api/support-users");
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to load support staff."
      );
    }

    setSupportUsers(result.users || []);
  } catch (error) {
    console.error("Support users loading error:", error);
  }
}


  useEffect(() => {
  if (ticketId) {
    loadTicket();
    loadSupportUsers();
  }
}, [ticketId]);

  async function sendReply() {
    if (!reply.trim()) {
      setReplyError("Please enter a message before sending.");
      return;
    }

    try {
      setSending(true);
      setReplyError("");
      setReplySuccess("");

      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: reply,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your reply.");
      }

      setReply("");
      setReplySuccess("Reply sent successfully.");

      await loadTicket();
    } catch (error) {
      console.error("Customer reply error:", error);

      setReplyError(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your reply."
      );
    } finally {
      setSending(false);
    }
  }

  async function assignTicket() {
  try {
    setAssigning(true);
    setAssignmentError("");
    setAssignmentSuccess("");

    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignedToId: selectedAssignee
          ? Number(selectedAssignee)
          : null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to assign ticket."
      );
    }

    setAssignmentSuccess("Ticket assigned successfully.");

    await loadTicket();
  } catch (error) {
    console.error("Ticket assignment error:", error);

    setAssignmentError(
      error instanceof Error
        ? error.message
        : "Something went wrong while assigning the ticket."
    );
  } finally {
    setAssigning(false);
  }
}

  function formatStatus(status: string) {
    switch (status) {
      case "NEW":
        return "New";
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "WAITING_FOR_CUSTOMER":
        return "Waiting for Customer";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  }

  function formatPriority(priority: string) {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "bg-green-500/10 text-green-400";

      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-400";

      case "WAITING_FOR_CUSTOMER":
        return "bg-purple-500/10 text-purple-400";

      case "OPEN":
        return "bg-blue-500/10 text-blue-400";

      case "NEW":
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  }

  function getPriorityClasses(priority: string) {
    switch (priority) {
      case "URGENT":
        return "bg-red-500/10 text-red-400";

      case "HIGH":
        return "bg-orange-500/10 text-orange-400";

      case "MEDIUM":
        return "bg-amber-500/10 text-amber-400";

      case "LOW":
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/my-tickets"
          className="text-sm font-medium text-green-400 hover:text-green-300"
        >
          ← Back to My Tickets
        </a>

        {loading && (
          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">Loading ticket...</p>
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="font-semibold text-red-400">
              Unable to load ticket
            </h2>
            <p className="mt-1 text-sm text-zinc-400">{error}</p>
          </div>
        )}

        {!loading && !error && ticket && (
          <>
            <div className="mt-8">
              <p className="text-sm font-medium text-green-400">
                {ticket.ticketNumber}
              </p>

              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {ticket.subject}
                  </h1>

                  <p className="mt-3 text-zinc-400">
                    Submitted {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClasses(
                      ticket.priority
                    )}`}
                  >
                    {formatPriority(ticket.priority)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      ticket.status
                    )}`}
                  >
                    {formatStatus(ticket.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                  <p className="text-sm font-medium text-green-400">
                    Issue Description
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    What you reported
                  </h2>

                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                    {ticket.description}
                  </p>
                </section>

                <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                  <p className="text-sm font-medium text-green-400">
                    Conversation
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Support Activity
                  </h2>

                  {ticket.messages.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        No support messages yet. Our support team will respond
                        here when they review your ticket.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {ticket.messages.map((message) => (
                        <div
                          key={message.id}
                          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-white">
                                {message.sender.name}
                              </p>

                              <p className="text-xs text-zinc-500">
                                {message.sender.role === "SUPPORT"
                                  ? "Support Team"
                                  : "You"}
                              </p>
                            </div>

                            <p className="text-xs text-zinc-600">
                              {new Date(
                                message.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                            {message.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {ticket.status !== "CLOSED" && (
                    <div className="mt-6 border-t border-zinc-800 pt-6">
                      <p className="text-sm font-medium text-green-400">
                        Reply
                      </p>

                      <h3 className="mt-2 text-lg font-bold">
                        Continue the conversation
                      </h3>

                      <textarea
                        value={reply}
                        onChange={(event) => setReply(event.target.value)}
                        placeholder="Write a message to the support team..."
                        rows={5}
                        disabled={sending}
                        className="mt-4 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
                      />

                      {replyError && (
                        <p className="mt-3 text-sm text-red-400">
                          {replyError}
                        </p>
                      )}

                      {replySuccess && (
                        <p className="mt-3 text-sm text-green-400">
                          {replySuccess}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={sendReply}
                        disabled={sending}
                        className="mt-4 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  )}

                  {ticket.status === "CLOSED" && (
                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        This ticket is closed. You can submit a new ticket if
                        you need further assistance.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-sm font-medium text-green-400">
                  Ticket Information
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Details
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                      Ticket Number
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {ticket.ticketNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {ticket.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                      Device
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      {ticket.device || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                      Priority
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getPriorityClasses(
                        ticket.priority
                      )}`}
                    >
                      {formatPriority(ticket.priority)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        ticket.status
                      )}`}
                    >
                      {formatStatus(ticket.status)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-800 pt-5">
  <p className="text-xs uppercase tracking-wide text-zinc-600">
    Assigned To
  </p>

  <select
    value={selectedAssignee}
    onChange={(event) =>
      setSelectedAssignee(event.target.value)
    }
    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-green-500"
  >
    <option value="">Unassigned</option>

    {supportUsers.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.role})
      </option>
    ))}
  </select>

  {assignmentError && (
    <p className="mt-2 text-sm text-red-400">
      {assignmentError}
    </p>
  )}

  {assignmentSuccess && (
    <p className="mt-2 text-sm text-green-400">
      {assignmentSuccess}
    </p>
  )}

  <button
    type="button"
    onClick={assignTicket}
    disabled={assigning}
    className="mt-3 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {assigning ? "Saving..." : "Save Assignment"}
  </button>
</div>

                  <div className="border-t border-zinc-800 pt-5">
                    <a
                      href="/submit-ticket"
                      className="block rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-green-400"
                    >
                      Submit New Ticket
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

