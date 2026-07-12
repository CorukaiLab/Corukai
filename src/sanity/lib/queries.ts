import { groq } from "next-sanity";
import type { QueryParams } from "@sanity/client";
import { client } from "@/sanity/lib/client";

export interface BookCardData {
  title: string;
  slug: string;
  author: string;
  genre: string;
  genreSlug: string;
  genreColor?: string;
  primaryEmotion?: string;
  vibe?: string;
  shortDescription?: string;
  idealMoment?: string;
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
  "primaryEmotion": primaryEmotion->title,
  vibe,
  shortDescription,
  idealMoment
`;

export async function getFeaturedBooks() {
  return client.fetch<BookCardData[]>(
    groq`*[_type == "book" && isFeatured == true && defined(slug.current)] | order(_createdAt asc) {
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
    groq`*[_type == "book" && slug.current == $slug][0] {
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
