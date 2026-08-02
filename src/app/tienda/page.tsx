import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Descubrir libros por cómo quieres sentirte",
  description: "Explora 24 libros seleccionados por emoción, tiempo, ritmo, género e intención de lectura.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; mood?: string; genre?: string; time?: string; pace?: string; entry?: string }> }) {
  const params = await searchParams;
  return (
    <main className="shop-page">
      <section className="shop-intro">
        <p className="eyebrow">24 historias · 8 géneros · ninguna obligación</p>
        <h1>Busca menos.<br />Encuentra mejor.</h1>
        <p>Combina una sensación, el tiempo que tienes y lo que quieres que haga la historia. El género es una pista, no una frontera.</p>
      </section>
      <CatalogExplorer products={PRODUCTS} initial={params} />
    </main>
  );
}
