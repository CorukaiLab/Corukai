import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { createSocialMetadata } from "@/lib/metadata";
import { getCatalogProducts } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Biblioteca de libros por género y momento",
  description: "Explora la selección de CoruKai por género, sensación, tiempo y ritmo. Encuentra una lectura para tu momento, sin rankings ni prisas.",
  alternates: { canonical: "/tienda" },
  ...createSocialMetadata({
    title: "Biblioteca de libros por género y momento · CoruKai",
    description: "Explora la selección de CoruKai por género, sensación, tiempo y ritmo. Encuentra una lectura para tu momento, sin rankings ni prisas.",
    path: "/tienda",
  }),
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; mood?: string; genre?: string; time?: string; pace?: string; entry?: string }> }) {
  const params = await searchParams;
  const products = await getCatalogProducts();
  return (
    <main className="shop-page">
      <section className="shop-intro">
        <p className="eyebrow">{products.length} historias · {new Set(products.map((product) => product.genre)).size} géneros · ninguna obligación</p>
        <h1>Busca menos.<br />Encuentra mejor.</h1>
        <p>Combina una sensación, el tiempo que tienes y lo que quieres que haga la historia. El género es una pista, no una frontera.</p>
      </section>
      <CatalogExplorer products={products} initial={params} />
    </main>
  );
}
