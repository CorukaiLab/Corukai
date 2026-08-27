import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { ALL_PRODUCTS, PRODUCTS } from "../src/lib/catalog.ts";

const client = getCliClient({ apiVersion: "2026-07-04" });
const root = process.cwd();

const retiredSlugs = [
  "abisinio",
  "vendaval-jamaica",
  "lud-in-the-mist",
  "espada-rota",
  "final-affaire",
  "libreria-livingstone",
  "cripta-embrujada",
  "promesa",
  "infraordinario",
  "mas-que-humano",
  "juicio-final",
  "puente-drina",
  "hija-capitan",
  "gran-dios-pan",
  "casa-confin",
  "cita-rama",
  "contra-interpretacion",
  "misterio-cuarto-amarillo",
  "mundo-perdido",
  "talento-ripley",
  "extranos-tren",
  "casa-confin-tierra",
  "edad-inocencia",
  "hija-tiempo",
  "piedra-lunar",
  "puerta-estrecha",
  "39-escalones",
  "mercaderes-espacio",
  "siempre-castillo",
  "habitacion-propia",
];

const retiredBookIds = [
  ...retiredSlugs.map((slug) => `book-${slug}`),
  "book-apologia-ociosidad",
];

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getReferenceIds(book) {
  return {
    authorId: `author-${slugify(book.author)}`,
    genreId: `genre-${slugify(book.genre)}`,
    emotionId: `emotion-${slugify(book.mood)}`,
  };
}

async function ensureReferenceDocuments(book) {
  const { authorId, genreId, emotionId } = getReferenceIds(book);
  await Promise.all([
    client.createIfNotExists({
      _id: authorId,
      _type: "author",
      name: book.author,
      slug: { _type: "slug", current: slugify(book.author) },
    }),
    client.createIfNotExists({
      _id: genreId,
      _type: "genre",
      title: book.genre,
      slug: { _type: "slug", current: slugify(book.genre) },
      color: book.accent,
    }),
    client.createIfNotExists({
      _id: emotionId,
      _type: "emotion",
      title: book.mood,
      slug: { _type: "slug", current: slugify(book.mood) },
    }),
  ]);
  return { authorId, genreId, emotionId };
}

async function ensureCover(book, existing) {
  const currentRef = existing?.coverImage?.asset?._ref;
  if (currentRef) return currentRef;

  const coverName = path.basename(book.cover);
  const coverPath = path.join(root, "public", "assets", "covers", coverName);
  const asset = await client.assets.upload("image", createReadStream(coverPath), {
    filename: coverName,
    title: `Portada de ${book.title}`,
  });
  return asset._id;
}

for (const [index, book] of ALL_PRODUCTS.entries()) {
  const { authorId, genreId, emotionId } = await ensureReferenceDocuments(book);
  const bookId = `book-${book.slug}`;
  const existing = await client.getDocument(bookId);
  const coverRef = await ensureCover(book, existing);

  await client.createIfNotExists({
    _id: bookId,
    _type: "book",
    title: book.title,
    slug: { _type: "slug", current: book.slug },
    author: { _type: "reference", _ref: authorId },
    genre: { _type: "reference", _ref: genreId },
  });

  await client
    .patch(bookId)
    .set({
      title: book.title,
      slug: { _type: "slug", current: book.slug },
      author: { _type: "reference", _ref: authorId },
      genre: { _type: "reference", _ref: genreId },
      primaryEmotion: { _type: "reference", _ref: emotionId },
      emotions: [{ _key: emotionId, _type: "reference", _ref: emotionId }],
      coverImage: {
        _type: "image",
        asset: { _type: "reference", _ref: coverRef },
        alt: `Portada de ${book.title}`,
      },
      publicationYear: book.year,
      ...(book.isbn ? { isbn: book.isbn } : {}),
      ...(book.pages ? { pages: book.pages } : {}),
      priceCents: book.priceCents,
      format: book.format,
      stockStatus: "affiliate",
      vibe: book.hook,
      shortDescription: book.description,
      whyRead: book.description,
      idealMoment: book.idealMoment,
      coruNote: book.coruNote,
      readingTime: book.readingTime,
      readingPace: book.pace,
      storyEntry: book.entry,
      creativeSpark: book.creativeSpark,
      affiliateLink: book.affiliateUrl,
      isFeatured: !book.isCoruPick && index < 8,
      isCoruPick: book.isCoruPick,
      catalogOrder: index,
      seoTitle: `${book.title} | CoruKai`,
      seoDescription: `${book.hook} Descubre si encaja con tu momento lector en CoruKai.`,
    })
    .unset([
      ...(book.isbn ? [] : ["isbn"]),
      ...(book.pages ? [] : ["pages"]),
    ])
    .commit({ autoGenerateArrayKeys: true });

  console.log(`Synced ${index + 1}/${ALL_PRODUCTS.length}: ${book.title}`);
}

for (const bookId of retiredBookIds) {
  const existing = await client.getDocument(bookId);
  if (!existing) continue;
  await client.patch(bookId).set({ stockStatus: "retired", isFeatured: false }).commit();
  console.log(`Retired: ${bookId}`);
}

console.log(`Done. ${PRODUCTS.length} catalogue books and ${ALL_PRODUCTS.length - PRODUCTS.length} Coru picks synchronized.`);
