import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Cuaderno editorial",
  description: "Guías y notas para elegir libros desde la curiosidad, el momento y las ganas reales de leer.",
  alternates: { canonical: "/cuaderno" },
};

export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <main className="journal-page">
      <header className="journal-heading">
        <p className="eyebrow">El cuaderno de CoruKai</p>
        <h1>Ideas para elegir sin convertir la lectura en una tarea.</h1>
        <p>Guías honestas, selecciones pequeñas y preguntas que ayudan a encontrar el libro adecuado para hoy.</p>
      </header>
      <section className="journal-grid" aria-label="Artículos editoriales">
        {articles.map((article, index) => (
          <article className="journal-card" key={article.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p className="eyebrow">{article.category}</p>
            <h2><Link href={`/cuaderno/${article.slug}`}>{article.title}</Link></h2>
            <p>{article.excerpt}</p>
            <Link className="text-link" href={`/cuaderno/${article.slug}`}>Leer la nota <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </section>
    </main>
  );
}
