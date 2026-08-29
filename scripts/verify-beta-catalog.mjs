import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const EXPECTED_PRODUCTS = 27;
const EXPECTED_CATALOGUE = 24;
const EXPECTED_CORU_PICKS = 3;
const client = getCliClient({ apiVersion: "2026-07-04" });

const books = await client.fetch(`*[
  _type == "book" && stockStatus in ["available", "affiliate"]
] | order(catalogOrder asc) {
  _id,
  title,
  "slug": slug.current,
  "author": author->name,
  "genre": genre->title,
  "emotion": primaryEmotion->title,
  publicationYear,
  pages,
  isbn,
  priceCents,
  format,
  vibe,
  shortDescription,
  idealMoment,
  coruNote,
  readingTime,
  readingPace,
  storyEntry,
  creativeSpark,
  affiliateLink,
  catalogOrder,
  "isCoruPick": coalesce(isCoruPick, false),
  "coverUrl": coverImage.asset->url,
  "coverAlt": coverImage.alt,
  "coverWidth": coverImage.asset->metadata.dimensions.width,
  "coverHeight": coverImage.asset->metadata.dimensions.height
}`);

const requiredFields = [
  "title", "slug", "author", "genre", "emotion", "publicationYear",
  "priceCents", "format", "vibe", "shortDescription", "idealMoment",
  "coruNote", "readingTime", "readingPace", "storyEntry", "creativeSpark",
  "affiliateLink", "catalogOrder", "coverUrl",
];

function duplicateValues(field) {
  const values = books.map((book) => book[field]).filter((value) => value !== undefined && value !== null && value !== "");
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const incomplete = books.flatMap((book) => {
  const missing = requiredFields.filter((field) => book[field] === undefined || book[field] === null || book[field] === "");
  return missing.length ? [{ slug: book.slug || book._id, missing }] : [];
});
const invalidPrices = books.filter((book) => !Number.isInteger(book.priceCents) || book.priceCents < 300 || book.priceCents > 10000).map((book) => book.slug);
const weakCovers = books.filter((book) => !book.coverWidth || !book.coverHeight || book.coverWidth < 250 || book.coverHeight < 350).map((book) => book.slug);
const invalidAffiliateLinks = books.filter((book) => {
  try {
    return new URL(book.affiliateLink).hostname !== "link.amazon";
  } catch {
    return true;
  }
}).map((book) => book.slug);
const duplicateSlugs = duplicateValues("slug");
const duplicateOrders = duplicateValues("catalogOrder");
const duplicateLinks = duplicateValues("affiliateLink");
const catalogue = books.filter((book) => !book.isCoruPick);
const coruPicks = books.filter((book) => book.isCoruPick);
const isbnCoverage = books.filter((book) => book.isbn).length;

const summary = {
  active: books.length,
  catalogue: catalogue.length,
  coruPicks: coruPicks.length,
  completeRecords: books.length - incomplete.length,
  validCovers: books.length - weakCovers.length,
  affiliateLinks: books.length - invalidAffiliateLinks.length,
  isbnCoverage,
  duplicateSlugs,
  duplicateOrders,
  duplicateLinks,
  invalidPrices,
  weakCovers,
  invalidAffiliateLinks,
  incomplete,
};

const passed = books.length === EXPECTED_PRODUCTS
  && catalogue.length === EXPECTED_CATALOGUE
  && coruPicks.length === EXPECTED_CORU_PICKS
  && incomplete.length === 0
  && invalidPrices.length === 0
  && weakCovers.length === 0
  && invalidAffiliateLinks.length === 0
  && duplicateSlugs.length === 0
  && duplicateOrders.length === 0
  && duplicateLinks.length === 0;

const generatedAt = new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date());
const rows = books.map((book) => `| ${book.catalogOrder} | ${book.title} | ${book.author} | ${book.genre} | ${(book.priceCents / 100).toFixed(2)} € | ${book.isbn || "Pendiente"} | ${book.isCoruPick ? "Coru" : "Catálogo"} |`).join("\n");
const report = `# Salud del catálogo CoruKai

Generado: ${generatedAt}

## Resultado

**${passed ? "APTO" : "REVISAR"}** para la beta comercial.

| Comprobación | Resultado |
|---|---:|
| Libros activos | ${books.length} / ${EXPECTED_PRODUCTS} |
| Catálogo permanente | ${catalogue.length} / ${EXPECTED_CATALOGUE} |
| Recomendaciones de Coru | ${coruPicks.length} / ${EXPECTED_CORU_PICKS} |
| Fichas completas | ${books.length - incomplete.length} / ${books.length} |
| Portadas válidas | ${books.length - weakCovers.length} / ${books.length} |
| Enlaces configurados | ${books.length - invalidAffiliateLinks.length} / ${books.length} |
| ISBN informados | ${isbnCoverage} / ${books.length} |

Los precios son orientativos y deben contrastarse manualmente con Amazon cuando se cambie una edición. La auditoría de redirecciones se ejecuta por separado con \`npm run test:affiliates\`.

## Inventario

| Orden | Libro | Autor | Género | Precio orientativo | ISBN | Sección |
|---:|---|---|---|---:|---|---|
${rows}
`;

const reportPath = resolve("reports/catalog-health.md");
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, report, "utf8");

console.log(JSON.stringify({ passed, report: reportPath, ...summary }, null, 2));
if (!passed) process.exitCode = 1;
