"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { formatPrice, PRODUCTS } from "@/lib/catalog";

export default function CartPage() {
  const { items, remove, setQuantity, clear } = useCart();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const lines = items.flatMap((item) => {
    const product = PRODUCTS.find((entry) => entry.slug === item.slug);
    return product ? [{ ...item, product }] : [];
  });
  const total = lines.reduce(
    (sum, line) => sum + line.product.priceCents * line.quantity,
    0,
  );

  async function checkout() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !data.url) {
        setMessage(data.message || "No se pudo iniciar el pago.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setMessage("No se pudo conectar con el pago. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cart-page">
      <header className="cart-heading">
        <p className="eyebrow">Tu mesa de lectura</p>
        <h1>Mi selección.</h1>
        <p>Puedes cambiar de idea. Aquí no hay temporizadores ni urgencia.</p>
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
                <label>
                  <span>Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={quantity}
                    onChange={(event) => setQuantity(product.slug, Number(event.target.value))}
                  />
                </label>
                <strong>{formatPrice(product.priceCents * quantity)}</strong>
                <button type="button" onClick={() => remove(product.slug)}>Quitar</button>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <p className="eyebrow">Resumen</p>
            <div><span>Libros</span><strong>{formatPrice(total)}</strong></div>
            <div><span>Envío</span><strong>Se calcula después</strong></div>
            <hr />
            <div className="cart-total"><span>Total provisional</span><strong>{formatPrice(total)}</strong></div>
            <button className="button button--coral" type="button" disabled={loading} onClick={checkout}>
              {loading ? "Preparando…" : "Continuar al pago"} <span aria-hidden="true">→</span>
            </button>
            {message && <p className="checkout-message" role="status">{message}</p>}
            <button className="clear-cart" type="button" onClick={clear}>Vaciar selección</button>
            <p className="purchase-note">Pago seguro mediante Stripe cuando la cuenta comercial esté configurada.</p>
          </aside>
        </div>
      )}
    </main>
  );
}

