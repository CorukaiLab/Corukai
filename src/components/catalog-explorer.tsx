"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/catalog";

type InitialFilters = {
  q?: string;
  mood?: string;
  genre?: string;
  time?: string;
  pace?: string;
  entry?: string;
};

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
  const reset = () => {
    setQ(""); setGenre(""); setMood(""); setTime(""); setPace(""); setEntry("");
  };

  return (
    <section className="catalog-explorer" aria-label="Explorar el catálogo">
      <aside className="filter-studio">
        <div className="filter-studio__heading">
          <p className="eyebrow">Tu brújula</p>
          <strong>{activeFilters ? `${activeFilters} pistas activas` : "Empieza por una pista"}</strong>
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
        {activeFilters > 0 && <button className="filter-reset" type="button" onClick={reset}>Borrar las pistas</button>}
      </aside>

      <div className="catalog-results">
        <header className="catalog-results__header" aria-live="polite">
          <p><strong>{filtered.length}</strong> {filtered.length === 1 ? "historia" : "historias"}</p>
          <p>No están ordenadas por popularidad, sino por posibilidad.</p>
        </header>
        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 4} compact />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Demasiadas pistas</p>
            <h2>Ese libro aún no está en nuestra mesa.</h2>
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
