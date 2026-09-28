"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackCoruEvent } from "@/lib/analytics";
import { getProductCoverAlt, type ReadingPace, type ReadingTime, type StoryEntry } from "@/lib/products";

interface LabBook {
  slug: string;
  title: string;
  author: string;
  genre: string;
  mood: string;
  pace: ReadingPace;
  readingTime: ReadingTime;
  pages?: number;
  entry: StoryEntry;
  isbn?: string;
  cover: string;
  coverAlt?: string;
  hook: string;
  idealMoment: string;
}

interface DiscoveryPathsProps {
  books: LabBook[];
  initialPath: Path;
}

type Path = "entrada" | "guiado" | "directo";
type Feeling = "empezar" | "silencio" | "historia" | "aprender";

const FEELINGS: { id: Feeling; label: string; detail: string }[] = [
  { id: "empezar", label: "Quiero empezar a leer", detail: "Un primer paso que apetezca dar" },
  { id: "silencio", label: "Necesito silencio", detail: "Demasiada información hoy" },
  { id: "historia", label: "Quiero entrar en una historia", detail: "Estar ahí dentro y olvidarme del resto" },
  { id: "aprender", label: "Me apetece aprender", detail: "Una idea, una emoción o una habilidad" },
];

const GENRE_ORDER = ["Aventura", "Fantasía", "Romance", "Misterio", "Ensayo", "Ciencia ficción", "Histórica", "Terror"];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function guidedScore(book: LabBook, feeling: Feeling) {
  if (feeling === "empezar") return (book.readingTime === "Una tarde" ? 6 : 0) + (book.pages && book.pages <= 250 ? 3 : 0) + (book.pace === "Sereno" ? 2 : 0);
  if (feeling === "silencio") return (book.pace === "Sereno" ? 6 : 0) + (["Serenidad", "Contemplación", "Claridad", "Delicadeza"].includes(book.mood) ? 4 : 0);
  if (feeling === "historia") return (["Viajar", "Sentir"].includes(book.entry) ? 5 : 0) + (book.pace === "Envolvente" ? 4 : 0) + (book.mood === "Inmersión" ? 3 : 0);
  return (book.genre === "Ensayo" ? 6 : 0) + (book.entry === "Pensar" ? 5 : 0) + (book.mood === "Curiosidad" ? 2 : 0);
}

function reasonFor(book: LabBook, feeling: Feeling) {
  if (feeling === "empezar") return `${book.hook} ${book.readingTime === "Una tarde" ? "Cabe en una tarde; puedes empezar por aquí." : "Puedes entrar a tu ritmo."}`;
  if (feeling === "silencio") return `${book.hook} ${book.pace === "Sereno" ? "Avanza sin pedirte prisa." : book.idealMoment}`;
  if (feeling === "historia") return `${book.hook} ${book.pace === "Envolvente" ? "Una historia en la que quedarse un rato." : "Tiene el movimiento para entrar de lleno."}`;
  return `${book.hook} ${book.genre === "Ensayo" ? "Deja una idea nueva sobre la mesa." : "Puede enseñarte otra forma de mirar."}`;
}

function putDifferentGenresFirst(ranked: LabBook[]) {
  const firstThree: LabBook[] = [];
  const genres = new Set<string>();
  for (const book of ranked) {
    if (firstThree.length === 3) break;
    if (genres.has(book.genre)) continue;
    firstThree.push(book);
    genres.add(book.genre);
  }
  for (const book of ranked) {
    if (firstThree.length === 3) break;
    if (!firstThree.includes(book)) firstThree.push(book);
  }
  return [...firstThree, ...ranked.filter((book) => !firstThree.includes(book))];
}

