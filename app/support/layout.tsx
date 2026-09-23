"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (
      session.user?.role !== "SUPPORT" &&
      session.user?.role !== "ADMIN"
    ) {
      router.replace("/login");
    }
  }, [session, status, router]);

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-400">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (
    session.user?.role !== "SUPPORT" &&
    session.user?.role !== "ADMIN"
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full border-b border-zinc-800 bg-zinc-950 md:w-64 md:border-b-0 md:border-r">
          <div className="p-6">
            <p className="text-sm font-medium text-green-400">
              Avenqora
            </p>

            <h1 className="mt-1 text-lg font-bold">
              IT Support
            </h1>
          </div>

          <nav className="px-4 pb-6">
            <div className="space-y-1">
              <Link
                href="/support"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/support/tickets"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Tickets
              </Link>

              <Link
                href="/support/knowledge-base"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Knowledge Base
              </Link>

              <Link
                href="/support-users"
                className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Support Users
              </Link>
            </div>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-5 md:px-10">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm text-zinc-500">
                  Avenqora IT Support
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Support Management
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-zinc-950">
                  ST
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}