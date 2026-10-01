import { getCliClient } from "sanity/cli";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

// Dry run by default. Only these existing published documents may be patched.
const client = getCliClient({ apiVersion: "2026-07-04" }).withConfig({ useCdn: false });
const write = process.argv.includes("--write");
const sections = [
  ["h2", "Volver a leer, sin recuperar ninguna marca"],
  ["normal", "Si llevas tiempo sin abrir un libro, no necesitas volver al ritmo que tenías antes. Empieza por una historia que te interese y quepa en el día que tienes ahora. Que sea breve puede ayudar; que te apetezca importa más que su número de páginas."],
  ["normal", "Estas tres propuestas son cortas, pero no ligeras en el mismo sentido. Una mira la memoria y la exclusión, otra se acerca a una emoción intensa y la tercera entra en lo inquietante. Elige por lo que te apetece acompañar, no por cuál parezca más fácil de terminar."],
  ["h2", "Mendel el de los libros: empezar por una persona"],
  ["normal", "Stefan Zweig sitúa a un librero de memoria extraordinaria en un café de Viena. Su relación con los libros permite entrar en una historia de pertenencia y exclusión: aquí la brevedad no evita el peso de lo que ocurre."],
  ["normal", "Puede encajarte si te interesa un retrato humano y prefieres seguir una vida antes que un mundo con muchos personajes. Quizá no ahora si buscas algo alegre: la melancolía y la injusticia forman parte de esta lectura."],
  ["h2", "Carta de una desconocida: si te apetece intensidad"],
  ["normal", "También de Zweig, esta historia concentra su fuerza en la voz de una mujer y en una relación desigual. La forma de carta permite acercarse directamente a lo que siente, sin necesitar una trama extensa para entrar."],
  ["normal", "Puede encajarte si quieres una lectura emocional y contenida. No la elegiríamos como refugio ligero: el amor no correspondido y la pérdida pueden pesar. Si hoy necesitas distancia de esos temas, prueba otra puerta."],
  ["h2", "Los sauces: si la curiosidad te devuelve al libro"],
  ["normal", "Algernon Blackwood lleva a dos viajeros a una isla del Danubio. El paisaje deja de ser un fondo y se vuelve una presencia inquietante. La amenaza se construye con la atmósfera, no con respuestas inmediatas."],
  ["normal", "Puede encajarte si te gusta el terror que sugiere y quieres seguir leyendo para entender qué está pasando. Quizá no ahora si buscas calma o acción rápida: es una lectura de tensión sostenida que pide atención a los detalles."],
  ["h2", "Un comienzo que sí cabe en tu día"],
  ["normal", "Elige solo uno. Busca un momento posible, deja el teléfono fuera de la mano y lee unas páginas sin fijarte una cuota. Al parar, pregúntate algo sencillo: ¿me apetece volver a esta voz? Si la respuesta es sí, deja el libro a la vista para la próxima vez."],
  ["normal", "Si la respuesta es no, puedes cambiar de libro. Una historia breve no tiene que leerse de una vez, ni terminarse para justificar la elección. La extensión y la traducción varían entre ediciones: revisa la ficha y los datos de la edición antes de comprar."],
  ["h2", "¿Y si no me apetece ninguno?"],
  ["normal", "No conviertas estas tres propuestas en una lista pendiente. Puedes entrar en Descubrir desde «Quiero empezar a leer» o ir a Biblioteca y probar otra sensación, género o ritmo. El siguiente libro no tiene que parecerse al último que terminaste."],
];

const updates = [
  {
    type: "book", slug: "kalpa-imperial",
    set: {
      notForWhom: "Quizá no si necesitas una trama única y lineal desde la primera página.",
    },
  },
  {
    type: "book", slug: "carta-desconocida",
    set: {
      forWhom: "Para quien quiere una historia de sentimiento sin azúcar ni cinismo.",
      notForWhom: "Quizá no si buscas una relación luminosa o una lectura ligera.",
    },
  },
  {
    type: "book", slug: "hacia-rutas-salvajes",
    set: {
      seoTitle: "Hacia rutas salvajes, de Jon Krakauer",
      seoDescription: "Una crónica real sobre Chris McCandless, la libertad y sus límites. Descubre el ritmo, los temas y si Hacia rutas salvajes encaja contigo.",
      shortDescription: "Una crónica real sobre Chris McCandless, su viaje y los límites de la libertad. Krakauer reconstruye una vida sin convertirla en un manual para dejarlo todo.",
      forWhom: "Para quien disfruta la no ficción narrativa, los viajes y las preguntas que no tienen una respuesta cómoda. La naturaleza importa, pero también los vínculos y las decisiones de quien se adentra en ella.",
      notForWhom: "Si buscas una aventura ligera o una escapada tranquilizadora. La historia aborda aislamiento, riesgo y muerte; su forma de reconstruir los hechos no sigue siempre un recorrido lineal.",
    },
  },
  {
    type: "article", slug: "historias-breves-para-recuperar-el-habito",
    set: {
      seoTitle: "Historias breves para volver a leer sin presión",
      seoDescription: "Tres historias breves para volver a leer: Mendel el de los libros, Carta de una desconocida y Los sauces. Elige por tu momento, no por una meta.",
      body: sections.map(([style, text], index) => ({
        _key: `habit-${index}`, _type: "block", style, markDefs: [],
        children: [{ _key: `habit-span-${index}`, _type: "span", marks: [], text }],
      })),
    },
  },
];

const documents = await client.fetch(
  `*[_type in ["book", "article"] && slug.current in $slugs && !(_id in path("drafts.**"))]`,
  { slugs: updates.map((update) => update.slug) },
);
const pending = updates.map((update) => {
  const matches = documents.filter((doc) => doc._type === update.type && doc.slug?.current === update.slug);
  if (matches.length !== 1) throw new Error(`Expected one published document for ${update.slug}`);
  return { document: matches[0], update };
});
console.log(JSON.stringify(pending.map(({ document, update }) => ({
  id: document._id, slug: update.slug, fields: Object.keys(update.set), write,
})), null, 2));

if (write) {
  await mkdir("reports", { recursive: true });
  // A dated snapshot permits a manual, revision-aware recovery without overwriting later edits.
  const snapshot = `reports/editorial-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  await writeFile(snapshot, JSON.stringify(documents, null, 2) + "\n");
  let transaction = client.transaction();
  for (const { document, update } of pending) {
    transaction = transaction.patch(document._id, (patch) => patch.ifRevisionId(document._rev).set(update.set));
  }
  await transaction.commit();
  console.log(`Recovery snapshot: ${snapshot}`);
}

if (write || process.argv.includes("--verify")) {
  const baselineIndex = process.argv.indexOf("--baseline");
  const baseline = baselineIndex >= 0 ? JSON.parse(await readFile(process.argv[baselineIndex + 1], "utf8")) : documents;
  for (const { document, update } of pending) {
    const current = await client.getDocument(document._id);
    for (const [field, value] of Object.entries(update.set)) {
      if (!isDeepStrictEqual(current[field], value)) throw new Error(`Verification failed: ${update.slug}.${field}`);
    }
    const original = baseline.find((doc) => doc._id === document._id);
    if (!original) throw new Error(`Missing baseline: ${document._id}`);
    const untouched = new Set([...Object.keys(original), ...Object.keys(current)]);
    for (const field of untouched) {
      if (["_rev", "_updatedAt"].includes(field) || field in update.set) continue;
      if (!isDeepStrictEqual(current[field], original[field])) throw new Error(`Protected field changed: ${field}`);
    }
  }
  console.log(`Verified ${pending.length} updates and protected fields.`);
}
