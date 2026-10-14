import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialBook } from "@/components/editorial-book";
import { createSocialMetadata } from "@/lib/metadata";
import { getProductCoverAlt } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import { getAllProducts, getCatalogProducts, getProductBySlug } from "@/sanity/lib/queries";
import "../../editorial-book.css";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const seoTitle = product.seoTitle?.replace(/\s*[|·]\s*CoruKai\s*$/i, "").trim() || product.title;
  return {
    title: seoTitle,
    description: product.seoDescription || product.hook,
    alternates: { canonical: `/libros/${product.slug}` },
    ...createSocialMetadata({
      title: `${product.title} · ${product.author}`,
      description: product.seoDescription || product.hook,
      path: `/libros/${product.slug}`,
      image: { url: product.cover, alt: getProductCoverAlt(product) },
      type: "book",
    }),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products] = await Promise.all([getProductBySlug(slug), getCatalogProducts()]);
  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug)
    .map((item) => ({
      item,
      affinity: (item.genre === product.genre ? 3 : 0) +
        (item.mood === product.mood ? 2 : 0) +
        (item.entry === product.entry ? 1 : 0),
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 4)
    .map(({ item }) => item);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": absoluteUrl(`/libros/${product.slug}#book`),
    url: absoluteUrl(`/libros/${product.slug}`),
    name: product.title,
    author: { "@type": "Person", name: product.author },
    genre: product.genre,
    datePublished: String(product.year),
    image: { "@type": "ImageObject", url: product.cover, caption: getProductCoverAlt(product) },
    description: product.seoDescription || product.hook,
    inLanguage: "es",
    ...(product.isbn ? { isbn: product.isbn } : {}),
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <EditorialBook product={product} related={related} />
  </>;
}
