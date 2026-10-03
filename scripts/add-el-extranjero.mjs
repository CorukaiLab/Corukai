import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

// One-time, revision-aware catalogue migration. Dry run unless --write is given.
const client = getCliClient({ apiVersion: "2026-07-04" }).withConfig({ useCdn: false });
const write = process.argv.includes("--write");
const books = await client.fetch('*[_type == "book"]');
if (books.some((book) => book.slug?.current === "el-extranjero" || book.isbn === "9788466356138")) {
  throw new Error("El extranjero already exists: inspect it rather than overwrite it.");
}
const published = books.filter((book) => !book._id.startsWith("drafts."));
const active = published.filter((book) => ["available", "affiliate"].includes(book.stockStatus));
if (active.length !== 27) throw new Error("Unexpected catalogue size; review before migrating.");
const existing = (slug) => {
  const matches = published.filter((book) => book.slug?.current === slug);
  if (matches.length !== 1) throw new Error(`Expected one book: ${slug}`);
  if (books.some((book) => book._id === `drafts.${matches[0]._id}`)) throw new Error(`Pending draft: ${slug}`);
  return matches[0];
};
const russell = existing("conquista-felicidad");
const siddhartha = existing("siddhartha");
const mendel = existing("mendel-libros");
if (![russell, siddhartha, mendel].every((book) => book.isCoruPick) || siddhartha.catalogOrder !== 25) {
  throw new Error("The editorial shelf changed; review the intended order.");
}
const references = await client.fetch('*[_type in ["author", "genre", "emotion"] && !(_id in path("drafts.**"))]');
const reference = (type, title) => {
  const matches = references.filter((doc) => doc._type === type && doc.title === title);
  if (matches.length !== 1) throw new Error(`Expected one ${type}: ${title}`);
  return { _type: "reference", _ref: matches[0]._id };
};
const authors = references.filter((doc) => doc._type === "author" && doc.name === "Albert Camus");
if (authors.length > 1) throw new Error("Duplicate Albert Camus authors.");
const authorId = authors[0]?._id ?? "author-albert-camus";
const book = {
  _id: "book-el-extranjero", _type: "book", title: "El extranjero",
  slug: { _type: "slug", current: "el-extranjero" }, originalTitle: "L’Étranger",
  author: { _type: "reference", _ref: authorId }, publicationYear: 1942,
  pages: 128, isbn: "9788466356138", genre: reference("genre", "Clásico"),
  primaryEmotion: reference("emotion", "Extrañeza"),
  vibe: "Calor, distancia y una pregunta que no se deja cerrar.",
  shortDescription: "Meursault observa lo cotidiano con una distancia que desconcierta. Camus hace de esa mirada una novela sobre la extrañeza, el juicio y nuestra necesidad de encontrar sentido. Es breve, pero no una lectura tranquilizadora.",
  whyRead: "Una voz contenida que deja espacio para pensar en lo que esperamos de los demás y en nuestra necesidad de encontrar explicaciones.",
  forWhom: "Si te atraen las voces narrativas que incomodan y las historias que dejan espacio para pensar, sin resolverlo todo por ti.",
  notForWhom: "Si buscas una historia cálida o un refugio ligero. Aborda muerte, violencia y distancia emocional.",
  idealMoment: "Cuando te apetece mirar lo cotidiano desde un lugar menos familiar.",
  coruNote: "Te lo acercaría por su forma de dejar una pregunta en el aire, no porque sea un clásico que haya que terminar. Si hoy necesitas una historia que te abrace, elegiría otra.",
  readingTime: "Varias noches", readingPace: "Intenso", storyEntry: "Pensar",
  creativeSpark: "Fotografiar una sombra cotidiana y escribir qué cambia cuando la miras durante un minuto.",
  affiliateLink: "https://link.amazon/B08RTY0qq", amazonAsin: "8466356134",
  priceCents: 1295, format: "Bolsillo", stockStatus: "affiliate",
  isFeatured: false, isCoruPick: true, catalogOrder: 26,
  seoTitle: "El extranjero, de Albert Camus",
  seoDescription: "Descubre El extranjero, de Albert Camus: su atmósfera, sus temas y para quién puede encajar. Una novela breve que no busca dejarte indiferente.",
};
console.log(JSON.stringify({ write, edition: book.isbn, affiliateLink: book.affiliateLink,
  shelf: ["Siddhartha", "El extranjero", "Mendel el de los libros"], permanent: 25, total: 28 }, null, 2));
if (write) {
  await mkdir("reports", { recursive: true });
  const backup = `reports/el-extranjero-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  await writeFile(backup, JSON.stringify(books, null, 2) + "\n");
  const asset = await client.assets.upload("image", createReadStream("public/assets/covers/el-extranjero-albert-camus-debolsillo-9788466356138.webp"), {
    filename: "el-extranjero-albert-camus-debolsillo-9788466356138.webp",
  });
  book.coverImage = { _type: "image", asset: { _type: "reference", _ref: asset._id },
    alt: "Portada de El extranjero, de Albert Camus, en Debolsillo: líneas negras sobre blanco y título rosa." };
  let transaction = client.transaction();
  if (!authors.length) transaction = transaction.create({ _id: authorId, _type: "author", name: "Albert Camus", slug: { _type: "slug", current: "albert-camus" } });
  await transaction.create(book)
    .patch(russell._id, (patch) => patch.ifRevisionId(russell._rev).set({ isCoruPick: false }))
    .patch(mendel._id, (patch) => patch.ifRevisionId(mendel._rev).set({ catalogOrder: 27 }))
    .commit();
  const current = await client.fetch('*[_type == "book" && !(_id in path("drafts.**"))]');
  for (const before of published) {
    const after = current.find((doc) => doc._id === before._id);
    const expected = { ...before };
    if (before._id === russell._id) expected.isCoruPick = false;
    if (before._id === mendel._id) expected.catalogOrder = 27;
    const clean = (document) => Object.fromEntries(Object.entries(document).filter(([key]) => !["_rev", "_updatedAt"].includes(key)));
    if (!after || !isDeepStrictEqual(clean(expected), clean(after))) throw new Error(`Unexpected change: ${before._id}`);
  }
  const nowActive = current.filter((doc) => ["available", "affiliate"].includes(doc.stockStatus));
  const picks = nowActive.filter((doc) => doc.isCoruPick).sort((a, b) => a.catalogOrder - b.catalogOrder);
  if (nowActive.length !== 28 || picks.map((doc) => doc.slug.current).join(",") !== "siddhartha,el-extranjero,mendel-libros") throw new Error("Catalogue verification failed.");
  if (new Set(nowActive.map((doc) => doc.catalogOrder)).size !== 28) throw new Error("Duplicate catalogue order.");
  const added = current.find((doc) => doc._id === book._id);
  for (const [field, value] of Object.entries(book)) if (!isDeepStrictEqual(added[field], value)) throw new Error(`New book verification failed: ${field}`);
  await writeFile("reports/el-extranjero-migration-2026-10-03.json", JSON.stringify({
    checkedAt: new Date().toISOString(), backup, total: 28, permanent: 25,
    picks: picks.map((doc) => doc.title), existingBooksAndAffiliateLinksPreserved: true,
    edition: book.isbn, affiliateLink: book.affiliateLink, trackingId: "ramecoru06-21",
    coverSource: "https://www.penguinlibros.com/es/1968338-large_default/el-extranjero.webp",
    affiliateLinkOpened: false,
  }, null, 2) + "\n");
  console.log("Verified: 28 books; every existing book and affiliate link preserved. Backup: " + backup);
}
