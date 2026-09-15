import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const shouldWrite = process.argv.includes("--write");
const client = getCliClient({ apiVersion: "2026-07-04" });

const books = await client.fetch(`*[
  _type == "book" &&
  stockStatus in ["available", "affiliate"] &&
  defined(affiliateLink)
] | order(catalogOrder asc) {
  _id,
  title,
  "slug": slug.current,
  amazonAsin,
  affiliateLink
}`);

function extractAsin(url) {
  const parsed = new URL(url);
  const queryAsin = parsed.searchParams.get("asin")?.toUpperCase();
  if (queryAsin && /^[A-Z0-9]{10}$/.test(queryAsin)) return queryAsin;

  const match = parsed.pathname.match(
    /\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/ASIN)\/([A-Z0-9]{10})(?:[/?]|$)/i,
  );
  return match?.[1]?.toUpperCase() || null;
}

async function resolveBook(book) {
  if (book.amazonAsin) {
    return { ...book, resolvedAsin: book.amazonAsin.toUpperCase(), source: "Sanity", destination: null };
  }

  try {
    const response = await fetch(book.affiliateLink, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "CoruKai catalogue edition audit" },
      signal: AbortSignal.timeout(15_000),
    });
    const destination = response.url;
    const hostname = new URL(destination).hostname;
    const isAmazonSpain = hostname === "amazon.es" || hostname.endsWith(".amazon.es");
    return {
      ...book,
      resolvedAsin: isAmazonSpain ? extractAsin(destination) : null,
      source: isAmazonSpain ? "Enlace afiliado" : "Destino no válido",
      destination,
      status: response.status,
    };
  } catch (error) {
    return {
      ...book,
      resolvedAsin: null,
      source: "Error",
      destination: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = [];
for (let index = 0; index < books.length; index += 4) {
  results.push(...await Promise.all(books.slice(index, index + 4).map(resolveBook)));
}

const additions = results.filter((book) => !book.amazonAsin && book.resolvedAsin);
if (shouldWrite && additions.length > 0) {
  const transaction = client.transaction();
  for (const book of additions) transaction.patch(book._id, { set: { amazonAsin: book.resolvedAsin } });
  await transaction.commit();
}

const unresolved = results.filter((book) => !book.resolvedAsin);
const rows = results.map((book) => (
  `| ${book.title} | ${book.resolvedAsin || "-"} | ${book.source} | ${book.amazonAsin ? "Ya guardado" : book.resolvedAsin ? shouldWrite ? "Guardado" : "Listo para guardar" : "Revisión manual"} |`
)).join("\n");
const generatedAt = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
}).format(new Date());
const report = `# ASIN de las ediciones de CoruKai

Generado: ${generatedAt}

- Libros revisados: ${results.length}
- ASIN identificados: ${results.length - unresolved.length}
- ASIN nuevos encontrados: ${additions.length}
- Pendientes: ${unresolved.length}
- Escritura en Sanity: ${shouldWrite ? "Sí" : "No (auditoría)"}

| Libro | ASIN | Fuente | Estado |
|---|---|---|---|
${rows}
`;

const reportPath = resolve("reports/amazon-asin-resolution.md");
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, report, "utf8");

console.log(JSON.stringify({
  reviewed: results.length,
  identified: results.length - unresolved.length,
  additions: additions.length,
  unresolved: unresolved.map((book) => book.slug),
  wroteToSanity: shouldWrite,
  report: reportPath,
}, null, 2));

if (unresolved.length > 0) process.exitCode = 2;
