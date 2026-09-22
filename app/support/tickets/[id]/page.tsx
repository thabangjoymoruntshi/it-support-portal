"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type TicketMessage = {
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
  updatedAt: string;

  customer?: {
    id: number;
    name: string;
    email: string;
  };

  assignedTo?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;

  messages?: TicketMessage[];
};

export default function SupportTicketPage() {
  const params = useParams();
  const id = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [selectedPriority, setSelectedPriority] = useState("");
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const [priorityMessage, setPriorityMessage] = useState("");

  const [supportUsers, setSupportUsers] = useState<SupportUser[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [updatingAssignee, setUpdatingAssignee] = useState(false);
  const [assigneeMessage, setAssigneeMessage] = useState("");

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        const result = await response.json();

        if (response.ok) {
          setTicket(result.ticket);
          setSelectedStatus(result.ticket.status);
          setSelectedPriority(result.ticket.priority);

          setSelectedAssignee(
            result.ticket.assignedTo?.id
              ? String(result.ticket.assignedTo.id)
              : ""
          );
        }
      } catch (error) {
        console.error("Ticket fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadSupportUsers() {
      try {
        const response = await fetch("/api/support-users");
        const result = await response.json();

        if (response.ok) {
          setSupportUsers(result.users || []);
        }
      } catch (error) {
        console.error("Support users fetch error:", error);
      }
    }

    if (id) {
      loadTicket();
      loadSupportUsers();
    }
  }, [id]);

  async function updateStatus() {
    if (!ticket) return;

    setUpdatingStatus(true);
    setStatusMessage("");

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatusMessage(
          result.error || "Failed to update status."
        );
        return;
      }

      setTicket((current) =>
        current
          ? {
              ...current,
              ...result.ticket,
            }
          : current
      );

      setSelectedStatus(result.ticket.status);
      setStatusMessage("Status updated successfully.");
    } catch (error) {
      console.error("Status update error:", error);
      setStatusMessage(
        "Something went wrong while updating the status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function updatePriority() {
    if (!ticket) return;

    setUpdatingPriority(true);
    setPriorityMessage("");

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: selectedPriority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setPriorityMessage(
          result.error || "Failed to update priority."
        );
        return;
      }

      setTicket((current) =>
        current
          ? {
              ...current,
              ...result.ticket,
            }
          : current
      );

      setSelectedPriority(result.ticket.priority);
      setPriorityMessage("Priority updated successfully.");
    } catch (error) {
      console.error("Priority update error:", error);
      setPriorityMessage(
        "Something went wrong while updating the priority."
      );
    } finally {
      setUpdatingPriority(false);
    }
  }

  async function updateAssignee() {
    if (!ticket) return;

    setUpdatingAssignee(true);
    setAssigneeMessage("");

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
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
        setAssigneeMessage(
          result.error || "Failed to assign ticket."
        );
        return;
      }

      setTicket((current) =>
        current
          ? {
              ...current,
              ...result.ticket,
            }
          : current
      );

      setSelectedAssignee(
        result.ticket.assignedTo?.id
          ? String(result.ticket.assignedTo.id)
          : ""
      );

      setAssigneeMessage("Ticket assignment updated successfully.");
    } catch (error) {
      console.error("Assignment update error:", error);
      setAssigneeMessage(
        "Something went wrong while assigning the ticket."
      );
    } finally {
      setUpdatingAssignee(false);
    }
  }

  async function sendMessage() {
    if (!ticket || !message.trim()) return;

    setSendingMessage(true);
    setMessageStatus("");

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessageStatus(
          result.error || "Failed to send message."
        );
        return;
      }

      const refreshedResponse = await fetch(
        `/api/tickets/${ticket.id}`
      );

      const refreshedResult = await refreshedResponse.json();

      if (refreshedResponse.ok) {
        setTicket(refreshedResult.ticket);

        setSelectedStatus(refreshedResult.ticket.status);
        setSelectedPriority(refreshedResult.ticket.priority);

        setSelectedAssignee(
          refreshedResult.ticket.assignedTo?.id
            ? String(refreshedResult.ticket.assignedTo.id)
            : ""
        );
      }

      setMessage("");
      setMessageStatus("Message sent successfully.");
    } catch (error) {
      console.error("Send message error:", error);
      setMessageStatus(
        "Something went wrong while sending the message."
      );
    } finally {
      setSendingMessage(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-zinc-500">
            Loading ticket...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Link
            href="/support"
            className="text-sm text-green-400 hover:text-green-300"
          >
            ← Back to Support Dashboard
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Ticket not found
          </h1>

          <p className="mt-2 text-zinc-500">
            The requested support ticket could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-5 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/support"
            className="text-sm text-green-400 hover:text-green-300"
          >
            ← Back to Support Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-green-400">
                #{ticket.ticketNumber}
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {ticket.subject}
              </h1>
            </div>

            <span className="w-fit rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
              {ticket.status}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-green-400">
                Issue Description
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Customer Request
              </h2>

              <p className="mt-5 whitespace-pre-wrap leading-7 text-zinc-300">
                {ticket.description}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Conversation
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Communicate with the customer about this ticket.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {ticket.messages &&
                ticket.messages.length > 0 ? (
                  ticket.messages.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.sender.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {item.sender.role}
                          </p>
                        </div>

                        <p className="text-xs text-zinc-500">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                        {item.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    No messages yet. Start the conversation below.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-zinc-800 pt-6">
                <label className="text-sm font-medium text-white">
                  Send Message
                </label>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Type your message..."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-green-500"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    sendingMessage || !message.trim()
                  }
                  className="mt-3 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sendingMessage
                    ? "Sending..."
                    : "Send Message"}
                </button>

                {messageStatus && (
                  <p className="mt-3 text-sm text-zinc-400">
                    {messageStatus}
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-green-400">
                Ticket Information
              </p>

              <div className="mt-5 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Customer
                  </p>

                  <p className="mt-1 font-medium">
                    {ticket.customer?.name || "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {ticket.customer?.email ||
                      "No email available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Category
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {ticket.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Device
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {ticket.device || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Assigned Support Staff
                  </p>

                  <div className="mt-2">
                    <select
                      value={selectedAssignee}
                      onChange={(event) =>
                        setSelectedAssignee(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    >
                      <option value="">
                        Unassigned
                      </option>

                      {supportUsers.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.name} — {user.role}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={updateAssignee}
                      disabled={
                        updatingAssignee ||
                        selectedAssignee ===
                          (ticket.assignedTo?.id
                            ? String(ticket.assignedTo.id)
                            : "")
                      }
                      className="mt-3 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingAssignee
                        ? "Updating..."
                        : "Update Assignment"}
                    </button>

                    {assigneeMessage && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {assigneeMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Priority
                  </p>

                  <div className="mt-2">
                    <select
                      value={selectedPriority}
                      onChange={(event) =>
                        setSelectedPriority(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">
                        Medium
                      </option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">
                        Urgent
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={updatePriority}
                      disabled={
                        updatingPriority ||
                        selectedPriority ===
                          ticket.priority
                      }
                      className="mt-3 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingPriority
                        ? "Updating..."
                        : "Update Priority"}
                    </button>

                    {priorityMessage && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {priorityMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Update Status
                  </p>

                  <div className="mt-2">
                    <select
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                    >
                      <option value="NEW">New</option>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">
                        In Progress
                      </option>
                      <option value="WAITING_FOR_CUSTOMER">
                        Waiting for Customer
                      </option>
                      <option value="RESOLVED">
                        Resolved
                      </option>
                      <option value="CLOSED">
                        Closed
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={updateStatus}
                      disabled={
                        updatingStatus ||
                        selectedStatus === ticket.status
                      }
                      className="mt-3 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingStatus
                        ? "Updating..."
                        : "Update Status"}
                    </button>

                    {statusMessage && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {statusMessage}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Created
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {new Date(
                      ticket.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}