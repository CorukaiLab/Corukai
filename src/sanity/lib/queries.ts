import { groq } from "next-sanity";
import type { QueryParams } from "@sanity/client";
import { client } from "@/sanity/lib/client";
import type { Product } from "@/lib/products";

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
  return client.fetch<Product[]>(
    groq`*[${activeProductFilter}] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
}

export async function getCatalogProducts() {
  return client.fetch<Product[]>(
    groq`*[${activeProductFilter} && coalesce(isCoruPick, false) == false] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
}

export async function getCoruPicks() {
  return client.fetch<Product[]>(
    groq`*[${activeProductFilter} && isCoruPick == true] | order(catalogOrder asc) { ${productFields} }`,
    {},
    { next: { revalidate: 60, tags: ["products"] } },
  );
}

export async function getProductBySlug(slug: string) {
  return client.fetch<Product | null>(
    groq`*[${activeProductFilter} && slug.current == $slug][0] { ${productFields} }`,
    { slug },
    { next: { revalidate: 60, tags: ["products", `product:${slug}`] } },
  );
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
