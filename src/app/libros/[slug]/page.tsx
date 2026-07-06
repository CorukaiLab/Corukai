import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { getBookBySlug, getBookSlugs } from "@/sanity/lib/queries";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  return {
    title: book?.seoTitle ?? `${book?.title ?? "Libro"} - CoruKai`,
    description:
      book?.seoDescription ??
      book?.shortDescription ??
      "Ficha emocional de libro en CoruKai.",
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) notFound();

  const authorYears = [book.authorBirthYear, book.authorDeathYear]
    .filter(Boolean)
    .join(" - ");

  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="book-detail-hero"
          style={{ "--genre-color": book.genreColor } as CSSProperties}
        >
          <Link className="text-link" href="/libros">
            Volver al catalogo
          </Link>

          <div className="book-detail-grid">
            <div className="book-object" aria-hidden="true">
              <span>{book.genre}</span>
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </div>

            <div className="book-detail-copy">
              <p className="eyebrow">
                {book.genre} / {book.primaryEmotion ?? "Curiosidad"}
              </p>
              <h1>{book.title}</h1>
              <p className="book-author">{book.author}</p>
              <p>{book.shortDescription}</p>
              <div className="detail-actions">
                <a className="button button--primary" href="#guia">
                  Ver guia CoruKai
                </a>
                <Link className="button button--secondary" href="/libros">
                  Seguir curioseando
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-section" id="guia">
          <div className="detail-card">
            <p className="eyebrow">Por que puede encajarte</p>
            <h2>{book.whyRead}</h2>
          </div>
          <div className="detail-card">
            <p className="eyebrow">Momento ideal</p>
            <h2>{book.idealMoment}</h2>
          </div>
          <div className="detail-card">
            <p className="eyebrow">Para quien si</p>
            <p>{book.forWhom}</p>
          </div>
          <div className="detail-card">
            <p className="eyebrow">Quizas no si...</p>
            <p>{book.notForWhom}</p>
          </div>
          <div className="detail-card">
            <p className="eyebrow">Datos clave</p>
            <dl className="facts-list">
              <div>
                <dt>Pais del autor</dt>
                <dd>{book.authorCountry ?? "Pendiente"}</dd>
              </div>
              <div>
                <dt>Autor</dt>
                <dd>{authorYears || "Pendiente"}</dd>
              </div>
              <div>
                <dt>Publicacion</dt>
                <dd>{book.publicationYear ?? "Pendiente"}</dd>
              </div>
            </dl>
          </div>
          <div className="detail-card">
            <p className="eyebrow">Curiosidad</p>
            <p>{book.curiosity}</p>
          </div>
        </section>
      </main>
    </>
  );
}
