export type Product = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  mood: string;
  priceCents: number;
  cover: string;
  accent: string;
  hook: string;
  description: string;
  idealMoment: string;
  format: string;
  year: number;
  isbn?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "rosa-tibet",
    title: "La rosa del Tibet",
    author: "Lionel Davidson",
    genre: "Aventura",
    mood: "Asombro",
    priceCents: 1990,
    cover: "/assets/covers/rosa-tibet.jpg",
    accent: "#F1D56A",
    hook: "Una expedición secreta para cuando necesitas que el mundo vuelva a parecer grande.",
    description:
      "Montañas, búsqueda y una promesa de lugar oculto. Aventura clásica con un pulso espiritual y geográfico poco frecuente.",
    idealMoment: "Un fin de semana con tiempo para desaparecer.",
    format: "Tapa blanda",
    year: 1962,
  },
  {
    slug: "abisinio",
    title: "El abisinio",
    author: "Jean-Christophe Rufin",
    genre: "Aventura",
    mood: "Curiosidad",
    priceCents: 2290,
    cover: "/assets/covers/abisinio.jpg",
    accent: "#F1D56A",
    hook: "Diplomacia, desierto y viaje para lectores que prefieren la aventura con contexto.",
    description:
      "Una novela histórica luminosa que cruza culturas, medicina, política y descubrimiento sin perder el sentido del viaje.",
    idealMoment: "Cuando quieres una aventura larga pero hospitalaria.",
    format: "Tapa blanda",
    year: 1997,
  },
  {
    slug: "vendaval-jamaica",
    title: "Un vendaval en Jamaica",
    author: "Richard Hughes",
    genre: "Aventura",
    mood: "Inquietud",
    priceCents: 1490,
    cover: "/assets/covers/vendaval-jamaica.jpg",
    accent: "#F1D56A",
    hook: "Piratas e infancia en una aventura mucho más extraña de lo que parece.",
    description:
      "Un clásico breve que empieza como relato marino y se vuelve una observación psicológica difícil de olvidar.",
    idealMoment: "Una tarde de viento y curiosidad.",
    format: "Tapa blanda",
    year: 1929,
  },
  {
    slug: "kalpa-imperial",
    title: "Kalpa Imperial",
    author: "Angélica Gorodischer",
    genre: "Fantasía",
    mood: "Asombro",
    priceCents: 1890,
    cover: "/assets/covers/kalpa-imperial.jpg",
    accent: "#A7D8B0",
    hook: "Imperios, memoria y relatos que parecen llegar desde otra edad.",
    description:
      "Una fantasía literaria construida con voces, ruinas, poder y tiempo. No exige mapas ni sagas: pide imaginación.",
    idealMoment: "Noches en las que apetece escuchar una historia antigua.",
    format: "Tapa blanda",
    year: 1983,
  },
  {
    slug: "lud-in-the-mist",
    title: "Lud-in-the-Mist",
    author: "Hope Mirrlees",
    genre: "Fantasía",
    mood: "Extrañeza",
    priceCents: 1790,
    cover: "/assets/covers/lud-in-the-mist.jpg",
    accent: "#A7D8B0",
    hook: "Una ciudad imposible y una frontera inquietante con lo feérico.",
    description:
      "Ley, deseo y fruta mágica en una rareza fantástica con perfume antiguo y una sorprendente modernidad.",
    idealMoment: "Cuando quieres fantasía sin fórmulas.",
    format: "Tapa blanda",
    year: 1926,
  },
  {
    slug: "espada-rota",
    title: "La espada rota",
    author: "Poul Anderson",
    genre: "Fantasía",
    mood: "Intensidad",
    priceCents: 1690,
    cover: "/assets/covers/espada-rota.jpg",
    accent: "#A7D8B0",
    hook: "Mitología nórdica, destino trágico y una energía de saga antigua.",
    description:
      "Una fantasía compacta y afilada para quien busca mitos, conflicto y consecuencias reales.",
    idealMoment: "Cuando quieres una historia que no se detenga.",
    format: "Tapa blanda",
    year: 1954,
  },
  {
    slug: "carta-desconocida",
    title: "Carta de una desconocida",
    author: "Stefan Zweig",
    genre: "Romance",
    mood: "Melancolía",
    priceCents: 1290,
    cover: "/assets/covers/carta-desconocida.jpg",
    accent: "#F56B50",
    hook: "Una emoción contenida para leer de una vez y recordar durante días.",
    description:
      "Una confesión breve donde el amor, la memoria y la distancia pesan con una precisión casi física.",
    idealMoment: "Una noche tranquila, sin interrupciones.",
    format: "Tapa blanda",
    year: 1922,
  },
  {
    slug: "mr-ripley",
    title: "El talento de Mr. Ripley",
    author: "Patricia Highsmith",
    genre: "Misterio",
    mood: "Inquietud",
    priceCents: 1590,
    cover: "/assets/covers/mr-ripley.jpg",
    accent: "#5B3C67",
    hook: "Sol, deseo y una identidad que empieza a deslizarse.",
    description:
      "Un thriller psicológico elegante y oscuro que convierte la fascinación en peligro sin necesidad de ruido.",
    idealMoment: "Para un viaje en el que quieres desconectar del entorno.",
    format: "Tapa blanda",
    year: 1955,
  },
  {
    slug: "utilidad-inutil",
    title: "La utilidad de lo inútil",
    author: "Nuccio Ordine",
    genre: "Ensayo",
    mood: "Claridad",
    priceCents: 1390,
    cover: "/assets/covers/utilidad-inutil.jpg",
    accent: "#63B7C9",
    hook: "Una defensa de aquello que no produce beneficio inmediato, pero nos hace humanos.",
    description:
      "Un manifiesto accesible sobre cultura, educación y conocimiento para leer sin lenguaje académico innecesario.",
    idealMoment: "Cuando necesitas reconciliarte con aprender por placer.",
    format: "Tapa blanda",
    year: 2013,
  },
  {
    slug: "mas-que-humano",
    title: "Más que humano",
    author: "Theodore Sturgeon",
    genre: "Ciencia ficción",
    mood: "Asombro",
    priceCents: 1690,
    cover: "/assets/covers/mas-que-humano.jpg",
    accent: "#6FC6B1",
    hook: "Personas incompletas que juntas pueden convertirse en algo nuevo.",
    description:
      "Ciencia ficción humana y extraña sobre identidad, evolución y pertenencia, escrita desde la fragilidad.",
    idealMoment: "Cuando quieres ideas grandes con personajes cercanos.",
    format: "Tapa blanda",
    year: 1953,
  },
  {
    slug: "puente-drina",
    title: "Un puente sobre el Drina",
    author: "Ivo Andrić",
    genre: "Histórica",
    mood: "Contemplación",
    priceCents: 2190,
    cover: "/assets/covers/puente-drina.jpg",
    accent: "#D3906F",
    hook: "Siglos de vida observados desde un puente que permanece.",
    description:
      "Una novela coral sobre comunidad, memoria y cambio. Exige calma y devuelve perspectiva.",
    idealMoment: "Un periodo de lectura lento y sin objetivos.",
    format: "Tapa blanda",
    year: 1945,
  },
  {
    slug: "gran-dios-pan",
    title: "El gran dios Pan",
    author: "Arthur Machen",
    genre: "Terror",
    mood: "Inquietud",
    priceCents: 1290,
    cover: "/assets/covers/gran-dios-pan.jpg",
    accent: "#B07B9B",
    hook: "Horror antiguo que prefiere sugerir una puerta antes que mostrar lo que hay detrás.",
    description:
      "Una pieza breve de terror extraño, atmósfera decadente y consecuencias que se intuyen más de lo que se explican.",
    idealMoment: "Una noche silenciosa y con poca luz.",
    format: "Tapa blanda",
    year: 1894,
  },
];

export const MOODS = [...new Set(PRODUCTS.map((product) => product.mood))];
export const GENRES = [...new Set(PRODUCTS.map((product) => product.genre))];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}

