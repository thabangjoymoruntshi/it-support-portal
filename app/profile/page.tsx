"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
const [editing, setEditing] = useState(false);

const [nameInput, setNameInput] = useState("");
const [saving, setSaving] = useState(false);
const [saveMessage, setSaveMessage] = useState("");
const [saveError, setSaveError] = useState("");

const { data: session, status, update } = useSession();

const name = session?.user?.name || "Client";
const email = session?.user?.email || "Not available";
const role = session?.user?.role || "CUSTOMER";

const initials = name
.split(" ")
.map((part) => part.charAt(0))
.join("")
.slice(0, 2)
.toUpperCase();

if (status === "loading") {
return ( <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white"> <div className="mx-auto max-w-5xl"> <p className="text-sm text-zinc-400">Loading profile...</p> </div> </main>
);
}

return ( <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white"> <div className="mx-auto max-w-5xl">
{/* Back */} <Link
       href="/"
       className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
     >
← Back to Dashboard </Link>

```
    {/* Header */}
    <div className="mb-8">
      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-400">
        Account
      </p>

      <h1 className="text-3xl font-bold">Profile</h1>

      <p className="mt-2 text-zinc-400">
        Manage your personal information and account details.
      </p>
    </div>

    {/* Profile Card */}
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-2xl font-bold text-green-400 ring-1 ring-green-500/20">
          {initials}
        </div>

        {/* User information */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{name}</h2>

          <p className="mt-1 text-zinc-400">{email}</p>

          <span className="mt-3 inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            {role === "CUSTOMER" ? "Client" : role}
          </span>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => {
            setNameInput(session?.user?.name || "");
            setSaveMessage("");
            setSaveError("");
            setEditing(true);
          }}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-green-500 hover:text-green-400"
        >
          Edit Profile
        </button>
      </div>
    </section>

    {/* Edit Profile */}
    {editing && (
      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Update your profile information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 max-w-xl">
          <label className="block text-sm font-medium text-zinc-300">
            Full Name
          </label>

          <input
            type="text"
            defaultValue={session?.user?.name || ""}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
          />

          <label className="mt-5 block text-sm font-medium text-zinc-300">
            Email Address
          </label>

          <input
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
          />

          {saveError && (
            <p className="mt-4 text-sm text-red-400">
              {saveError}
            </p>
          )}

          {saveMessage && (
            <p className="mt-4 text-sm text-green-400">
              {saveMessage}
            </p>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              if (!nameInput.trim()) {
                setSaveError("Name is required.");
                setSaveMessage("");
                return;
              }

              try {
                setSaving(true);
                setSaveError("");
                setSaveMessage("");

                const response = await fetch("/api/profile", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: nameInput.trim(),
                    email: session?.user?.email || "",
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  setSaveError(
                    data.error || "Failed to update profile."
                  );
                  return;
                }

                await update({
                  name: data.user.name,
                  email: data.user.email,
                });

                setSaveMessage(
                  "Profile updated successfully."
                );
                setEditing(false);
              } catch (error) {
                console.error(
                  "PROFILE UPDATE ERROR:",
                  error
                );
                setSaveError(
                  "Failed to update profile."
                );
              } finally {
                setSaving(false);
              }
            }}
            className="mt-6 rounded-lg bg-green-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
    )}

    {/* Account Information */}
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <h2 className="text-lg font-semibold">Account Information</h2>

      <p className="mt-1 text-sm text-zinc-400">
        Information associated with your Avenqora support account.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Full Name
          </p>

          <p className="mt-2 text-sm text-white">{name}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Email Address
          </p>

          <p className="mt-2 break-all text-sm text-white">
            {email}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Account Type
          </p>

          <p className="mt-2 text-sm text-white">
            {role === "CUSTOMER" ? "Client Account" : role}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Account Status
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Active
          </p>
        </div>
      </div>
    </section>

    {/* Security */}
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Security</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Keep your account secure by regularly updating your password.
          </p>
        </div>

        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-green-400"
        >
          Account Settings
        </Link>
      </div>
    </section>
  </div>
</main>

);
}
