import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import type { Product } from "@/lib/products";
import { attachAmazonOffers } from "@/lib/amazon/creators-api";
import { correctProductLabels } from "@/lib/catalog-copy";

const productFields = groq`
  "slug": slug.current,
  title,
  "author": author->name,
  "genre": genre->title,
  "mood": primaryEmotion->title,
  priceCents,
  amazonAsin,
  "cover": coverImage.asset->url,
  "coverAlt": coverImage.alt,
  "accent": coalesce(genre->color, "#17182B"),
  "hook": vibe,
  "description": shortDescription,
  forWhom,
  notForWhom,
  idealMoment,
  format,
  "year": publicationYear,
  readingTime,
  "pace": readingPace,
  "entry": storyEntry,
  pages,
  creativeSpark,
  coruNote,
  isbn,
  seoTitle,
  seoDescription,
  "affiliateUrl": affiliateLink,
  "isCoruPick": coalesce(isCoruPick, false)
`;

const activeProductFilter = groq`
  _type == "book" &&
  stockStatus in ["available", "affiliate"] &&
  defined(slug.current) &&
  defined(author->name) &&
  defined(genre->title) &&
  defined(primaryEmotion->title) &&
  defined(coverImage.asset) &&
  defined(priceCents)
`;

export async function getAllProducts() {
  const products = await client.fetch<Product[]>(
    groq`*[${activeProductFilter}] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
  return attachAmazonOffers(products.map(correctProductLabels));
}

export interface SitemapProduct {
  slug: string;
  updatedAt: string;
  cover?: string;
}

export interface ArticleSummary {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
}

export interface ArticleBlock {
  _key: string;
  _type: "block";
  style?: "normal" | "h2";
  children?: Array<{ _key: string; _type: "span"; text: string }>;
}

export interface ArticleDetail extends ArticleSummary {
  body: ArticleBlock[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroImageCaption?: string;
  heroImageWidth?: number;
  heroImageHeight?: number;
  seoTitle?: string;
  seoDescription?: string;
  relatedBooks: Product[];
}

export async function getArticles() {
  return client.fetch<ArticleSummary[]>(
    groq`*[_type == "article" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
      title, "slug": slug.current, excerpt, category, publishedAt, "updatedAt": _updatedAt
    }`,
    {},
    { next: { revalidate: 300, tags: ["articles"] } },
  );
}

export async function getArticleBySlug(slug: string) {
  const article = await client.fetch<ArticleDetail | null>(
    groq`*[_type == "article" && slug.current == $slug][0] {
      title, "slug": slug.current, excerpt, category, publishedAt, "updatedAt": _updatedAt,
      body, seoTitle, seoDescription,
      "heroImageUrl": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      "heroImageCaption": heroImage.caption,
      "heroImageWidth": heroImage.asset->metadata.dimensions.width,
      "heroImageHeight": heroImage.asset->metadata.dimensions.height,
      "relatedBooks": relatedBooks[]->{ ${productFields} }
    }`,
    { slug },
    { next: { revalidate: 300, tags: ["articles", `article:${slug}`] } },
  );
  if (!article) return null;
  return { ...article, relatedBooks: await attachAmazonOffers((article.relatedBooks || []).map(correctProductLabels)) };
}

export async function getRelatedArticles(slug: string, category: string) {
  const articles = await client.fetch<ArticleSummary[]>(
    groq`*[
      _type == "article" &&
      defined(slug.current) &&
      defined(publishedAt) &&
      slug.current != $slug
    ] | order(publishedAt desc)[0...8] {
      title, "slug": slug.current, excerpt, category, publishedAt, "updatedAt": _updatedAt
    }`,
    { slug, category },
    { next: { revalidate: 300, tags: ["articles"] } },
  );
  return articles
    .sort((left, right) => Number(right.category === category) - Number(left.category === category))
    .slice(0, 3);
}

export async function getArticleSlugs() {
  return client.fetch<string[]>(
    groq`*[_type == "article" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 300, tags: ["articles"] } },
  );
}

export async function getSitemapProducts() {
  return client.fetch<SitemapProduct[]>(
    groq`*[${activeProductFilter}] | order(catalogOrder asc) {
      "slug": slug.current,
      "updatedAt": _updatedAt,
      "cover": coverImage.asset->url
    }`,
    {},
    { next: { revalidate: 3600, tags: ["products"] } },
  );
}

export async function getCatalogProducts() {
  const products = await client.fetch<Product[]>(
    groq`*[${activeProductFilter} && coalesce(isCoruPick, false) == false] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
  return attachAmazonOffers(products.map(correctProductLabels));
}

export async function getCoruPicks() {
  const products = await client.fetch<Product[]>(
    groq`*[${activeProductFilter} && isCoruPick == true] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
  return attachAmazonOffers(products.map(correctProductLabels));
}

export async function getProductBySlug(slug: string) {
  const product = await client.fetch<Product | null>(
    groq`*[${activeProductFilter} && slug.current == $slug][0] { ${productFields} }`,
    { slug },
    { next: { revalidate: 60, tags: ["products", `product:${slug}`] } },
  );
  if (!product) return null;
  return (await attachAmazonOffers([correctProductLabels(product)]))[0];
}
