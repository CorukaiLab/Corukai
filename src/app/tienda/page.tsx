import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { GENRES, MOODS, PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Descubrir libros",
  description: "Explora la selección beta de CoruKai por emoción, género o autor.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mood?: string; genre?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim().toLocaleLowerCase("es") || "";
  const filtered = PRODUCTS.filter((product) => {
    const matchesQuery =
      !query ||
      [product.title, product.author, product.genre, product.mood, product.hook]
        .join(" ")
        .toLocaleLowerCase("es")
        .includes(query);
    const matchesMood = !params.mood || product.mood === params.mood;
    const matchesGenre = !params.genre || product.genre === params.genre;
    return matchesQuery && matchesMood && matchesGenre;
  });

  return (
    <main className="shop-page">
      <section className="shop-intro">
        <p className="eyebrow">Selección beta · 12 historias</p>
        <h1>No busques el mejor libro.<br />Busca el que encaja ahora.</h1>
        <p>
          Una selección corta para probar una forma distinta de comprar libros:
          menos ruido, más contexto.
        </p>
      </section>

      <form className="shop-toolbar" action="/tienda">
        <label className="search-field">
          <span>Buscar</span>
          <input name="q" defaultValue={params.q} placeholder="Título, autor, sensación…" />
        </label>
        <label>
          <span>Emoción</span>
          <select name="mood" defaultValue={params.mood || ""}>
            <option value="">Todas</option>
            {MOODS.map((mood) => <option key={mood}>{mood}</option>)}
          </select>
        </label>
        <label>
          <span>Género</span>
          <select name="genre" defaultValue={params.genre || ""}>
            <option value="">Todos</option>
            {GENRES.map((genre) => <option key={genre}>{genre}</option>)}
          </select>
        </label>
        <button type="submit">Aplicar <span aria-hidden="true">→</span></button>
        {(params.q || params.mood || params.genre) && (
          <Link href="/tienda">Limpiar</Link>
        )}
      </form>

      <div className="shop-status" aria-live="polite">
        <p>{filtered.length} {filtered.length === 1 ? "historia encontrada" : "historias encontradas"}</p>
        <p>Precios de muestra para validar la experiencia beta.</p>
      </div>

      {filtered.length > 0 ? (
        <section className="catalog-grid" aria-label="Catálogo de libros">
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 3} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <p className="eyebrow">Nada por aquí todavía</p>
          <h2>Quizá la búsqueda necesita menos palabras.</h2>
          <Link className="button button--ink" href="/tienda">Volver a toda la selección</Link>
        </section>
      )}
    </main>
  );
}

