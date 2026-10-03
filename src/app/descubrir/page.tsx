import type { Metadata } from "next";
import { DiscoveryPaths } from "@/components/discovery-paths";
import { createSocialMetadata } from "@/lib/metadata";
import { getAllProducts } from "@/sanity/lib/queries";
import "./discovery-paths.css";

export const metadata: Metadata = {
  title: "Encuentra un libro a tu manera",
  description: "Empieza por tu momento de hoy o ve directo al libro que tienes en mente. Dos caminos para descubrir sin prisa.",
  alternates: { canonical: "/descubrir" },
  ...createSocialMetadata({
    title: "Encuentra un libro a tu manera · CoruKai",
    description: "Empieza por tu momento de hoy o ve directo al libro que tienes en mente. Dos caminos para descubrir sin prisa.",
    path: "/descubrir",
  }),
};

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ camino?: string }> }) {
  const [{ camino }, products] = await Promise.all([searchParams, getAllProducts()]);
  const books = products.map((product) => ({
    slug: product.slug,
    title: product.title,
    author: product.author,
    genre: product.genre,
    mood: product.mood,
    pace: product.pace,
    readingTime: product.readingTime,
    pages: product.pages,
    entry: product.entry,
    isbn: product.isbn,
    cover: product.cover,
    hook: product.hook,
    idealMoment: product.idealMoment,
  }));

  return <DiscoveryPaths books={books} initialPath={camino === "guiado" || camino === "directo" ? camino : "entrada"} />;
}
