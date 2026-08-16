import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}) {
  const idealMoment = product.idealMoment.replace(/^Cuando\s+/u, "");

  return (
    <article
      className={`product-card${compact ? " product-card--compact" : ""}`}
      style={{ "--accent": product.accent } as React.CSSProperties}
    >
      <Link className="product-cover" href={`/libros/${product.slug}`}>
        <span className="product-object-index" aria-hidden="true">{product.year}</span>
        <span className="product-object-seal" aria-hidden="true">C</span>
        <Image
          src={product.cover}
          alt={`Portada de ${product.title}`}
          width={360}
          height={540}
          priority={priority}
          sizes={compact
            ? "(max-width: 520px) 44vw, (max-width: 900px) 40vw, (max-width: 1200px) 24vw, 18vw"
            : "(max-width: 640px) 72vw, (max-width: 1100px) 34vw, 22vw"}
        />
        <span className="product-cover__action">Entrar en la historia</span>
        <span className="product-paper-slip">
          <small>Para cuando…</small>
          <strong>{idealMoment}</strong>
          <b>Ver ficha <span aria-hidden="true">→</span></b>
        </span>
      </Link>
      <div className="product-copy">
        <p className="product-kicker">
          {product.genre} · {product.mood}
        </p>
        <Link href={`/libros/${product.slug}`}>
          <h2>{product.title}</h2>
        </Link>
        <p className="product-author">{product.author}</p>
        <p className="product-hook">{product.hook}</p>
        <p className="product-reading-signals">
          <span>{product.readingTime}</span>
          <span>{product.pace}</span>
        </p>
        <div className="product-actions">
          <strong>{formatPrice(product.priceCents)}</strong>
          <AddToCartButton slug={product.slug} compact />
        </div>
      </div>
    </article>
  );
}
