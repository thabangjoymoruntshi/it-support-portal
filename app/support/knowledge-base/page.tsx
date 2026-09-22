"use client";

import { FormEvent, useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function SupportKnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  async function loadArticles() {
    try {
      setLoading(true);

      const response = await fetch("/api/support/knowledge-base");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load articles.");
      }

      setArticles(data.articles);
      setError("");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load knowledge articles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleCreateArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");

      const response = await fetch("/api/support/knowledge-base", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          content,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create article.");
      }

      setTitle("");
      setCategory("");
      setContent("");
      setPublished(false);

      await loadArticles();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create the article."
      );
    } finally {
      setCreating(false);
    }
  }

  const publishedCount = articles.filter(
    (article) => article.published
  ).length;

  const draftCount = articles.filter(
    (article) => !article.published
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-medium text-emerald-400">
            Support Management
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Knowledge Base
          </h1>

          <p className="mt-2 text-slate-400">
            Create and manage troubleshooting articles for customers.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Articles</p>
            <p className="mt-2 text-3xl font-bold">{articles.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Published</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {draftCount}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Create Article
            </h2>

            <form
              onSubmit={handleCreateArticle}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="text-sm text-slate-300">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="How to reset your password"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  placeholder="Account & Access"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
                  Content
                </label>

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Explain the solution..."
                  required
                  rows={8}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                  className="h-4 w-4"
                />

                Publish immediately
              </label>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Article"}
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              Articles
            </h2>

            {loading ? (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                Loading articles...
              </div>
            ) : articles.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No knowledge articles have been created yet.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-emerald-400">
                          {article.category}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold">
                          {article.title}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          article.published
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {article.published
                          ? "PUBLISHED"
                          : "DRAFT"}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {article.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}