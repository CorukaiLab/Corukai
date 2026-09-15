"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AmazonPrice } from "@/components/amazon-price";
import { AffiliateLink } from "@/components/affiliate-link";
import { STANDARD_SHELF_LISTS, useCart } from "@/components/cart/cart-context";
import { trackCoruEvent } from "@/lib/analytics";
import type { Product } from "@/lib/products";

export function CartPage({ products }: { products: Product[] }) {
  const { items, lists, setStatus, toggleCustomList, remove, clear, addList, removeList } = useCart();
  const [activeList, setActiveList] = useState("all");
  const [listMessage, setListMessage] = useState("");
  const customLists = lists.filter((list) => list.isCustom);
  const lines = items.flatMap((item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    return product ? [{ ...item, product }] : [];
  });
  const visibleLines = activeList === "all"
    ? lines
    : lines.filter((line) => line.statusId === activeList || line.customListIds.includes(activeList));

  function handleRemove(slug: string) {
    remove(slug);
    trackCoruEvent("shelf_remove", { product: slug, placement: "cesta" });
  }

  function handleClear() {
    trackCoruEvent("shelf_clear", { items: lines.length, placement: "cesta" });
    clear();
  }

  function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("listName") || "").trim();
    if (!name) return;
    const result = addList(name);
    if (result === "exists") {
      setListMessage("Esa lista ya existe. Puedes marcarla en cualquier libro.");
      return;
    }
    if (result === "created") {
      setListMessage(`Lista «${name}» creada. Ya puedes añadir libros a ella.`);
      form.reset();
    }
  }

  function listCount(listId: string) {
    if (listId === "all") return lines.length;
    return lines.filter((line) => line.statusId === listId || line.customListIds.includes(listId)).length;
  }

  return (
    <main className="cart-page shelf-page">
      <header className="cart-heading shelf-heading">
        <p className="eyebrow">Tu biblioteca, en este dispositivo</p>
        <h1>Mi estante.</h1>
        <p>Ordena posibilidades sin convertirlas en deberes. Nadie más ve estas baldas y no necesitas crear una cuenta.</p>
      </header>

      {lines.length === 0 ? (
        <section className="empty-cart">
          <p className="empty-cart__mark">C</p>
          <h2>Todavía no has dejado ningún libro sobre la mesa.</h2>
          <Link className="button button--coral" href="/tienda">Curiosear la selección</Link>
        </section>
      ) : (
        <>
          <nav className="shelf-filter-groups" aria-label="Filtrar Mi estante">
            <div className="shelf-filter-group">
              <p>Estado de lectura</p>
              <div className="shelf-filter-tabs">
                {[{ id: "all", label: "Todo" }, ...STANDARD_SHELF_LISTS].map((list) => (
                  <button key={list.id} type="button" aria-pressed={activeList === list.id} onClick={() => setActiveList(list.id)}>
                    {list.label}<span>{listCount(list.id)}</span>
                  </button>
                ))}
              </div>
            </div>
            {customLists.length > 0 && (
              <div className="shelf-filter-group shelf-filter-group--custom">
                <p>Tus listas</p>
                <div className="shelf-filter-tabs">
                  {customLists.map((list) => (
                    <button key={list.id} type="button" aria-pressed={activeList === list.id} onClick={() => setActiveList(list.id)}>
                      {list.label}<span>{listCount(list.id)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <section className="shelf-compass" aria-label="Privacidad de Mi estante">
            <span className="shelf-compass__mark" aria-hidden="true">C</span>
            <div><p className="eyebrow">Tu brújula local</p><h2>Guarda caminos, no obligaciones.</h2><p>Cambia un libro de balda cuando cambie tu momento.</p></div>
            <p><strong>Solo en este navegador.</strong><br />La selección no sale de tu dispositivo.</p>
          </section>

          <div className="cart-layout shelf-layout">
            <section className="cart-lines" aria-label="Libros seleccionados">
              {visibleLines.length ? visibleLines.map(({ product, statusId, customListIds }) => (
                <article className="cart-line shelf-line" key={product.slug}>
                  <Link className="shelf-line__cover" href={`/libros/${product.slug}`}>
                    <Image src={product.cover} alt={`Portada de ${product.title}`} width={110} height={165} />
                  </Link>
                  <div className="shelf-line__copy">
                    <p>{product.genre} · {product.mood}</p>
                    <h2><Link href={`/libros/${product.slug}`}>{product.title}</Link></h2>
                    <span>{product.author}</span>
                  </div>
                  <label className="shelf-line__picker">
                    <span>Estado</span>
                    <select
                      value={statusId}
                      onChange={(event) => {
                        setStatus(product.slug, event.target.value);
                        trackCoruEvent("shelf_move", { product: product.slug, list: event.target.value, placement: "cesta" });
                      }}
                    >
                      {STANDARD_SHELF_LISTS.map((list) => <option key={list.id} value={list.id}>{list.label}</option>)}
                    </select>
                  </label>
                  <div className="shelf-line__commerce">
                    <AmazonPrice product={product} compact />
                    {product.affiliateUrl ? (
                      <AffiliateLink href={product.affiliateUrl} slug={product.slug} genre={product.genre} placement="cesta" className="cart-amazon-link">
                        Ver en Amazon <span aria-hidden="true">↗</span>
                      </AffiliateLink>
                    ) : <span className="cart-link-pending">Enlace en preparación</span>}
                  </div>
                  <button type="button" onClick={() => handleRemove(product.slug)}>Quitar</button>
                  <div className="shelf-line__custom-lists">
                    <p>Listas personales <span>Puedes elegir varias</span></p>
                    {customLists.length ? (
                      <div>{customLists.map((list) => (
                        <button key={list.id} type="button" aria-pressed={customListIds.includes(list.id)} onClick={() => {
                          toggleCustomList(product.slug, list.id);
                          trackCoruEvent("shelf_custom_toggle", { product: product.slug, list: list.id, placement: "cesta" });
                        }}>{customListIds.includes(list.id) ? "✓ " : "+ "}{list.label}</button>
                      ))}</div>
                    ) : <span>Crea tu primera lista en el panel de la derecha.</span>}
                  </div>
                </article>
              )) : (
                <div className="shelf-empty-filter"><h2>Esta balda está esperando.</h2><p>Puedes mover aquí cualquier libro desde otra balda o desde su ficha.</p></div>
              )}
            </section>

            <aside className="cart-summary shelf-summary">
              <p className="eyebrow">Crea una balda personalizada</p>
              <h2>Ponle un nombre que te sirva.</h2>
              <p className="shelf-summary__intro">Aparecerá arriba, junto a «Por leer» y «Leyendo». Después podrás mover cualquier libro a ella.</p>
              <form onSubmit={handleCreateList}>
                <label htmlFor="listName">Nombre de la nueva balda</label>
                <div><input id="listName" name="listName" maxLength={36} placeholder="Ej. Regalar a papá" required /><button type="submit">Añadir balda</button></div>
              </form>
              {listMessage && <p className="shelf-summary__message" role="status">{listMessage}</p>}
              {customLists.length > 0 && (
                <div className="custom-shelf-group">
                  <p>Tus baldas creadas</p>
                  <div className="custom-shelf-list">
                  {customLists.map((list) => (
                    <div className="custom-shelf-list__item" key={list.id}>
                      <span>{list.label}<small>{listCount(list.id)} {listCount(list.id) === 1 ? "libro" : "libros"}</small></span>
                      <button type="button" aria-label={`Eliminar la balda ${list.label}`} onClick={() => { removeList(list.id); if (activeList === list.id) setActiveList("all"); }}>×</button>
                    </div>
                  ))}
                  </div>
                </div>
              )}
              <Link className="button button--coral" href="/tienda">Seguir descubriendo <span aria-hidden="true">→</span></Link>
              <button className="clear-cart" type="button" onClick={handleClear}>Vaciar todo Mi estante</button>
              <p className="purchase-note">Amazon gestiona el precio, el pago y el envío. CoruKai solo conserva aquí tu selección.</p>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
