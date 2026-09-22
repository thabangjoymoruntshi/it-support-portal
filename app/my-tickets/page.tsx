"use client";

import { useEffect, useMemo, useState } from "react";

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
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch("/api/tickets");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load tickets.");
        }

        setTickets(result.tickets);
        setError("");
      } catch (error) {
        console.error("My Tickets loading error:", error);

        setError(
          "Unable to load your tickets right now. Please refresh the page and try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

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

  const filteredTickets = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        searchValue === "" ||
        ticket.ticketNumber.toLowerCase().includes(searchValue) ||
        ticket.subject.toLowerCase().includes(searchValue) ||
        ticket.category.toLowerCase().includes(searchValue) ||
        (ticket.device?.toLowerCase().includes(searchValue) ?? false);

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <a
          href="/"
          className="text-sm font-medium text-green-400 hover:text-green-300"
        >
          ← Back to Dashboard
        </a>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-medium text-green-400">
            Avenqora Support
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            My Tickets
          </h1>

          <p className="mt-3 text-zinc-400">
            View and track your support requests.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <p className="text-zinc-400">Loading your tickets...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="font-semibold text-red-400">
              Unable to load tickets
            </h2>

            <p className="mt-1 text-sm text-zinc-400">{error}</p>
          </div>
        )}

        {/* Main Ticket Area */}
        {!loading && !error && (
          <>
            {/* Filters */}
            <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
                {/* Search */}
                <div>
                  <label
                    htmlFor="ticket-search"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500"
                  >
                    Search Tickets
                  </label>

                  <input
                    id="ticket-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by ticket number, subject, category..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status-filter"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="NEW">New</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_FOR_CUSTOMER">
                      Waiting for Customer
                    </option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="priority-filter"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500"
                  >
                    Priority
                  </label>

                  <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(event.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                  >
                    <option value="ALL">All Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Results Header */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Support Activity
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {filteredTickets.length}{" "}
                  {filteredTickets.length === 1 ? "Ticket" : "Tickets"}
                </h2>
              </div>

              {(search ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setPriorityFilter("ALL");
                  }}
                  className="text-sm font-medium text-green-400 hover:text-green-300"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* No Tickets */}
            {tickets.length === 0 && (
              <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
                <p className="text-zinc-400">
                  You have not submitted any support tickets yet.
                </p>

                <a
                  href="/submit-ticket"
                  className="mt-5 inline-block rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-green-400"
                >
                  Submit New Ticket
                </a>
              </div>
            )}

            {/* No Search Results */}
            {tickets.length > 0 && filteredTickets.length === 0 && (
              <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                <h3 className="font-semibold">
                  No tickets found
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setPriorityFilter("ALL");
                  }}
                  className="mt-5 text-sm font-semibold text-green-400 hover:text-green-300"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Tickets */}
            {filteredTickets.length > 0 && (
              <div className="mt-5 space-y-4">
                {filteredTickets.map((ticket) => (
                  <a
                        key={ticket.id}
                        href={`/my-tickets/${ticket.id}`}
                    className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-green-500/40 hover:bg-zinc-900/80"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      {/* Ticket Information */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold text-green-400">
                            {ticket.ticketNumber}
                          </span>

                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                            {ticket.category}
                          </span>

                          {ticket.device && (
                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                              {ticket.device}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-green-400">
                          {ticket.subject}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Status & Priority */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
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

                    {/* Footer */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-zinc-500">
                        Submitted{" "}
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>

                      <span className="text-sm font-semibold text-green-400 group-hover:text-green-300">
                        View Ticket →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}