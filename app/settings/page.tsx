
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [ticketNotifications, setTicketNotifications] =
    useState(true);

  const [showPasswordForm, setShowPasswordForm] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  async function changePassword() {
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(
        "Please complete all password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    try {
      setSavingPassword(true);

      const response = await fetch(
        "/api/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(
          data.error || "Failed to change password."
        );
        return;
      }

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      console.error(error);

      setPasswordError(
        "Something went wrong while changing your password."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-400 transition hover:text-green-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-400">
            Account
          </p>

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your account and support preferences.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-zinc-900 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">
            Account Settings
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your account preferences and communication
            settings.
          </p>

          <div className="mt-6 divide-y divide-slate-800">
            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Email Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Receive important account and support updates
                  by email.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEmailNotifications(
                    !emailNotifications
                  )
                }
                aria-pressed={emailNotifications}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  emailNotifications
                    ? "bg-green-500"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    emailNotifications
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Ticket Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Get notified when there are updates to your
                  support tickets.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTicketNotifications(
                    !ticketNotifications
                  )
                }
                aria-pressed={ticketNotifications}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  ticketNotifications
                    ? "bg-green-500"
                    : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    ticketNotifications
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-zinc-900 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">
            Security
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage your password and account security.
          </p>

          {passwordMessage && (
            <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}

          {!showPasswordForm ? (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Password
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Update your password to keep your account
                  secure.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPasswordMessage("");
                  setPasswordError("");
                  setShowPasswordForm(true);
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-green-500 hover:text-green-400"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="mt-6 max-w-xl space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setPasswordMessage("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={changePassword}
                  disabled={savingPassword}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPassword
                    ? "Changing..."
                    : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-zinc-900 p-6 shadow-xl">
          <h2 className="text-lg font-semibold">
            Support
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Need help with your account or a technical issue?
          </p>

          <div className="mt-6">
            <Link
              href="/submit-ticket"
              className="inline-flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-green-400"
            >
              Submit a Support Ticket
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            Sign Out
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Sign out of your Avenqora support account on this
            device.
          </p>

          <button
            type="button"
            onClick={() =>
              signOut({ callbackUrl: "/login" })
            }
            className="mt-5 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
}

