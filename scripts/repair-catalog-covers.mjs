import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });
const replacements = [
  {
    slug: "historia-lectura",
    file: "public/assets/covers/historia-lectura.jpg",
    isbn: "9788420608907",
    alt: "Portada de Una historia de la lectura, de Alberto Manguel",
  },
  {
    slug: "estacion-transito",
    file: "public/assets/covers/estacion-transito.jpg",
    isbn: "9788476340370",
    alt: "Portada de Estación de tránsito, de Clifford D. Simak",
  },
];

for (const replacement of replacements) {
  const book = await client.fetch(
    `*[_type == "book" && slug.current == $slug][0] { _id, title }`,
    { slug: replacement.slug },
  );
  if (!book?._id) throw new Error(`No existe el libro ${replacement.slug} en Sanity.`);

  const asset = await client.assets.upload(
    "image",
    createReadStream(resolve(replacement.file)),
    { filename: `${replacement.slug}.jpg` },
  );

  await client.patch(book._id).set({
    isbn: replacement.isbn,
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: replacement.alt,
    },
  }).commit();

  console.log(`Actualizado: ${book.title} -> ${asset._id}`);
}
