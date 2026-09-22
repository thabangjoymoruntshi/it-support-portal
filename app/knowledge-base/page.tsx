"use client";

import { useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/knowledge-base");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load knowledge base."
          );
        }

        setArticles(data.articles);
      } catch (error) {
        console.error("Knowledge base error:", error);
        setError("Unable to load the knowledge base.");
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
 <a
          href="/#Dashboard"
          className="text-sm font-medium text-green-400 hover:text-green-300"
        >
          ← Back to Dashboard
        </a>

        <div>

          <h1 className="text-3xl font-bold">Knowledge Base</h1>

          <p className="mt-2 text-slate-400">
            Find helpful guides and solutions to common technical issues.
          </p>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              Loading knowledge base...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <h2 className="text-xl font-semibold">
                No articles available yet
              </h2>

              <p className="mt-2 text-slate-400">
                Our support team is preparing helpful troubleshooting
                guides. Check back soon.
              </p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {articles.map((article) => (
      <a
        key={article.id}
        href={`/knowledge-base/${article.id}`}
        className="block rounded-2xl border border-slate-800 bg-zinc-900 p-6 transition hover:border-emerald-500/40 hover:bg-slate-800"
      >
        <span className="text-sm font-medium text-emerald-400">
          {article.category}
        </span>

        <h2 className="mt-3 text-xl font-semibold text-white">
          {article.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {article.content}
        </p>

        <span className="mt-5 inline-block text-sm font-semibold text-emerald-400">
          Read Article →
        </span>
      </a>
    ))}
  </div>
)}
        </div>
      </div>
    </main>
  );
}