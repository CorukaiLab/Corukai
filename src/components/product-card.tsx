import Image from "next/image";
import { AmazonPrice } from "@/components/amazon-price";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { TrackedBookLink } from "@/components/tracked-book-link";
import type { Product } from "@/lib/products";

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
      <TrackedBookLink className="product-cover" slug={product.slug} genre={product.genre} placement="catalog_cover">
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
      </TrackedBookLink>
      <div className="product-copy">
        <p className="product-kicker">
          {product.genre} · {product.mood}
        </p>
        <TrackedBookLink slug={product.slug} genre={product.genre} placement="catalog_title">
          <h2>{product.title}</h2>
        </TrackedBookLink>
        <p className="product-author">{product.author}</p>
        <p className="product-hook">{product.hook}</p>
        <p className="product-reading-signals">
          <span>{product.readingTime}</span>
          <span>{product.pace}</span>
        </p>
        <div className="product-actions">
          <AmazonPrice product={product} compact />
          <AddToCartButton slug={product.slug} placement="catalogo" compact />
        </div>
      </div>
    </article>
  );
}
