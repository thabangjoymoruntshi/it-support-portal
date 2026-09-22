"use client";

import { FormEvent, useState } from "react";

export default function SubmitTicketPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(false);
    setError("");

    const formData = new FormData(event.currentTarget);

    const data = {
      subject: formData.get("subject"),
      category: formData.get("category"),
      priority: formData.get("priority"),
      device: formData.get("device"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      
      
      setSubmitted(true);
      
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the ticket."
      );
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <a
            href="/"
            className="text-sm font-medium text-green-400 hover:text-green-300"
          >
            ← Back to Dashboard
          </a>

          <p className="mt-8 text-sm font-medium text-green-400">
            Avenqora Support
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Submit a Support Ticket
          </h1>

          <p className="mt-3 text-zinc-400">
            Tell us about the technical issue you are experiencing and our
            support team will assist you.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
            <h2 className="font-semibold text-green-400">
              Ticket submitted successfully
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Your support request has been received.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <h2 className="font-semibold text-red-400">
              Unable to submit ticket
            </h2>

            <p className="mt-1 text-sm text-zinc-400">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8"
        >
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="e.g. Laptop cannot connect to Wi-Fi"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Security">Security</option>
              <option value="Account">Account</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium"
            >
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              defaultValue="MEDIUM"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="device" className="mb-2 block text-sm font-medium">
              Device
            </label>

            <input
              id="device"
              name="device"
              type="text"
              placeholder="e.g. Dell Latitude 5420"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Describe the issue
            </label>

            <textarea
              id="description"
              name="description"
              rows={7}
              placeholder="Please explain what is happening, when the problem started, and anything you have already tried..."
              required
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-green-400"
            >
              Submit Ticket
            </button>

            <a
              href="/"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}