import { groq } from "next-sanity";
import type { QueryParams } from "@sanity/client";
import { client } from "@/sanity/lib/client";
import type { Product } from "@/lib/products";
import { attachAmazonOffers } from "@/lib/amazon/creators-api";

export interface BookCardData {
  title: string;
  slug: string;
  author: string;
  genre: string;
  genreSlug: string;
  genreColor?: string;
  coverUrl?: string;
  coverAlt?: string;
  ambientUrl?: string;
  ambientAlt?: string;
  primaryEmotion?: string;
  vibe?: string;
  shortDescription?: string;
  idealMoment?: string;
  coruNote?: string;
  readingTime?: string;
  readingPace?: string;
  storyEntry?: string;
  creativeSpark?: string;
  isbn?: string;
  affiliateLink?: string;
}

export interface BookDetailData extends BookCardData {
  originalTitle?: string;
  publicationYear?: number;
  authorCountry?: string;
  authorBirthYear?: number;
  authorDeathYear?: number;
  whyRead?: string;
  forWhom?: string;
  notForWhom?: string;
  curiosity?: string;
  music?: string;
  relatedMovies?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface CollectionCardData {
  title: string;
  slug: string;
  description?: string;
  primaryEmotion?: string;
  coverUrl?: string;
  bookCount: number;
}

export interface GenreFilterData {
  title: string;
  slug: string;
  color?: string;
}

export interface CollectionDetailData extends CollectionCardData {
  books: BookCardData[];
  seoTitle?: string;
  seoDescription?: string;
}

const bookFields = groq`
  title,
  "slug": slug.current,
  "author": coalesce(author->name, "Autor pendiente"),
  "genre": coalesce(genre->title, "Genero pendiente"),
  "genreSlug": genre->slug.current,
  "genreColor": genre->color,
  "coverUrl": coverImage.asset->url,
  "coverAlt": coverImage.alt,
  "ambientUrl": ambientImage.asset->url,
  "ambientAlt": ambientImage.alt,
  "primaryEmotion": primaryEmotion->title,
  vibe,
  shortDescription,
  idealMoment,
  coruNote,
  readingTime,
  readingPace,
  storyEntry,
  creativeSpark,
  isbn,
  affiliateLink
`;

const productFields = groq`
  "slug": slug.current,
  title,
  "author": author->name,
  "genre": genre->title,
  "mood": primaryEmotion->title,
  priceCents,
  amazonAsin,
  "cover": coverImage.asset->url,
  "accent": coalesce(genre->color, "#17182B"),
  "hook": vibe,
  "description": shortDescription,
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
  return attachAmazonOffers(products);
}

export interface SitemapProduct {
  slug: string;
  updatedAt: string;
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
      "relatedBooks": relatedBooks[]->{ ${productFields} }
    }`,
    { slug },
    { next: { revalidate: 300, tags: ["articles", `article:${slug}`] } },
  );
  if (!article) return null;
  return { ...article, relatedBooks: await attachAmazonOffers(article.relatedBooks || []) };
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
      "updatedAt": _updatedAt
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
  return attachAmazonOffers(products);
}

export async function getCoruPicks() {
  const products = await client.fetch<Product[]>(
    groq`*[${activeProductFilter} && isCoruPick == true] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
  return attachAmazonOffers(products);
}

export async function getProductBySlug(slug: string) {
  const product = await client.fetch<Product | null>(
    groq`*[${activeProductFilter} && slug.current == $slug][0] { ${productFields} }`,
    { slug },
    { next: { revalidate: 60, tags: ["products", `product:${slug}`] } },
  );
  if (!product) return null;
  return (await attachAmazonOffers([product]))[0];
}

export async function getFeaturedBooks() {
  return client.fetch<BookCardData[]>(
    groq`*[_type == "book" && isFeatured == true && stockStatus != "retired" && defined(slug.current)] | order(_createdAt asc) {
      ${bookFields}
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

interface GetBooksOptions {
  genreSlug?: string;
  query?: string;
}

export async function getBooks(options: GetBooksOptions = {}) {
  const normalizedQuery = options.query?.trim();
  const params: QueryParams = {
    genreSlug: options.genreSlug || "",
    searchTerm: normalizedQuery ? `${normalizedQuery}*` : "",
  };

  return client.fetch<BookCardData[]>(
    groq`*[
      _type == "book" &&
      stockStatus != "retired" &&
      defined(slug.current) &&
      ($genreSlug == "" || genre->slug.current == $genreSlug) &&
      ($searchTerm == "" || title match $searchTerm || author->name match $searchTerm || genre->title match $searchTerm || vibe match $searchTerm || shortDescription match $searchTerm)
    ] | order(genre->title asc, title asc) {
      ${bookFields}
    }`,
    params,
    { next: { revalidate: 60 } },
  );
}

export async function getBookBySlug(slug: string) {
  return client.fetch<BookDetailData | null>(
    groq`*[_type == "book" && stockStatus != "retired" && slug.current == $slug][0] {
      ${bookFields},
      originalTitle,
      publicationYear,
      "authorCountry": author->country,
      "authorBirthYear": author->birthYear,
      "authorDeathYear": author->deathYear,
      whyRead,
      forWhom,
      notForWhom,
      curiosity,
      music,
      relatedMovies,
      seoTitle,
      seoDescription
    }`,
    { slug },
    { next: { revalidate: 60 } },
  );
}

export async function getBookSlugs() {
  return client.fetch<string[]>(
    groq`*[_type == "book" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getGenres() {
  return client.fetch<GenreFilterData[]>(
    groq`*[_type == "genre" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      color
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getCollections() {
  return client.fetch<CollectionCardData[]>(
    groq`*[_type == "collection" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      description,
      "primaryEmotion": primaryEmotion->title,
      "coverUrl": coverImage.asset->url,
      "bookCount": count(books)
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getCollectionSlugs() {
  return client.fetch<string[]>(
    groq`*[_type == "collection" && defined(slug.current)].slug.current`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getCollectionBySlug(slug: string) {
  return client.fetch<CollectionDetailData | null>(
    groq`*[_type == "collection" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      description,
      "primaryEmotion": primaryEmotion->title,
      "bookCount": count(books),
      seoTitle,
      seoDescription,
      "books": books[]->{
        ${bookFields}
      }
    }`,
    { slug },
    { next: { revalidate: 60 } },
  );
}
