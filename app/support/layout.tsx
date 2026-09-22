import Link from "next/link";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  Avenqora IT Support
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Support Management
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-zinc-950">
                ST
              </div>
              
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}