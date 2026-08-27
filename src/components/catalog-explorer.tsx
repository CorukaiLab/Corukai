"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

type InitialFilters = {
  q?: string;
  mood?: string;
  genre?: string;
  time?: string;
  pace?: string;
  entry?: string;
};

const ENTRY_PATHS = [
  {
    label: "Salir de aquí",
    description: "Viajes, mundos y lugares que ensanchan el día.",
    filter: { entry: "Viajar" },
    covers: ["hacia-rutas-salvajes", "piranesi"],
  },
  {
    label: "Bajar el ruido",
    description: "Historias serenas para leer sin correr.",
    filter: { pace: "Sereno" },
    covers: ["siddhartha", "seda"],
  },
  {
    label: "Volver a crear",
    description: "Extrañeza, asombro e ideas que dejan una chispa.",
    filter: { entry: "Crear" },
    covers: ["piranesi", "kalpa-imperial"],
  },
] as const;

function unique(products: Product[], key: keyof Pick<Product, "genre" | "mood" | "readingTime" | "pace" | "entry">) {
  return [...new Set(products.map((product) => product[key]))];
}

export function CatalogExplorer({ products, initial = {} }: { products: Product[]; initial?: InitialFilters }) {
  const [q, setQ] = useState(initial.q || "");
  const [genre, setGenre] = useState(initial.genre || "");
  const [mood, setMood] = useState(initial.mood || "");
  const [time, setTime] = useState(initial.time || "");
  const [pace, setPace] = useState(initial.pace || "");
  const [entry, setEntry] = useState(initial.entry || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("es");
    return products.filter((product) => {
      const matchesQuery = !query || [product.title, product.author, product.genre, product.mood, product.hook]
        .join(" ").toLocaleLowerCase("es").includes(query);
      return matchesQuery
        && (!genre || product.genre === genre)
        && (!mood || product.mood === mood)
        && (!time || product.readingTime === time)
        && (!pace || product.pace === pace)
        && (!entry || product.entry === entry);
    });
  }, [entry, genre, mood, pace, products, q, time]);

  const activeFilters = [genre, mood, time, pace, entry].filter(Boolean).length + (q ? 1 : 0);
  const activeLabels = [genre, mood, time, pace, entry, q ? `“${q}”` : ""].filter(Boolean);
  const lead = filtered[0];
  const reset = () => {
    setQ(""); setGenre(""); setMood(""); setTime(""); setPace(""); setEntry("");
  };

  const applyEntryPath = (path: (typeof ENTRY_PATHS)[number]) => {
    reset();
    if ("entry" in path.filter) setEntry(path.filter.entry);
    if ("pace" in path.filter) setPace(path.filter.pace);
  };

  useEffect(() => {
    if (!isFiltersOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFiltersOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFiltersOpen]);

  return (
    <section className="catalog-explorer" aria-label="Explorar el catálogo">
      <section className="catalog-entry" aria-labelledby="catalog-entry-title">
        <div className="catalog-entry__search">
          <p className="eyebrow">La mesa de consulta</p>
          <h2 id="catalog-entry-title">Puedes buscar.<br />También puedes pasear.</h2>
          <label>
            <span aria-hidden="true">⌕</span>
            <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Un título, una autora, una sensación…" />
          </label>
          <p>Si ya sabes algo, escríbelo. Si todavía no, entra por uno de estos pasillos.</p>
        </div>
        <div className="catalog-entry__aisles" aria-label="Pasillos editoriales">
          {ENTRY_PATHS.map((path, index) => {
            const covers = path.covers
              .map((slug) => products.find((product) => product.slug === slug))
              .filter((product): product is Product => Boolean(product));
            return (
              <button type="button" onClick={() => applyEntryPath(path)} key={path.label}>
                <span className="catalog-entry__aisle-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="catalog-entry__aisle-copy"><strong>{path.label}</strong><small>{path.description}</small></span>
                <span className="catalog-entry__aisle-covers" aria-hidden="true">
                  {covers.map((product) => <Image src={product.cover} alt="" width={74} height={110} key={product.slug} />)}
                </span>
                <span className="catalog-entry__aisle-arrow" aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        className="filter-mobile-trigger"
        type="button"
        aria-controls="catalog-filters"
        aria-expanded={isFiltersOpen}
        onClick={() => setIsFiltersOpen(true)}
      >
        <span><b>Tu brújula</b>{activeLabels.length ? activeLabels.join(" · ") : "Todos los libros"}</span>
        <strong>{activeFilters ? `${activeFilters} activas` : "Filtrar"} <span aria-hidden="true">↗</span></strong>
      </button>
      <button
        className={`filter-backdrop ${isFiltersOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Cerrar filtros"
        tabIndex={isFiltersOpen ? 0 : -1}
        onClick={() => setIsFiltersOpen(false)}
      />
      <aside
        className={`filter-studio ${isFiltersOpen ? "is-open" : ""}`}
        id="catalog-filters"
        aria-label="Filtros del catálogo"
      >
        <div className="filter-studio__heading">
          <div>
            <p className="eyebrow">Tu brújula</p>
            <strong>{activeFilters ? `${activeFilters} pistas activas` : "Empieza por una pista"}</strong>
          </div>
          <button className="filter-close" type="button" aria-label="Cerrar filtros" onClick={() => setIsFiltersOpen(false)}>Cerrar</button>
        </div>
        <label className="filter-search">
          <span>Buscar una palabra, autor o lugar</span>
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Ej. isla, Zweig, extrañeza…" />
        </label>
        <FilterGroup label="Género" value={genre} options={unique(products, "genre")} onChange={setGenre} />
        <FilterGroup label="Sensación" value={mood} options={unique(products, "mood")} onChange={setMood} />
        <FilterGroup label="Tiempo" value={time} options={unique(products, "readingTime")} onChange={setTime} />
        <FilterGroup label="Ritmo" value={pace} options={unique(products, "pace")} onChange={setPace} />
        <FilterGroup label="La historia puede…" value={entry} options={unique(products, "entry")} onChange={setEntry} />
        <div className="filter-studio__actions">
          {activeFilters > 0 && <button className="filter-reset" type="button" onClick={reset}>Borrar las pistas</button>}
          <button className="filter-apply" type="button" onClick={() => setIsFiltersOpen(false)}>Mostrar {filtered.length} {filtered.length === 1 ? "historia" : "historias"}</button>
        </div>
      </aside>
      <div className={`filter-mobile-actions ${isFiltersOpen ? "is-open" : ""}`} aria-hidden={!isFiltersOpen}>
        {activeFilters > 0 && <button className="filter-reset" type="button" onClick={reset}>Borrar pistas</button>}
        <button className="filter-apply" type="button" onClick={() => setIsFiltersOpen(false)}>Mostrar {filtered.length} {filtered.length === 1 ? "historia" : "historias"}</button>
      </div>

      <div className="catalog-results">
        <header className="catalog-results__header catalog-bridge" aria-live="polite">
          <div className="catalog-bridge__selection">
            <span>Tu selección</span>
            <div>
              {activeLabels.length
                ? activeLabels.map((label) => <b key={label}>{label}</b>)
                : <b>Todo el catálogo</b>}
            </div>
          </div>
          <span className="catalog-bridge__line" aria-hidden="true" />
          <div className="catalog-bridge__result">
            {lead ? (
              <>
                <Image src={lead.cover} alt="" width={42} height={64} aria-hidden="true" />
                <div>
                  <p><strong>{filtered.length}</strong> {filtered.length === 1 ? "historia" : "historias"}</p>
                  <span>Primera coincidencia: <b>{lead.title}</b></span>
                </div>
              </>
            ) : <p><strong>0</strong> historias</p>}
          </div>
        </header>
        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map((product, index) => (
              <Fragment key={product.slug}>
                <ProductCard product={product} priority={index < 5} compact />
                {(index + 1) % 8 === 0 && index < filtered.length - 1 ? (
                  <aside className="catalog-coru-note">
                    <span aria-hidden="true">C</span>
                    <p className="eyebrow">Una nota entre estantes</p>
                    <blockquote>
                      {index < 9
                        ? "Si hoy todo pesa, empieza por una historia que no te pida correr."
                        : "Cambiar de género también es una forma de volver a tener curiosidad."}
                    </blockquote>
                    <Link href="/#balda-coru">Ver la balda temporal de Coru <b aria-hidden="true">→</b></Link>
                  </aside>
                ) : null}
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__lamp" aria-hidden="true" />
            <Image src="/assets/brand/corukai-normal.svg" alt="" width={64} height={74} />
            <p className="eyebrow">Demasiadas pistas</p>
            <h2>Esta balda todavía está vacía.</h2>
            <p>Quita una pista y dejamos que aparezcan más puertas.</p>
            <button className="button button--ink" type="button" onClick={reset}>Abrir de nuevo la búsqueda</button>
            <Link className="text-link" href="/">Volver a la Home</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button type="button" aria-pressed={value === option} onClick={() => onChange(value === option ? "" : option)} key={option}>
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
