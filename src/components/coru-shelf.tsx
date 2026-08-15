import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

export function CoruShelf({ products }: { products: Product[] }) {
  return (
    <section className="coru-shelf" aria-labelledby="coru-shelf-title">
      <header className="coru-shelf__heading">
        <div className="coru-shelf__portrait" aria-hidden="true">C</div>
        <div>
          <p className="eyebrow">La balda de Coru</p>
          <h2 id="coru-shelf-title">Tres libros que pondría hoy en tus manos.</h2>
        </div>
        <p>No son los tres mejores. Son tres puertas distintas para volver a disfrutar escogiendo.</p>
      </header>
      <div className="coru-shelf__books">
        {products.map((product, index) => (
          <Link
            className="coru-shelf__book"
            href={`/libros/${product.slug}`}
            key={product.slug}
            style={{ "--accent": product.accent, "--shelf-index": index } as React.CSSProperties}
          >
            <span className="coru-shelf__number">0{index + 1}</span>
            <Image
              src={product.cover}
              alt={`Portada de ${product.title}`}
              width={280}
              height={420}
              sizes="(max-width: 720px) 58vw, 24vw"
            />
            <span className="coru-shelf__label">
              <b>{product.title}</b>
              <small>{product.genre} · {product.mood}</small>
            </span>
          </Link>
        ))}
      </div>
      <div className="coru-shelf__plank" aria-hidden="true" />
    </section>
  );
}
