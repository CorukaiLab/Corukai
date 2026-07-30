import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });
const root = process.cwd();

const books = [
  {
    slug: "rosa-tibet",
    title: "La rosa del Tibet",
    author: "Lionel Davidson",
    authorId: "author-lionel-davidson",
    genre: "Aventura",
    genreId: "genre-aventura",
    emotionId: "emotion-asombro",
    priceCents: 1990,
    year: 1962,
    cover: "rosa-tibet.jpg",
    vibe: "Expedicion secreta, montanas y una promesa de lugar oculto.",
    shortDescription:
      "Montanas, busqueda y una promesa de lugar oculto. Aventura clasica con pulso espiritual y geografico.",
    idealMoment: "Un fin de semana con tiempo para desaparecer.",
  },
  {
    slug: "abisinio",
    title: "El abisinio",
    author: "Jean-Christophe Rufin",
    authorId: "author-jean-christophe-rufin",
    genre: "Aventura",
    genreId: "genre-aventura",
    emotionId: "emotion-curiosidad",
    priceCents: 2290,
    year: 1997,
    cover: "abisinio.jpg",
    vibe: "Diplomacia, desierto y viaje entre culturas.",
    shortDescription:
      "Una novela historica luminosa que cruza medicina, politica y descubrimiento sin perder el viaje.",
    idealMoment: "Cuando quieres una aventura larga pero hospitalaria.",
  },
  {
    slug: "vendaval-jamaica",
    title: "Un vendaval en Jamaica",
    author: "Richard Hughes",
    authorId: "author-richard-hughes",
    genre: "Aventura",
    genreId: "genre-aventura",
    emotionId: "emotion-tension-suave",
    priceCents: 1490,
    year: 1929,
    cover: "vendaval-jamaica.jpg",
    vibe: "Piratas, infancia y una extraneza que crece con cada pagina.",
    shortDescription:
      "Un clasico breve que empieza como relato marino y se vuelve una observacion psicologica dificil de olvidar.",
    idealMoment: "Una tarde de viento y curiosidad.",
  },
  {
    slug: "kalpa-imperial",
    title: "Kalpa Imperial",
    author: "Angelica Gorodischer",
    authorId: "author-angelica-gorodischer",
    genre: "Fantasia",
    genreId: "genre-fantasia",
    emotionId: "emotion-asombro",
    priceCents: 1890,
    year: 1983,
    cover: "kalpa-imperial.jpg",
    vibe: "Imperios, memoria y relatos que parecen llegar desde otra edad.",
    shortDescription:
      "Fantasia literaria construida con voces, ruinas, poder y tiempo. Pide imaginacion, no mapas.",
    idealMoment: "Noches en las que apetece escuchar una historia antigua.",
  },
  {
    slug: "lud-in-the-mist",
    title: "Lud-in-the-Mist",
    author: "Hope Mirrlees",
    authorId: "author-hope-mirrlees",
    genre: "Fantasia",
    genreId: "genre-fantasia",
    emotionId: "emotion-curiosidad",
    priceCents: 1790,
    year: 1926,
    cover: "lud-in-the-mist.jpg",
    vibe: "Una ciudad imposible y una frontera inquietante con lo feerico.",
    shortDescription:
      "Ley, deseo y fruta magica en una rareza fantastica con perfume antiguo y sorprendente modernidad.",
    idealMoment: "Cuando quieres fantasia sin formulas.",
  },
  {
    slug: "espada-rota",
    title: "La espada rota",
    author: "Poul Anderson",
    authorId: "author-poul-anderson",
    genre: "Fantasia",
    genreId: "genre-fantasia",
    emotionId: "emotion-descubrimiento",
    priceCents: 1690,
    year: 1954,
    cover: "espada-rota.jpg",
    vibe: "Mitologia nordica, destino tragico y energia de saga antigua.",
    shortDescription:
      "Una fantasia compacta y afilada para quien busca mitos, conflicto y consecuencias reales.",
    idealMoment: "Cuando quieres una historia que no se detenga.",
  },
  {
    slug: "carta-desconocida",
    title: "Carta de una desconocida",
    author: "Stefan Zweig",
    authorId: "author-stefan-zweig",
    genre: "Romance",
    genreId: "genre-romance",
    emotionId: "emotion-melancolia",
    priceCents: 1290,
    year: 1922,
    cover: "carta-desconocida.jpg",
    vibe: "Amor, memoria y distancia en una confesion contenida.",
    shortDescription:
      "Una confesion breve donde el amor, la memoria y la distancia pesan con una precision casi fisica.",
    idealMoment: "Una noche tranquila, sin interrupciones.",
  },
  {
    slug: "mr-ripley",
    title: "El talento de Mr. Ripley",
    author: "Patricia Highsmith",
    authorId: "author-patricia-highsmith",
    genre: "Misterio",
    genreId: "genre-misterio",
    emotionId: "emotion-tension-suave",
    priceCents: 1590,
    year: 1955,
    cover: "mr-ripley.jpg",
    vibe: "Sol, deseo y una identidad que empieza a deslizarse.",
    shortDescription:
      "Un thriller psicologico elegante y oscuro que convierte la fascinacion en peligro sin necesidad de ruido.",
    idealMoment: "Para un viaje en el que quieres desconectar del entorno.",
  },
  {
    slug: "utilidad-inutil",
    title: "La utilidad de lo inutil",
    author: "Nuccio Ordine",
    authorId: "author-nuccio-ordine",
    genre: "Ensayo",
    genreId: "genre-ensayo",
    emotionId: "emotion-calma",
    priceCents: 1390,
    year: 2013,
    cover: "utilidad-inutil.jpg",
    vibe: "Una defensa serena del conocimiento que no busca beneficio inmediato.",
    shortDescription:
      "Un manifiesto accesible sobre cultura, educacion y conocimiento para leer sin lenguaje academico innecesario.",
    idealMoment: "Cuando necesitas reconciliarte con aprender por placer.",
  },
  {
    slug: "mas-que-humano",
    title: "Mas que humano",
    author: "Theodore Sturgeon",
    authorId: "author-theodore-sturgeon",
    genre: "Ciencia ficcion",
    genreId: "genre-ciencia-ficcion",
    emotionId: "emotion-asombro",
    priceCents: 1690,
    year: 1953,
    cover: "mas-que-humano.jpg",
    vibe: "Personas incompletas que juntas pueden convertirse en algo nuevo.",
    shortDescription:
      "Ciencia ficcion humana y extrana sobre identidad, evolucion y pertenencia, escrita desde la fragilidad.",
    idealMoment: "Cuando quieres ideas grandes con personajes cercanos.",
  },
  {
    slug: "puente-drina",
    title: "Un puente sobre el Drina",
    author: "Ivo Andric",
    authorId: "author-ivo-andric",
    genre: "Historica",
    genreId: "genre-historica",
    emotionId: "emotion-calma",
    priceCents: 2190,
    year: 1945,
    cover: "puente-drina.jpg",
    vibe: "Siglos de vida observados desde un puente que permanece.",
    shortDescription:
      "Una novela coral sobre comunidad, memoria y cambio. Exige calma y devuelve perspectiva.",
    idealMoment: "Un periodo de lectura lento y sin objetivos.",
  },
  {
    slug: "gran-dios-pan",
    title: "El gran dios Pan",
    author: "Arthur Machen",
    authorId: "author-arthur-machen",
    genre: "Terror",
    genreId: "genre-terror",
    emotionId: "emotion-tension-suave",
    priceCents: 1290,
    year: 1894,
    cover: "gran-dios-pan.jpg",
    vibe: "Horror antiguo que prefiere sugerir una puerta antes que mostrarla.",
    shortDescription:
      "Una pieza breve de terror extrano, atmosfera decadente y consecuencias que se intuyen mas de lo que se explican.",
    idealMoment: "Una noche silenciosa y con poca luz.",
  },
];

