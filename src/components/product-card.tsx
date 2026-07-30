import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice, type Product } from "@/lib/catalog";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="product-card" style={{ "--accent": product.accent } as React.CSSProperties}>
      <Link className="product-cover" href={`/libros/${product.slug}`}>
        <Image
          src={product.cover}
          alt={`Portada de ${product.title}`}
          width={360}
          height={540}
          priority={priority}
          sizes="(max-width: 640px) 72vw, (max-width: 1100px) 34vw, 22vw"
        />
        <span>Entrar en la historia</span>
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
        <div className="product-actions">
          <strong>{formatPrice(product.priceCents)}</strong>
          <AddToCartButton slug={product.slug} compact />
        </div>
      </div>
    </article>
  );
}

