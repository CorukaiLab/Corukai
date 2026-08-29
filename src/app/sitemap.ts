import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getSitemapProducts } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapProducts();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tienda"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/afiliacion"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/aviso-legal"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacidad"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/cookies"), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...products.map((product) => ({
      url: absoluteUrl(`/libros/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
