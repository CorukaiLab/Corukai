"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { Product } from "@/lib/catalog";

const shelfShape = [
  { height: 238, width: 46, tilt: -1 },
  { height: 270, width: 52, tilt: 1 },
  { height: 226, width: 44, tilt: 0 },
  { height: 286, width: 58, tilt: -1 },
  { height: 248, width: 48, tilt: 1 },
  { height: 264, width: 54, tilt: 0 },
  { height: 232, width: 46, tilt: -2 },
  { height: 278, width: 56, tilt: 1 },
];

interface InteractiveLibraryProps {
  products: Product[];
}

export function InteractiveLibrary({ products }: InteractiveLibraryProps) {
  const [activeSlug, setActiveSlug] = useState(products[1]?.slug ?? products[0]?.slug ?? "");
  const activeProduct = useMemo(
    () => products.find((product) => product.slug === activeSlug) ?? products[0],
    [activeSlug, products],
  );

  if (!activeProduct) return null;

  return (
    <section className="library-opening" aria-labelledby="library-opening-title">
      <div className="library-opening__copy">
        <p className="eyebrow">Una biblioteca para entrar sin prisa</p>
        <h1 id="library-opening-title">Cada libro abre una forma de estar en el mundo.</h1>
        <p>
          Pasa por los lomos. No hace falta saber qué buscas: basta con reconocer
          la puerta que hoy te apetece abrir.
        </p>
        <Link className="library-opening__search-link" href="#descubrir">
          ¿Qué te apetece sentir hoy? <span aria-hidden="true">↓</span>
        </Link>
      </div>

      <div className="library-shelf">
        <div className="library-shelf__books" role="group" aria-label="Ocho libros para empezar">
          {products.map((product, index) => {
            const shape = shelfShape[index % shelfShape.length];
            const isActive = product.slug === activeProduct.slug;
            const style = {
              "--book-accent": product.accent,
              "--book-height": `${shape.height}px`,
              "--book-width": `${shape.width}px`,
              "--book-tilt": `${shape.tilt}deg`,
            } as CSSProperties;

            return (
              <button
                className="library-book"
                type="button"
                aria-pressed={isActive}
                aria-label={`Mostrar ${product.title}, ${product.genre}`}
                onMouseEnter={() => setActiveSlug(product.slug)}
                onFocus={() => setActiveSlug(product.slug)}
                onClick={() => setActiveSlug(product.slug)}
                style={style}
                key={product.slug}
              >
                <span className="library-book__title">{product.title}</span>
                <span className="library-book__mark" aria-hidden="true">C</span>
              </button>
            );
          })}
        </div>

        <article className="library-preview" aria-live="polite" style={{ "--book-accent": activeProduct.accent } as CSSProperties}>
          <div className="library-preview__cover">
            <Image
              src={activeProduct.cover}
              alt={`Portada de ${activeProduct.title}`}
              width={180}
              height={270}
              priority
              sizes="(max-width: 760px) 28vw, 120px"
            />
          </div>
          <div className="library-preview__copy">
            <p>{activeProduct.genre} · {activeProduct.mood}</p>
            <h2>{activeProduct.title}</h2>
            <span>{activeProduct.author}</span>
            <Link href={`/libros/${activeProduct.slug}`}>
              Abrir esta puerta <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </div>

      <p className="library-opening__hint">Ocho géneros. Ocho comienzos posibles.</p>
    </section>
  );
}
