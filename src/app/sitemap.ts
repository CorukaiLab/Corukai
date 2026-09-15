import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getArticles, getSitemapProducts } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getSitemapProducts(), getArticles()]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tienda"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/cuaderno"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/afiliacion"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...products.map((product) => ({
      url: absoluteUrl(`/libros/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/cuaderno/${article.slug}`),
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
