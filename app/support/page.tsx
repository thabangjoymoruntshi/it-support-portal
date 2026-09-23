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

export default function SupportDashboard() {
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
        console.error("Support dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
    },
    {
      label: "New",
      value: tickets.filter((ticket) => ticket.status === "NEW").length,
    },
    {
      label: "Open",
      value: tickets.filter((ticket) => ticket.status === "OPEN").length,
    },
    {
      label: "In Progress",
      value: tickets.filter(
        (ticket) => ticket.status === "IN_PROGRESS"
      ).length,
    },
    {
      label: "Waiting for Customer",
      value: tickets.filter(
        (ticket) => ticket.status === "WAITING_FOR_CUSTOMER"
      ).length,
    },
    {
      label: "Resolved",
      value: tickets.filter(
        (ticket) => ticket.status === "RESOLVED"
      ).length,
    },
    {
      label: "Closed",
      value: tickets.filter((ticket) => ticket.status === "CLOSED").length,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      <section className="mb-8">
        <p className="text-sm text-green-400">Support Overview</p>

        <h1 className="mt-2 text-3xl font-bold">
          Ticket Management
        </h1>

        <p className="mt-2 text-zinc-500">
          Monitor incoming support requests and manage customer issues.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <p className="text-sm text-zinc-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {loading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm text-green-400">
            Support Queue
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Recent Tickets
          </h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {loading ? (
            <div className="p-6 text-sm text-zinc-500">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500">
              No support tickets found.
            </div>
          ) : (
            tickets.slice(0, 10).map((ticket, index) => (
              <Link
                href={`/support/tickets/${ticket.id}`}
                key={ticket.id}
                className={`block p-5 transition hover:bg-zinc-800/50 ${
                  index !== Math.min(tickets.length, 10) - 1
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

                    <h3 className="mt-2 font-semibold">
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