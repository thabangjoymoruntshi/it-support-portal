import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function KnowledgeArticlePage({
  params,
}: PageProps) {
  const { id } = await params;

  const articleId = Number(id);

  if (!Number.isInteger(articleId)) {
    notFound();
  }

  const article = await prisma.knowledgeArticle.findFirst({
    where: {
      id: articleId,
      published: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screeen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <a
          href="/knowledge-base"
          className="text-sm font-medium text-green-400 hover:text-green-300"
        >
          ← Back to Knowledge Base
        </a>

        <article className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 md:p-10">
          <p className="text-sm font-medium text-green-400">
            {article.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {article.title}
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Published{" "}
            {new Date(article.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-zinc-300">
            {article.content}
          </div>
        </article>
      </div>
    </main>
  );
}