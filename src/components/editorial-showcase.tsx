"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Product } from "@/lib/products";

export function EditorialShowcase({ products }: { products: Product[] }) {
  const [activeSlug, setActiveSlug] = useState(products[0]?.slug ?? "");
  const activeIndex = Math.max(0, products.findIndex((product) => product.slug === activeSlug));
  const activeProduct = products[activeIndex];

  if (!activeProduct) return null;

  return (
    <section className="editorial-showcase" aria-labelledby="editorial-showcase-title">
      <header className="editorial-showcase__heading">
        <div>
          <p className="eyebrow">El escaparate cambia contigo</p>
          <h2 id="editorial-showcase-title">Un libro delante.<br />Tres esperando.</h2>
        </div>
        <p>No son productos equivalentes en una fila. Cada portada ocupa el escaparate cuando decides mirarla.</p>
      </header>

      <div className="editorial-showcase__stage" style={{ "--accent": activeProduct.accent } as CSSProperties}>
        <article className="editorial-showcase__lead" aria-live="polite">
          <span className="editorial-showcase__folio">Selección {String(activeIndex + 1).padStart(2, "0")}</span>
          <div className="editorial-showcase__cover">
            <Image
              src={activeProduct.cover}
              alt={`Portada de ${activeProduct.title}`}
              width={420}
              height={630}
              sizes="(max-width: 760px) 62vw, 34vw"
            />
          </div>
          <div className="editorial-showcase__copy">
            <p>{activeProduct.genre} · {activeProduct.mood}</p>
            <h3>{activeProduct.title}</h3>
            <span>{activeProduct.author}</span>
            <blockquote>“{activeProduct.hook}”</blockquote>
            <Link href={`/libros/${activeProduct.slug}`}>Abrir esta historia <span aria-hidden="true">↗</span></Link>
          </div>
        </article>

        <div className="editorial-showcase__stack" aria-label="Cambiar libro del escaparate">
          {products.map((product, index) => (
            <button
              type="button"
              aria-pressed={product.slug === activeProduct.slug}
              onClick={() => setActiveSlug(product.slug)}
              style={{ "--stack-accent": product.accent, "--stack-index": index } as CSSProperties}
              key={product.slug}
            >
              <Image src={product.cover} alt="" width={130} height={195} sizes="110px" />
              <span><b>{product.title}</b><small>{product.genre}</small></span>
            </button>
          ))}
        </div>
      </div>
      <Link className="editorial-showcase__all" href="/tienda">Entrar en la biblioteca completa <span aria-hidden="true">→</span></Link>
    </section>
  );
}
