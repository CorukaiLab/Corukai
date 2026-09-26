"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackCoruEvent } from "@/lib/analytics";
import type { ReadingPace, StoryEntry } from "@/lib/products";

interface LabBook {
  slug: string;
  title: string;
  author: string;
  genre: string;
  mood: string;
  pace: ReadingPace;
  entry: StoryEntry;
  isbn?: string;
  cover: string;
  hook: string;
  idealMoment: string;
}

interface DiscoveryPathsProps {
  books: LabBook[];
  initialPath: Path;
}

type Path = "entrada" | "guiado" | "directo";
type Feeling = "calma" | "asombro" | "pulso" | "sorpresa";

const FEELINGS: { id: Feeling; label: string; detail: string }[] = [
  { id: "calma", label: "Bajar el ruido", detail: "Algo que me deje respirar" },
  { id: "asombro", label: "Quiero asombro", detail: "Volver a mirar con curiosidad" },
  { id: "pulso", label: "Algo que me mueva", detail: "Necesito impulso" },
  { id: "sorpresa", label: "Sorpréndeme", detail: "Una puerta que no esperaba" },
];

const GENRE_ORDER = ["Aventura", "Fantasía", "Romance", "Misterio", "Ensayo", "Ciencia ficción", "Histórica", "Terror"];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function guidedScore(book: LabBook, feeling: Feeling) {
  if (feeling === "calma") return (book.pace === "Sereno" ? 5 : 0) + (["Serenidad", "Contemplación", "Claridad", "Delicadeza"].includes(book.mood) ? 4 : 0);
  if (feeling === "asombro") return (["Asombro", "Extrañeza", "Curiosidad"].includes(book.mood) ? 6 : 0) + (book.entry === "Crear" ? 2 : 0);
  if (feeling === "pulso") return (["Energía", "Libertad", "Tensión", "Inmersión"].includes(book.mood) ? 6 : 0) + (book.pace === "Intenso" ? 2 : 0);
  return book.entry === "Viajar" || book.entry === "Crear" ? 3 : 1;
}

function reasonFor(book: LabBook, feeling: Feeling) {
  if (feeling === "calma" && book.pace === "Sereno") return `Ritmo sereno · ${book.idealMoment}`;
  if (feeling === "asombro") return `Para sentir ${book.mood.toLocaleLowerCase("es")} · ${book.idealMoment}`;
  if (feeling === "pulso") return `Para recuperar el pulso · ${book.idealMoment}`;
  return book.idealMoment;
}

