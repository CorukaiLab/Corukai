"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product, ReadingTime, StoryEntry } from "@/lib/catalog";

const timeOptions: ReadingTime[] = ["Una tarde", "Varias noches", "Sin prisa"];
const moodOptions = ["Calidez", "Asombro", "Curiosidad", "Inquietud", "Melancolía"];
const entryOptions: { label: string; value: StoryEntry }[] = [
  { label: "Me reciba", value: "Volver" },
  { label: "Me lleve lejos", value: "Viajar" },
  { label: "Me toque", value: "Sentir" },
  { label: "Me haga pensar", value: "Pensar" },
  { label: "Despierte ideas", value: "Crear" },
];

function scoreProduct(product: Product, time: string, mood: string, entry: string, query: string) {
  const haystack = `${product.title} ${product.author} ${product.genre} ${product.mood} ${product.hook}`.toLocaleLowerCase("es");
  const words = query.toLocaleLowerCase("es").split(/\s+/).filter(Boolean);
  const queryScore = words.reduce((score, word) => score + (haystack.includes(word) ? 5 : -8), 0);

  return queryScore
    + (time && product.readingTime === time ? 4 : 0)
    + (mood && product.mood === mood ? 5 : 0)
    + (entry && product.entry === entry ? 6 : 0);
}

export function DiscoverySearch({ products }: { products: Product[] }) {
  const [time, setTime] = useState<ReadingTime | "">("");
  const [mood, setMood] = useState("");
  const [entry, setEntry] = useState<StoryEntry | "">("");
  const [query, setQuery] = useState("");

  const matches = useMemo(
    () => [...products]
      .sort((a, b) => scoreProduct(b, time, mood, entry, query) - scoreProduct(a, time, mood, entry, query))
      .slice(0, 3),
    [entry, mood, products, query, time],
  );
  const lead = matches[0];
  const hasChoices = Boolean(time || mood || entry || query);

  const shopParams = new URLSearchParams();
  if (time) shopParams.set("time", time);
  if (mood) shopParams.set("mood", mood);
  if (entry) shopParams.set("entry", entry);
  if (query) shopParams.set("q", query);

  return (
    <section className="discovery-lab" id="descubrir" aria-labelledby="discovery-title">
      <div className="discovery-lab__intro">
        <p className="eyebrow">La mesa de curiosidades</p>
        <h2 id="discovery-title">No tienes que saber qué libro buscas.</h2>
        <p>Cuéntanos cuánto espacio tienes y qué te gustaría que ocurriera dentro de ti.</p>
      </div>

      <div className="discovery-lab__controls">
        <label className="discovery-query">
          <span>Algo que ya ronda por tu cabeza</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Una isla, una carta, un misterio lento…"
          />
        </label>

        <fieldset>
          <legend>¿Cuánto tiempo quieres darle?</legend>
          <div className="choice-row">
            {timeOptions.map((option) => (
              <button type="button" aria-pressed={time === option} onClick={() => setTime(time === option ? "" : option)} key={option}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>¿Qué sensación buscas?</legend>
          <div className="choice-row">
            {moodOptions.map((option) => (
              <button type="button" aria-pressed={mood === option} onClick={() => setMood(mood === option ? "" : option)} key={option}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Quiero que la historia…</legend>
          <div className="choice-row">
            {entryOptions.map((option) => (
              <button type="button" aria-pressed={entry === option.value} onClick={() => setEntry(entry === option.value ? "" : option.value)} key={option.value}>
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="discovery-result" aria-live="polite">
        <div className="discovery-result__number" aria-hidden="true">{hasChoices ? "01" : "?"}</div>
        <div className="discovery-result__cover">
          <Image src={lead.cover} alt={`Portada de ${lead.title}`} width={300} height={450} sizes="(max-width: 700px) 42vw, 18vw" />
        </div>
        <div className="discovery-result__copy">
          <p className="eyebrow">{hasChoices ? "Tu primera puerta" : "Una puerta para empezar"}</p>
          <h3>{lead.title}</h3>
          <p className="discovery-result__author">{lead.author} · {lead.genre}</p>
          <p>{lead.hook}</p>
          <p className="creative-spark"><span>Chispa creativa</span>{lead.creativeSpark}</p>
          <div className="discovery-result__actions">
            <Link className="button button--coral" href={`/libros/${lead.slug}`}>Entrar en esta historia <span aria-hidden="true">↗</span></Link>
            <Link className="text-link text-link--light" href={`/tienda?${shopParams.toString()}`}>Ver todas las coincidencias</Link>
          </div>
        </div>
        <div className="discovery-alternatives" aria-label="Otras dos posibilidades">
          {matches.slice(1).map((product) => (
            <Link href={`/libros/${product.slug}`} key={product.slug}>
              <span>{product.genre}</span>
              <strong>{product.title}</strong>
              <small>{product.readingTime} · {product.pace}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
