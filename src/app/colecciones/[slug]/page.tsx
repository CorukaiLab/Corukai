import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  getCollectionBySlug,
  getCollectionSlugs,
} from "@/sanity/lib/queries";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  return {
    title:
      collection?.seoTitle ??
      `${collection?.title ?? "Coleccion"} - CoruKai`,
    description:
      collection?.seoDescription ??
      collection?.description ??
      "Coleccion emocional de libros en CoruKai.",
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-hero">
          <Link className="text-link" href="/#colecciones">
            Volver a colecciones
          </Link>
          <p className="eyebrow">
            Coleccion / {collection.primaryEmotion ?? "Curiosidad tranquila"}
          </p>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
        </section>

        <section className="section collection-books-section">
          {collection.books?.length ? (
            <div className="book-grid">
              {collection.books.map((book) => (
                <article className="book-card" key={book.slug}>
                  <div
                    aria-hidden="true"
                    className="book-card__cover"
                    style={{ "--genre-color": book.genreColor } as CSSProperties}
                  >
                    <span>{book.genre}</span>
                  </div>
                  <div className="book-card__body">
                    <p>{book.primaryEmotion ?? book.genre}</p>
                    <h2>{book.title}</h2>
                    <span>{book.author}</span>
                    <small>
                      {book.shortDescription ??
                        book.vibe ??
                        "Ficha en preparacion editorial."}
                    </small>
                    <Link className="text-link" href={`/libros/${book.slug}`}>
                      Entrar en la historia
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Coleccion en preparacion</p>
              <h2>Todavia no hay libros asociados.</h2>
              <p>
                Esta coleccion existe en Sanity, pero falta vincular sus
                primeras fichas.
              </p>
              <Link className="button button--primary" href="/libros">
                Ver catalogo
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
