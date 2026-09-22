
"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function Dashboard() { 
  const { data: session, status } = useSession();

  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const customerName = session?.user?.name || "Customer";
  const customerInitials =
    customerName
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

      

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
      console.error("Dashboard ticket loading error:", error);

      setError(
        "Unable to load your tickets right now. Please refresh the page and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  loadTickets();
}, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "RESOLVED" || ticket.status === "CLOSED"
  ).length;

  const stats = [
    { label: "Total Tickets", value: totalTickets },
    { label: "Open Tickets", value: openTickets },
    { label: "In Progress", value: inProgressTickets },
    { label: "Resolved", value: resolvedTickets },
  ];

  const recentTickets = tickets.slice(0, 3);

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const difference = now.getTime() - date.getTime();
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    return `${days} days ago`;
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-900 p-6 md:flex md:flex-col">
          <div>
            <div className="mb-10">
              <h1 className="text-xl font-bold tracking-tight">
                Avenqora
              </h1>
              <p className="text-sm text-zinc-500">
                IT Support Portal
              </p>
            </div>

            <nav className="space-y-2">
              <a
                href="/"
                className="block rounded-xl bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400"
              >
                Dashboard
              </a>

              <a
                href="/submit-ticket"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Submit Ticket
              </a>

              <a
                href="/my-tickets"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                My Tickets
              </a>

              <a
                href="/knowledge-base"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Knowledge Base
              </a>

              <a
                href="/profile"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Profile
              </a>

              <a
                href="/settings"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Settings
              </a>
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm font-semibold">Need help?</p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Contact the Avenqora support team if you need assistance.
            </p>

            <a
             href="/submit-ticket"
             className="mt-4 block w-full rounded-xl border bg-green-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-green-400">
              Contact Support
            </a>

            <button
  type="button"
  onClick={async () => {
    await signOut({ redirect: false });
    window.location.assign("/login");
  }}
  className="mt-3 w-full rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
>
  Sign Out
</button>
          </div>
        </aside>

                {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Navigation */}
          <nav className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 md:hidden">
           <div className="grid grid-cols-2 gap-2">
              <a
                href="/"
                className="rounded-xl bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400"
              >
                Dashboard
              </a>

              <a
                href="/submit-ticket"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Submit Ticket
              </a>

              <a
                href="/my-tickets"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                My Tickets
              </a>

              <a
                href="/knowledge-base"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Knowledge Base
              </a>

              <a
                href="/profile"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Profile
              </a>

              <a
                href="/settings"
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Settings
              </a>
            </div>
          </nav>

        
          {/* Top Bar */}
          <header className="border-b border-zinc-800 bg-zinc-950/90 px-6 py-5 md:px-10">
           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Thursday, September 3, 2026
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Welcome back, {customerName}
                </h2>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white">
                  Notifications
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-zinc-950">
                  {customerInitials}
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10">
            {/* Hero */}
            <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
              <div className="p-6 sm:p-8 md:p-10">
                <p className="text-sm font-medium text-green-400">
                  Avenqora Support
                </p>

                <h3 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Need technical assistance?
                </h3>

                <p className="mt-4 max-w-2xl text-zinc-400">
                  Submit a support ticket and our team will help you
                  resolve your technical issue as quickly as possible.
                </p>

                <a
                  href="/submit-ticket"
                  className="mt-7 inline-block rounded-xl bg-green-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-green-400"
                >
                  Submit New Ticket
                </a>
              </div>
            </section>

            {/* Statistics */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Recent Tickets */}
            <section className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-green-400">
                    Support Activity
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Recent Tickets
                  </h3>
                </div>

                <a
                  href="/my-tickets"
                  className="text-sm font-medium text-green-400 hover:text-green-300"
                >
                  View All
                </a>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                {loading ? (
                  <div className="p-6 text-sm text-zinc-500">
                    Loading tickets...
                  </div>
                ) : recentTickets.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500">
                    You have not submitted any tickets yet.
                  </div>
                ) : (
                  recentTickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className={`p-5 md:p-6 ${
                        index !== recentTickets.length - 1
                          ? "border-b border-zinc-800"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-green-400">
                              #{ticket.ticketNumber}
                            </span>

                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                              {ticket.category}
                            </span>
                          </div>

                          <h4 className="mt-2 font-semibold">
                            {ticket.subject}
                          </h4>

                          <p className="mt-1 text-sm text-zinc-500">
                            {formatTime(ticket.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                            {formatPriority(ticket.priority)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              ticket.status === "RESOLVED" ||
                              ticket.status === "CLOSED"
                                ? "bg-green-500/10 text-green-400"
                                : ticket.status === "IN_PROGRESS"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {formatStatus(ticket.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Bottom Cards */}
            <section className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
                <p className="text-sm text-green-400">
                  Knowledge Base
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Find answers quickly
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Browse troubleshooting guides and helpful articles
                  before submitting a ticket.
                </p>

                <Link
                  href="/knowledge-base"
                  className="mt-5 text-sm font-semibold text-green-400 hover:text-green-300">
                  Browse Knowledge Base →
                </Link>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
                <p className="text-sm text-green-400">
                  Support Team
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  We're here to help
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Our support team is available to assist with your
                  technical issues and service requests.
                </p>

                <Link
                  href="/submit-ticket"
                  
                  className="mt-5 text-sm font-semibold text-green-400 hover:text-green-300"
                   >
                  Contact Support →
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}