import Image from "next/image";
import { TrackedBookLink } from "@/components/tracked-book-link";
import type { Product } from "@/lib/products";

export function CoruShelf({ products }: { products: Product[] }) {
  return (
    <section className="coru-shelf" id="balda-coru" aria-labelledby="coru-shelf-title">
      <header className="coru-shelf__heading">
        <div className="coru-shelf__portrait" aria-hidden="true">C</div>
        <div>
          <p className="eyebrow">La balda de Coru · Selección temporal</p>
          <h2 id="coru-shelf-title">Tres libros fuera de los 24.</h2>
        </div>
        <p>Durante unas semanas, Coru deja tres hallazgos junto al catálogo fijo. Después llegarán otros.</p>
      </header>
      <div className="coru-shelf__books">
        {products.map((product, index) => (
          <TrackedBookLink
            className="coru-shelf__book"
            slug={product.slug}
            genre={product.genre}
            placement="coru_shelf"
            key={product.slug}
            style={{ "--accent": product.accent, "--shelf-index": index } as React.CSSProperties}
          >
            <span className="coru-shelf__stamp">Recomendación de Coru</span>
            <Image
              src={product.cover}
              alt={`Portada de ${product.title}`}
              width={280}
              height={420}
              sizes="(max-width: 720px) 58vw, 24vw"
            />
            <span className="coru-shelf__label">
              <b>{product.title}</b>
              <small>{product.genre} · {product.mood} · Temporal</small>
            </span>
          </TrackedBookLink>
        ))}
      </div>
      <div className="coru-shelf__plank" aria-hidden="true" />
    </section>
  );
}