function BookRow({ book, reason, placement }: { book: LabBook; reason: string; placement: string }) {
  const trackOpen = () => trackCoruEvent("product_open", { product: book.slug, genre: book.genre, placement });
  return (
    <article className="finding-paths__book">
      <Link className="finding-paths__cover-link" href={`/libros/${book.slug}`} aria-label={`Ver ${book.title}, de ${book.author}`} onClick={trackOpen}>
        <Image src={book.cover} alt={`Portada de ${book.title}`} width={100} height={148} sizes="(max-width: 600px) 78px, 100px" />
      </Link>
      <div className="finding-paths__book-copy">
        <p className="finding-paths__book-meta">{book.mood} · {book.genre}</p>
        <h3><Link href={`/libros/${book.slug}`} onClick={trackOpen}>{book.title}</Link></h3>
        <p className="finding-paths__author">{book.author}</p>
        <p className="finding-paths__reason">{reason}</p>
      </div>
      <Link className="finding-paths__book-link" href={`/libros/${book.slug}`} aria-label={`Abrir ficha de ${book.title}`} onClick={trackOpen}>Ver libro <span aria-hidden="true">→</span></Link>
    </article>
  );
}
export function DiscoveryPaths({ books, initialPath }: DiscoveryPathsProps) {
  const [path, setPath] = useState<Path>(initialPath);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const lastTrackedSearch = useRef("");

  const genres = useMemo(() => [...new Set(books.map((book) => book.genre))]
    .sort((a, b) => (GENRE_ORDER.indexOf(a) === -1 ? 99 : GENRE_ORDER.indexOf(a)) - (GENRE_ORDER.indexOf(b) === -1 ? 99 : GENRE_ORDER.indexOf(b))), [books]);

  const results = useMemo(() => {
    if (path === "guiado") {
      if (!feeling) return [];
      return books.map((book, index) => ({ book, index, score: guidedScore(book, feeling) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map(({ book }) => book);
    }
    if (path === "directo") {
      const search = normalize(query.trim());
      return books.filter((book) => (!genre || book.genre === genre)
        && (!search || [book.title, book.author, book.isbn || "", book.genre, book.mood].some((field) => normalize(field).includes(search))));
    }
    return [];
  }, [books, feeling, genre, path, query]);

  useEffect(() => {
    if (initialPath !== "entrada") trackCoruEvent("discovery_path", { path: initialPath });
  }, [initialPath]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (path !== "directo" || normalizedQuery.length < 2) {
      lastTrackedSearch.current = "";
      return;
    }
    if (lastTrackedSearch.current === normalizedQuery) return;
    const timeout = window.setTimeout(() => {
      lastTrackedSearch.current = normalizedQuery;
      trackCoruEvent("discovery_search", { query_length: normalizedQuery.length, results: results.length });
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [path, query, results.length]);

  function selectPath(next: Path) {
    if (next !== "entrada") trackCoruEvent("discovery_path", { path: next });
    setPath(next);
    setVisibleCount(6);
    window.history.replaceState(window.history.state, "", next === "entrada" ? "/descubrir" : `/descubrir?camino=${next}`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function selectFeeling(next: Feeling) {
    trackCoruEvent("discovery_feeling", { feeling: next });
    setFeeling(next);
    setVisibleCount(6);
  }

  function selectGenre(next: string) {
    trackCoruEvent("discovery_genre", { genre: next, selected: next !== genre });
    setGenre(next === genre ? "" : next);
    setVisibleCount(6);
  }

  const activeFeeling = FEELINGS.find((option) => option.id === feeling);

  return (
    <main className={`finding-paths finding-paths--${path}`}>
      {path === "entrada" ? (
        <div className="finding-paths__entry">
          <header className="finding-paths__entry-intro">
            <p className="finding-paths__eyebrow">Descubrir · sin prisa</p>
            <div className="finding-paths__entry-heading">
              <h1>Un libro para<br /><em>este momento.</em></h1>
              <p>Elige cómo quieres empezar.<br />Lo demás puede esperar.</p>
            </div>
          </header>
          <div className="finding-paths__doors" aria-label="Elige cómo encontrar un libro">
            <button type="button" className="finding-paths__door finding-paths__door--guided" onClick={() => selectPath("guiado")}>
              <span className="finding-paths__tag">Guíame</span>
              <span className="finding-paths__seal" aria-hidden="true"><Image src="/assets/brand/corukai-normal.svg" alt="" width={63} height={71} /></span>
              <strong>No sé qué leer</strong>
              <span className="finding-paths__door-description">Comenzamos por cómo te quieres sentir.<br />Una pregunta cada vez, una selección breve.</span>
              <span className="finding-paths__door-action">Encontrar mi camino <span aria-hidden="true">→</span></span>
            </button>
            <button type="button" className="finding-paths__door finding-paths__door--direct" onClick={() => selectPath("directo")}>
              <span className="finding-paths__tag">Búsqueda directa</span>
              <strong>Tengo algo en mente</strong>
              <span className="finding-paths__door-description">Busca un libro, un autor o un género.<br />Sin pasar por preguntas.</span>
              <span className="finding-paths__door-action">Ir a la búsqueda <span aria-hidden="true">→</span></span>
            </button>
          </div>
          <p className="finding-paths__closing"><em>Leer debería sentirse bien.</em><span>Dos maneras de entrar. Ninguna te mete prisa.</span></p>
        </div>
      ) : (
        <div className={`finding-paths__workspace finding-paths__workspace--${path}`}>
          <button type="button" className="finding-paths__back" onClick={() => selectPath("entrada")}>← <span>Cambiar camino</span></button>
          {path === "guiado" ? (
            <>
              <section className="finding-paths__guided-top" aria-labelledby="discovery-question">
                <div className="finding-paths__guided-intro">
                  <p className="finding-paths__eyebrow">Una pregunta cada vez</p>
                  <h1 id="discovery-question">¿Qué te apetece<br /><em>sentir ahora?</em></h1>
                  <p>Puedes cambiarlo cuando quieras.</p>
                </div>
                <div className="finding-paths__feelings" role="group" aria-label="Cómo te apetece sentirte">
                  {FEELINGS.map((option) => (
                    <button type="button" key={option.id} aria-pressed={feeling === option.id} className={feeling === option.id ? "is-active" : ""} onClick={() => selectFeeling(option.id)}>
                      <span className="finding-paths__radio" aria-hidden="true" />
                      <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                      <span className="finding-paths__option-arrow" aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              </section>
              {feeling ? (
                <section className="finding-paths__results" aria-label="Lecturas sugeridas">
                  <div className="finding-paths__results-heading"><div><p className="finding-paths__eyebrow">{activeFeeling?.label} · una selección breve</p><h2>Lecturas para empezar.</h2><p>Pocas opciones, con una razón para cada una.</p></div><span aria-live="polite">{results.length} {results.length === 1 ? "libro" : "libros"} que encajan</span></div>
                  {results.length ? <div className="finding-paths__book-list">{results.slice(0, visibleCount).map((book) => <BookRow key={book.slug} book={book} reason={reasonFor(book, feeling)} placement="discovery_guided" />)}</div> : <p className="finding-paths__empty">Aún no hay libros para esta sensación. Prueba otra puerta.</p>}
                  {visibleCount < results.length && <button type="button" className="finding-paths__more" onClick={() => setVisibleCount((count) => count + 6)}>Ver más lecturas que encajan <span aria-hidden="true">→</span></button>}
                </section>
              ) : <p className="finding-paths__hint">Elige una sensación y aparecerá una selección. No hay respuesta incorrecta.</p>}
            </>
          ) : (
            <>
              <div className="finding-paths__direct-layout">
                <aside className="finding-paths__direct-story"><p className="finding-paths__eyebrow">Tu camino · búsqueda directa</p><h2>Sabes lo que<br /><em>buscas.</em></h2><p>Título, autor, ISBN o género.<br />Sin rodeos. Sin preguntas previas.</p><div className="finding-paths__direct-seal"><Image src="/assets/brand/corukai-normal.svg" alt="" width={92} height={104} /></div><button type="button" onClick={() => selectPath("guiado")}>¿Prefieres dejarte llevar?<span>Cambia al camino guiado →</span></button></aside>
                <div className="finding-paths__direct-main">
                  <p className="finding-paths__eyebrow">Explora a tu manera</p>
                  <h1>Encuentra <em>ese libro.</em></h1>
                  <label className="finding-paths__search"><span className="finding-paths__search-icon" aria-hidden="true" /><span className="sr-only">Buscar por título, autor o ISBN</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6); }} placeholder="Busca por título, autor o ISBN" /></label>
                  <p className="finding-paths__genre-prompt">O empieza por un género</p>
                  <div className="finding-paths__genres" role="group" aria-label="Filtrar por género">{genres.map((item) => <button type="button" key={item} aria-pressed={genre === item} onClick={() => selectGenre(item)}>{item}</button>)}</div>
                  <section className="finding-paths__results" aria-label="Resultados de la búsqueda">
                    <div className="finding-paths__results-heading"><div><h2>{genre || (query ? `Resultados para «${query}»` : "Todos los libros")}</h2><p aria-live="polite">{results.length} {results.length === 1 ? "libro" : "libros"} {genre ? "en esta selección" : "en el catálogo"}</p></div><span>Orden: selección editorial</span></div>
                    {results.length ? <div className="finding-paths__book-list">{results.slice(0, visibleCount).map((book) => <BookRow key={book.slug} book={book} reason={book.hook} placement="discovery_direct" />)}</div> : <div className="finding-paths__empty"><h3>Esta balda está vacía.</h3><p>Prueba otro título, autor o género; quizá el libro esté esperándote cerca.</p><button type="button" onClick={() => { setQuery(""); setGenre(""); }}>Borrar la búsqueda</button></div>}
                    {visibleCount < results.length && <button type="button" className="finding-paths__more" onClick={() => setVisibleCount((count) => count + 6)}>Ver siguientes resultados <span aria-hidden="true">→</span></button>}
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
