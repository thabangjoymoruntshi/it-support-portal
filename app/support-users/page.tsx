"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
type SupportUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function SupportUsersPage() {
  const [users, setUsers] = useState<SupportUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<SupportUser | null>(null)
  const [editingUser, setEditingUser] = useState<SupportUser | null>(null);
const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState("");

  useEffect(() => {
    async function loadSupportUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/support-users");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Failed to load support users."
          );
        }

        setUsers(result.users || []);
      } catch (error) {
        console.error("Support users error:", error);
        setError("Unable to load support users.");
      } finally {
        setLoading(false);
      }
    }

    loadSupportUsers();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 md:px-10">
      <section className="mb-8">

          <Link
                    href="/support"
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    ← Back to Support Dashboard
                  </Link>

        <p className="text-sm text-green-400">
          Support Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Support Users
        </h1>

        <p className="mt-2 text-zinc-500">
          Manage the support staff who handle customer tickets.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Total Support Users
          </p>

          <p className="mt-3 text-3xl font-bold">
            {loading ? "—" : users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Support Agents
          </p>

          <p className="mt-3 text-3xl font-bold">
            {loading
              ? "—"
              : users.filter((user) => user.role === "SUPPORT").length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">
            Administrators
          </p>

          <p className="mt-3 text-3xl font-bold">
            {loading
              ? "—"
              : users.filter((user) => user.role === "ADMIN").length}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm text-green-400">
            Team Directory
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Support Staff
          </h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {loading ? (
            <div className="p-6 text-sm text-zinc-500">
              Loading support users...
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-400">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500">
              No support users found.
            </div>
          ) : (
            users.map((user, index) => (
              <button
  type="button"
  key={user.id}
  onClick={() => setSelectedUser(user)}
  className={`block w-full p-5 text-left transition hover:bg-zinc-800/50 ${
    index !== users.length - 1
      ? "border-b border-zinc-800"
      : ""
  }`}
>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                    {user.role}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </section>
{selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-green-400">
            Support User
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            User Details
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setSelectedUser(null)}
          className="rounded-lg px-3 py-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Name
          </p>
          <p className="mt-1 font-medium text-white">
            {selectedUser.name}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Email
          </p>
          <p className="mt-1 text-zinc-300">
            {selectedUser.email}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Role
          </p>
          <span className="mt-2 inline-block rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            {selectedUser.role}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            User ID
          </p>
          <p className="mt-1 text-zinc-300">
            {selectedUser.id}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
  <button
    type="button"
    onClick={() => {
      setEditingUser(selectedUser);
      setSaveError("");
    }}
    className="flex-1 rounded-xl bg-green-500 px-4 py-3 font-medium text-zinc-950 transition hover:bg-green-400"
  >
    Edit User
  </button>

  <button
    type="button"
    onClick={() => setSelectedUser(null)}
    className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
  >
    Close
  </button>
</div>
    </div>
  </div>
)}

{editingUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-green-400">
            Support Administration
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Edit User
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="rounded-lg px-3 py-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-sm text-zinc-400">
            Name
          </label>

          <input
            type="text"
            value={editingUser.name}
            onChange={(event) =>
              setEditingUser({
                ...editingUser,
                name: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Email
          </label>

          <input
            type="email"
            value={editingUser.email}
            onChange={(event) =>
              setEditingUser({
                ...editingUser,
                email: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Role
          </label>

          <select
            value={editingUser.role}
            onChange={(event) =>
              setEditingUser({
                ...editingUser,
                role: event.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-green-500"
          >
            <option value="SUPPORT">SUPPORT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {saveError && (
          <p className="text-sm text-red-400">
            {saveError}
          </p>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setEditingUser(null)}
          className="flex-1 rounded-xl border border-zinc-700 px-4 py-3 font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            try {
              setSaving(true);
              setSaveError("");

              const response = await fetch("/api/support-users", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editingUser),
              });

              const result = await response.json();

              if (!response.ok || !result.success) {
                throw new Error(
                  result.error || "Failed to update user."
                );
              }

              setUsers((currentUsers) =>
                currentUsers.map((user) =>
                  user.id === result.user.id
                    ? result.user
                    : user
                )
              );

              setSelectedUser(result.user);
              setEditingUser(null);
            } catch (error) {
              console.error("Update support user error:", error);

              setSaveError(
                error instanceof Error
                  ? error.message
                  : "Unable to update support user."
              );
            } finally {
              setSaving(false);
            }
          }}
          className="flex-1 rounded-xl bg-green-500 px-4 py-3 font-medium text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}