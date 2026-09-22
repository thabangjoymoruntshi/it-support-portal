"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Ticket = {
  id: number;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch("/api/tickets");
        const result = await response.json();

        if (response.ok) {
          setTickets(result.tickets || []);
        }
      } catch (error) {
        console.error("Support tickets error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <section className="mb-8">
        <p className="text-sm text-green-400">
          Support Management
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Tickets
        </h1>

        <p className="mt-2 text-zinc-500">
          Review, manage, and respond to customer support requests.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Total Tickets
          </p>
          <p className="mt-3 text-3xl font-bold">
            {loading ? "—" : tickets.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            New
          </p>
          <p className="mt-3 text-3xl font-bold">
            {loading
              ? "—"
              : tickets.filter((ticket) => ticket.status === "NEW").length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            In Progress
          </p>
          <p className="mt-3 text-3xl font-bold">
            {loading
              ? "—"
              : tickets.filter(
                  (ticket) => ticket.status === "IN_PROGRESS"
                ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Resolved
          </p>
          <p className="mt-3 text-3xl font-bold">
            {loading
              ? "—"
              : tickets.filter(
                  (ticket) => ticket.status === "RESOLVED"
                ).length}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <p className="text-sm text-green-400">
            Support Queue
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            All Tickets
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {loading ? (
            <div className="p-6 text-sm text-zinc-500">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500">
              No support tickets found.
            </div>
          ) : (
            tickets.map((ticket, index) => (
              <Link
                key={ticket.id}
                href={`/support/tickets/${ticket.id}`}
                className={`block p-5 transition hover:bg-zinc-800/50 ${
                  index !== tickets.length - 1
                    ? "border-b border-zinc-800"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-green-400">
                        #{ticket.ticketNumber}
                      </span>

                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                        {ticket.category}
                      </span>
                    </div>

                    <h3 className="mt-2 font-semibold text-white">
                      {ticket.subject}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {ticket.customer?.name || "Customer"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {ticket.priority}
                    </span>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}