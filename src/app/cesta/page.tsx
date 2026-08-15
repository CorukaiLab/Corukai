"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";
import { AffiliateLink } from "@/components/affiliate-link";
import { ALL_PRODUCTS, formatPrice } from "@/lib/catalog";

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const lines = items.flatMap((item) => {
    const product = ALL_PRODUCTS.find((entry) => entry.slug === item.slug);
    return product ? [{ ...item, product }] : [];
  });
  const total = lines.reduce(
    (sum, line) => sum + line.product.priceCents * line.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <header className="cart-heading">
        <p className="eyebrow">Tu balda provisional</p>
        <h1>Mi estante.</h1>
        <p>Guarda posibilidades aquí. Cuando una encaje, comprobarás su edición, precio y disponibilidad en Amazon.</p>
      </header>

      {lines.length === 0 ? (
        <section className="empty-cart">
          <p className="empty-cart__mark">C</p>
          <h2>Todavía no has dejado ningún libro sobre la mesa.</h2>
          <Link className="button button--coral" href="/tienda">Curiosear la selección</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-lines" aria-label="Libros seleccionados">
            {lines.map(({ product, quantity }) => (
              <article className="cart-line" key={product.slug}>
                <Image
                  src={product.cover}
                  alt={`Portada de ${product.title}`}
                  width={110}
                  height={165}
                />
                <div>
                  <p>{product.genre} · {product.mood}</p>
                  <h2>{product.title}</h2>
                  <span>{product.author}</span>
                </div>
                <strong>{formatPrice(product.priceCents * quantity)}</strong>
                {product.affiliateUrl ? (
                  <AffiliateLink href={product.affiliateUrl} slug={product.slug} genre={product.genre} placement="cesta" className="cart-amazon-link">
                    Ver esta edición en Amazon <span aria-hidden="true">↗</span>
                  </AffiliateLink>
                ) : <span className="cart-link-pending">Enlace en preparación</span>}
                <button type="button" onClick={() => remove(product.slug)}>Quitar</button>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <p className="eyebrow">Cómo comprar</p>
            <div><span>Libros guardados</span><strong>{lines.length}</strong></div>
            <div><span>Referencia estimada</span><strong>{formatPrice(total)}</strong></div>
            <hr />
            <p className="cart-summary__explanation">Amazon gestiona la cesta final, el precio vigente, el pago y el envío. Abre cada libro y añádelo allí; CoruKai nunca recibe tus datos bancarios.</p>
            <Link className="button button--coral" href="/tienda">Seguir descubriendo <span aria-hidden="true">→</span></Link>
            <button className="clear-cart" type="button" onClick={clear}>Vaciar selección</button>
            <p className="purchase-note">Los precios mostrados son orientativos hasta consultar Amazon.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
