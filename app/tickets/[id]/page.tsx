"use client";

import { useEffect, useState } from "react";
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
  messages: TicketMessage[];
};

export default function TicketDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSendMessage() {
  if (!message.trim()) {
    return;
  }

  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong.");
    }

    setMessage("");

    const updatedResponse = await fetch(`/api/tickets/${id}`);
    const updatedResult = await updatedResponse.json();

    if (updatedResponse.ok) {
      setTicket(updatedResult.ticket);
    }
  } catch (error) {
    console.error("Message sending error:", error);
  }
}
  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load ticket.");
        }

        setTicket(result.ticket);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the ticket."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTicket();
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
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

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {ticket.subject}
              </h1>

              <p className="mt-3 text-zinc-400">
                Submitted {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Status
                  </p>

                  <p className="mt-2 text-sm font-medium text-green-400">
                    {ticket.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Priority
                  </p>

                  <p className="mt-2 text-sm font-medium text-white">
                    {ticket.priority}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Category
                  </p>

                  <p className="mt-2 text-sm text-white">
                    {ticket.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Device
                  </p>

                  <p className="mt-2 text-sm text-white">
                    {ticket.device || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-800 pt-8">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Description
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {ticket.description}
                </p>
              </div>

              <div className="mt-8 border-t border-zinc-800 pt-8">
  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
    Conversation
  </p>

  <div className="mt-5 space-y-4">
    {ticket.messages && ticket.messages.length > 0 ? (
      ticket.messages.map((message) => (
        <div
          key={message.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white">
              {message.sender.name}
            </p>

            <p className="text-xs text-zinc-500">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {message.message}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-zinc-500">
        No messages yet.
      </p>
    )}
  </div>
</div>

<div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
    Reply
  </p>

  <textarea
  value={message}
  onChange={(event) => setMessage(event.target.value)}
  placeholder="Write a message..."
  rows={5}
  className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500"
/>

  <button
    type="button"
    onClick={handleSendMessage}
    className="mt-4 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400"
  >
    Send Message
  </button>
</div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}