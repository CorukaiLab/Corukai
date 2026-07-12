import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { getBooks, getGenres } from "@/sanity/lib/queries";

export const metadata = {
  title: "Libros - CoruKai",
  description:
    "Catalogo inicial de CoruKai para descubrir libros desde genero, emocion y momento lector.",
};

interface BooksPageProps {
  searchParams?: Promise<{
    genero?: string;
    q?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const selectedGenre = params?.genero;
  const searchQuery = params?.q?.trim() ?? "";
  const [books, genres] = await Promise.all([
    getBooks({ genreSlug: selectedGenre, query: searchQuery }),
    getGenres(),
  ]);

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
            <form className="catalog-search" action="/libros">
              {selectedGenre ? (
                <input name="genero" type="hidden" value={selectedGenre} />
              ) : null}
              <label htmlFor="book-search">Buscar</label>
              <div className="catalog-search__row">
                <input
                  defaultValue={searchQuery}
                  id="book-search"
                  name="q"
                  placeholder="titulo, autor, vibe..."
                  type="search"
                />
                <button type="submit">Buscar</button>
              </div>
            </form>

            <p className="eyebrow">Generos</p>
            <div className="filter-list">
              <Link
                className={!selectedGenre ? "is-active" : undefined}
                href={searchQuery ? `/libros?q=${encodeURIComponent(searchQuery)}` : "/libros"}
              >
                Todos
              </Link>
              {genres.map((genre) => (
                <Link
                  className={selectedGenre === genre.slug ? "is-active" : undefined}
                  href={`/libros?genero=${genre.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                  key={genre.slug}
                  style={{ "--genre-color": genre.color } as CSSProperties}
                >
                  {genre.title}
                </Link>
              ))}
            </div>
          </aside>

          {books.length > 0 ? (
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
                    <small>
                      {book.shortDescription ??
                        book.vibe ??
                        "Ficha en preparacion editorial."}
                    </small>
                    <Link className="text-link" href={`/libros/${book.slug}`}>
                      Ver ficha CoruKai
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="eyebrow">Sin resultados</p>
              <h2>No hay libros que encajen con esa busqueda.</h2>
              <p>
                Prueba con un genero, autor o sensacion mas amplia. CoruKai
                todavia esta creciendo.
              </p>
              <Link className="button button--primary" href="/libros">
                Ver todo el catalogo
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