function BookRow({ book, reason, placement }: { book: LabBook; reason: string; placement: string }) {
  const trackOpen = () => trackCoruEvent("product_open", { product: book.slug, genre: book.genre, placement });
  return (
    <article className="finding-paths__book">
      <Link className="finding-paths__cover-link" href={`/libros/${book.slug}`} aria-label={`Ver ${book.title}, de ${book.author}`} onClick={trackOpen}>
        <Image src={book.cover} alt={getProductCoverAlt(book)} width={100} height={148} sizes="(max-width: 600px) 78px, 100px" />
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
  const [visibleCount, setVisibleCount] = useState(initialPath === "guiado" ? 3 : 6);
  const lastTrackedSearch = useRef("");

  useEffect(() => {
    const resetFromNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('a[href="/descubrir"]')) return;
      setPath("entrada");
      setFeeling(null);
      setQuery("");
      setGenre("");
      setVisibleCount(6);
    };
    const syncFromHistory = () => {
      const next = new URLSearchParams(window.location.search).get("camino");
      setPath(next === "guiado" || next === "directo" ? next : "entrada");
    };
    document.addEventListener("click", resetFromNavigation);
    window.addEventListener("popstate", syncFromHistory);
    return () => {
      document.removeEventListener("click", resetFromNavigation);
      window.removeEventListener("popstate", syncFromHistory);
    };
  }, []);

  const genres = useMemo(() => [...new Set(books.map((book) => book.genre))]
    .sort((a, b) => (GENRE_ORDER.indexOf(a) === -1 ? 99 : GENRE_ORDER.indexOf(a)) - (GENRE_ORDER.indexOf(b) === -1 ? 99 : GENRE_ORDER.indexOf(b))), [books]);

  const results = useMemo(() => {
    if (path === "guiado") {
      if (!feeling) return [];
      const ranked = books.map((book, index) => ({ book, index, score: guidedScore(book, feeling) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .map(({ book }) => book);
      return putDifferentGenresFirst(ranked);
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
    setVisibleCount(next === "guiado" ? 3 : 6);
    if (next === "entrada") {
      setFeeling(null);
      setQuery("");
      setGenre("");
    }
    window.history.replaceState(window.history.state, "", next === "entrada" ? "/descubrir" : `/descubrir?camino=${next}`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function selectFeeling(next: Feeling) {
    trackCoruEvent("discovery_feeling", { feeling: next });
    setFeeling(next);
    setVisibleCount(3);
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
              <span className="finding-paths__door-description">Empezamos por tu momento de hoy.<br />Una pregunta, tres libros para empezar.</span>
              <span className="finding-paths__door-action">Encontrar mi camino <span aria-hidden="true">→</span></span>
            </button>
            <button type="button" className="finding-paths__door finding-paths__door--direct" onClick={() => selectPath("directo")}>
              <span className="finding-paths__tag">Ya tengo una pista</span>
              <strong>Tengo algo en mente</strong>
              <span className="finding-paths__door-description">Ve directo a un título, un autor o un género.<br />Sin pasar por preguntas.</span>
              <span className="finding-paths__door-action">Ir al libro <span aria-hidden="true">→</span></span>
            </button>
          </div>
          <p className="finding-paths__closing"><em>Leer debería sentirse bien.</em><span>Dos maneras de entrar. Ninguna te mete prisa.</span></p>
          <Link className="finding-paths__library-cta" href="/tienda">¿Prefieres verlo todo? Entra en la Biblioteca <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <div className={`finding-paths__workspace finding-paths__workspace--${path}`}>
          <nav className="finding-paths__wayfinder" aria-label="Formas de explorar libros">
            <button type="button" onClick={() => selectPath("entrada")}>← Empezar de nuevo</button>
            <button type="button" aria-current={path === "guiado" ? "page" : undefined} onClick={() => selectPath("guiado")}>Por cómo me siento</button>
            <button type="button" aria-current={path === "directo" ? "page" : undefined} onClick={() => selectPath("directo")}>Ya tengo una pista</button>
            <Link href="/tienda">Biblioteca <span aria-hidden="true">↗</span></Link>
          </nav>
          {path === "guiado" ? (
            <>
              <section className="finding-paths__guided-top" aria-labelledby="discovery-question">
                <div className="finding-paths__guided-intro">
                  <p className="finding-paths__eyebrow">Una pregunta cada vez</p>
                  <h1 id="discovery-question">¿Qué necesitas<br /><em>de un libro hoy?</em></h1>
                  <p>Puedes cambiarlo cuando quieras.</p>
                </div>
                <div className="finding-paths__feelings" role="group" aria-label="Qué buscas en un libro hoy">
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
                  <div className="finding-paths__results-heading"><div><p className="finding-paths__eyebrow">{activeFeeling?.label} · una selección breve</p><h2>Tres lecturas para empezar.</h2><p>Una razón distinta para cada libro. Si ninguna te llama, hay más.</p></div><span aria-live="polite">Mostrando {Math.min(visibleCount, results.length)} de {results.length}</span></div>
                  {results.length ? <div className="finding-paths__book-list">{results.slice(0, visibleCount).map((book) => <BookRow key={book.slug} book={book} reason={reasonFor(book, feeling)} placement="discovery_guided" />)}</div> : <p className="finding-paths__empty">Aún no hay libros para esta sensación. Prueba otra puerta.</p>}
                  {visibleCount < results.length && <button type="button" className="finding-paths__more" onClick={() => setVisibleCount((count) => count + 3)}>Ver otras tres lecturas <span aria-hidden="true">→</span></button>}
                </section>
              ) : <p className="finding-paths__hint">Elige el momento que más se parezca al tuyo. No hay respuesta incorrecta.</p>}
            </>
          ) : (
            <>
              <div className="finding-paths__direct-layout">
                <aside className="finding-paths__direct-story"><p className="finding-paths__eyebrow">Tu camino · ya tienes una pista</p><h2>Sabes lo que<br /><em>buscas.</em></h2><p>Un título, una autora o un ISBN: encuentra su ficha sin pasar por otros filtros.</p><p>¿Quieres combinar sensación, tiempo y ritmo? La Biblioteca está a un paso.</p><div className="finding-paths__direct-seal"><Image src="/assets/brand/corukai-normal.svg" alt="" width={92} height={104} /></div><button type="button" onClick={() => selectPath("guiado")}>¿Prefieres dejarte llevar?<span>Cambia al camino guiado →</span></button></aside>
                <div className="finding-paths__direct-main">
                  <p className="finding-paths__eyebrow">Cuando ya tienes una pista</p>
                  <h1>Ve directo <em>al libro.</em></h1>
                  <label className="finding-paths__search"><span className="finding-paths__search-icon" aria-hidden="true" /><span className="sr-only">Buscar por título, autor o ISBN</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6); }} placeholder="Busca por título, autor o ISBN" /></label>
                  <p className="finding-paths__genre-prompt">O empieza por un género</p>
                  <div className="finding-paths__genres" role="group" aria-label="Filtrar por género">{genres.map((item) => <button type="button" key={item} aria-pressed={genre === item} onClick={() => selectGenre(item)}>{item}</button>)}</div>
                  <p className="finding-paths__catalog-note">Si prefieres combinar varios criterios, <Link href="/tienda">explora todos los filtros en la Biblioteca →</Link></p>
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
