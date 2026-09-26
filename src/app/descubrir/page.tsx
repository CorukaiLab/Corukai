import type { Metadata } from "next";
import { DiscoveryPaths } from "@/components/discovery-paths";
import { getCatalogProducts } from "@/sanity/lib/queries";
import "./discovery-paths.css";

export const metadata: Metadata = {
  title: "Encuentra un libro a tu manera",
  description: "Déjate guiar por cómo quieres sentirte o busca directamente un libro, autor o género. Dos caminos para descubrir sin prisa.",
  alternates: { canonical: "/descubrir" },
  openGraph: { url: "/descubrir" },
};

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ camino?: string }> }) {
  const [{ camino }, products] = await Promise.all([searchParams, getCatalogProducts()]);
  const books = products.map((product) => ({
    slug: product.slug,
    title: product.title,
    author: product.author,
    genre: product.genre,
    mood: product.mood,
    pace: product.pace,
    entry: product.entry,
    isbn: product.isbn,
    cover: product.cover,
    hook: product.hook,
    idealMoment: product.idealMoment,
  }));

  return <DiscoveryPaths books={books} initialPath={camino === "guiado" || camino === "directo" ? camino : "entrada"} />;
}
