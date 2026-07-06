import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export interface BookCardData {
  title: string;
  slug: string;
  author: string;
  genre: string;
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

const bookFields = groq`
  title,
  "slug": slug.current,
  "author": author->name,
  "genre": genre->title,
  "genreColor": genre->color,
  "primaryEmotion": primaryEmotion->title,
  vibe,
  shortDescription,
  idealMoment
`;

export async function getFeaturedBooks() {
  return client.fetch<BookCardData[]>(
    groq`*[_type == "book" && isFeatured == true] | order(_createdAt asc) {
      ${bookFields}
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getBooks() {
  return client.fetch<BookCardData[]>(
    groq`*[_type == "book"] | order(genre->title asc, title asc) {
      ${bookFields}
    }`,
    {},
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

export async function getCollections() {
  return client.fetch<CollectionCardData[]>(
    groq`*[_type == "collection"] | order(title asc) {
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
