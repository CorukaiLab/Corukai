import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });
const books = await client.fetch(`*[_type == "book" && stockStatus in ["available", "affiliate"]] | order(catalogOrder asc) {
  title, "slug": slug.current, isbn, amazonAsin, affiliateLink
}`);

function isbn13ToIsbn10(isbn = "") {
  const normalized = String(isbn || "").replace(/[^0-9X]/gi, "").toUpperCase();
  if (/^[0-9]{9}[0-9X]$/.test(normalized)) return normalized;
  if (!/^978[0-9]{10}$/.test(normalized)) return undefined;
  const base = normalized.slice(3, 12);
  const total = [...base].reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0);
  const check = (11 - (total % 11)) % 11;
  return `${base}${check === 10 ? "X" : check}`;
}

const rows = books.map((book) => {
  const asin = book.amazonAsin || isbn13ToIsbn10(book.isbn);
  return { ...book, resolvedAsin: asin, source: book.amazonAsin ? "Sanity" : asin ? "ISBN" : "Pendiente" };
});
const ready = rows.filter((book) => book.resolvedAsin);
const report = `# Preparación de Amazon Creators API

Generado: ${new Date().toISOString()}

- Libros activos: ${rows.length}
- Ediciones identificables por ASIN o ISBN-10: ${ready.length}
- Ediciones pendientes de ASIN: ${rows.length - ready.length}
- Credenciales configuradas en este entorno: ${process.env.AMAZON_CREATORS_CLIENT_ID && process.env.AMAZON_CREATORS_CLIENT_SECRET ? "Sí" : "No"}

| Libro | ASIN para API | Fuente | Estado |
|---|---|---|---|
${rows.map((book) => `| ${book.title} | ${book.resolvedAsin || "-"} | ${book.source} | ${book.resolvedAsin ? "Preparado" : "Falta identificar edición"} |`).join("\n")}

Los códigos de \`link.amazon\` no se consideran ASIN. El precio público solo se muestra cuando Creators API devuelve una oferta vigente.
`;

const output = resolve("reports/amazon-api-readiness.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, report, "utf8");
console.log(JSON.stringify({ books: rows.length, ready: ready.length, pending: rows.length - ready.length, report: output }, null, 2));