async function ensureReferenceDocuments(book) {
  await client.createIfNotExists({
    _id: book.authorId,
    _type: "author",
    name: book.author,
    slug: { _type: "slug", current: book.authorId.replace("author-", "") },
  });
  await client.createIfNotExists({
    _id: book.genreId,
    _type: "genre",
    title: book.genre,
    slug: { _type: "slug", current: book.genreId.replace("genre-", "") },
  });
}

async function ensureCover(book, existing) {
  const currentRef = existing?.coverImage?.asset?._ref;
  if (currentRef) return currentRef;

  const coverPath = path.join(root, "public", "assets", "covers", book.cover);
  const asset = await client.assets.upload("image", createReadStream(coverPath), {
    filename: book.cover,
    title: `Portada de ${book.title}`,
  });
  return asset._id;
}

for (const [index, book] of books.entries()) {
  await ensureReferenceDocuments(book);

  const bookId = `book-${book.slug}`;
  const existing = await client.getDocument(bookId);
  const coverRef = await ensureCover(book, existing);

  await client.createIfNotExists({
    _id: bookId,
    _type: "book",
    title: book.title,
    slug: { _type: "slug", current: book.slug },
    author: { _type: "reference", _ref: book.authorId },
    genre: { _type: "reference", _ref: book.genreId },
  });

  await client
    .patch(bookId)
    .set({
      title: book.title,
      slug: { _type: "slug", current: book.slug },
      author: { _type: "reference", _ref: book.authorId },
      genre: { _type: "reference", _ref: book.genreId },
      primaryEmotion: { _type: "reference", _ref: book.emotionId },
      emotions: [{ _key: book.emotionId, _type: "reference", _ref: book.emotionId }],
      coverImage: {
        _type: "image",
        asset: { _type: "reference", _ref: coverRef },
        alt: `Portada de ${book.title}`,
      },
      publicationYear: book.year,
      priceCents: book.priceCents,
      format: "Tapa blanda",
      stockStatus: "draft",
      vibe: book.vibe,
      shortDescription: book.shortDescription,
      idealMoment: book.idealMoment,
      isFeatured: index < 6,
      seoTitle: `${book.title} | CoruKai`,
      seoDescription: `${book.shortDescription} Descubre si encaja con tu momento lector en CoruKai.`,
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log(`Synced ${index + 1}/${books.length}: ${book.title}`);
}

console.log(`Done. ${books.length} beta books synchronized.`);
