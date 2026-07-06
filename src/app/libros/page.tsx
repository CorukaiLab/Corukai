import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { getBooks } from "@/sanity/lib/queries";

export const metadata = {
  title: "Libros - CoruKai",
  description:
    "Catalogo inicial de CoruKai para descubrir libros desde genero, emocion y momento lector.",
};

export default async function BooksPage() {
  const books = await getBooks();
  const genres = Array.from(new Set(books.map((book) => book.genre)));

  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-hero">
          <p className="eyebrow">Catalogo vivo</p>
          <h1>Libros para curiosear sin convertirlo en tarea.</h1>
          <p>
            Primeras fichas conectadas a Sanity. Cada libro puede crecer con
            portada, ambiente, contexto cultural y guia CoruKai.
          </p>
        </section>

        <section className="catalog-layout">
          <aside className="filter-panel" aria-label="Filtros de catalogo">
            <p className="eyebrow">Generos</p>
            <div className="filter-list">
              {genres.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          </aside>

          <div className="book-grid book-grid--catalog">
            {books.map((book) => (
              <article className="book-card" key={book.slug}>
                <div
                  className="book-card__cover"
                  style={{ "--genre-color": book.genreColor } as CSSProperties}
                  aria-hidden="true"
                >
                  <span>{book.genre}</span>
                </div>
                <div className="book-card__body">
                  <p>{book.primaryEmotion ?? book.genre}</p>
                  <h2>{book.title}</h2>
                  <span>{book.author}</span>
                  <small>{book.shortDescription ?? book.vibe}</small>
                  <Link className="text-link" href={`/libros/${book.slug}`}>
                    Ver ficha CoruKai
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
