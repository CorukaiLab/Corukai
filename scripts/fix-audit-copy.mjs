import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });
const shouldWrite = process.argv.includes("--write");
const replacements = new Map([
  ["Fantasia", "Fantasía"],
  ["Ciencia ficcion", "Ciencia ficción"],
  ["Historica", "Histórica"],
  ["Melancolia", "Melancolía"],
  ["Angelica Gorodischer", "Angélica Gorodischer"],
]);

const documents = await client.fetch(`*[_type in ["genre", "emotion", "author"]] {
  _id, _rev, _type, title, name
}`);

for (const document of documents) {
  const field = document._type === "author" ? "name" : "title";
  const previous = document[field];
  const next = replacements.get(previous);
  if (!next) continue;

  if (shouldWrite) {
    await client.patch(document._id).ifRevisionId(document._rev).set({ [field]: next }).commit();
  }
  console.log(`${shouldWrite ? "Actualizado" : "Pendiente"}: ${document._id}: ${previous} → ${next}`);
}
