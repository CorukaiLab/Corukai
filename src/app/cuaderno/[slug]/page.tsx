import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { absoluteUrl } from "@/lib/site";
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  return (await getArticleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/cuaderno/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt, url: `/cuaderno/${article.slug}`, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticleBySlug((await params).slug);
  if (!article) notFound();
  const relatedArticles = await getRelatedArticles(article.slug, article.category);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(`/cuaderno/${article.slug}`),
    author: { "@type": "Organization", name: "CoruKai" },
    publisher: { "@type": "Organization", name: "CoruKai", url: absoluteUrl("/") },
  };

  return (
    <main className="article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="article-heading">
        <Link className="back-link" href="/cuaderno">← Volver al cuaderno</Link>
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
      </header>
      <article className="article-body">
        {article.body.map((block) => {
          const text = block.children?.map((child) => child.text).join("") || "";
          return block.style === "h2" ? <h2 key={block._key}>{text}</h2> : <p key={block._key}>{text}</p>;
        })}
      </article>
      {article.relatedBooks.length > 0 && (
        <section className="article-books">
          <header><p className="eyebrow">Libros sobre la mesa</p><h2>Continúa por aquí.</h2></header>
          <div className="catalog-grid catalog-grid--related">
            {article.relatedBooks.map((product) => <ProductCard product={product} compact key={product.slug} />)}
          </div>
        </section>
      )}
      {relatedArticles.length > 0 && (
        <section className="article-more" aria-labelledby="article-more-title">
          <header>
            <p className="eyebrow">Otra página del cuaderno</p>
            <h2 id="article-more-title">Sigue leyendo desde otro lugar.</h2>
          </header>
          <div className="article-more__grid">
            {relatedArticles.map((related) => (
              <article key={related.slug}>
                <p className="eyebrow">{related.category}</p>
                <h3><Link href={`/cuaderno/${related.slug}`}>{related.title}</Link></h3>
                <p>{related.excerpt}</p>
                <Link className="text-link" href={`/cuaderno/${related.slug}`}>Leer la nota <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
