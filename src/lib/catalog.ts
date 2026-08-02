export type ReadingTime = "Una tarde" | "Varias noches" | "Sin prisa";
export type ReadingPace = "Sereno" | "Envolvente" | "Intenso";
export type StoryEntry = "Volver" | "Viajar" | "Sentir" | "Pensar" | "Crear";

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
  readingTime: ReadingTime;
  pace: ReadingPace;
  entry: StoryEntry;
  pages?: number;
  creativeSpark: string;
  isbn?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "rosa-tibet", title: "La rosa del Tibet", author: "Lionel Davidson",
    genre: "Aventura", mood: "Asombro", priceCents: 1990,
    cover: "/assets/covers/rosa-tibet.jpg", accent: "#F1D56A",
    hook: "Una expedición secreta para cuando necesitas que el mundo vuelva a parecer grande.",
    description: "Montañas, búsqueda y una promesa de lugar oculto. Aventura clásica con un pulso espiritual y geográfico poco frecuente.",
    idealMoment: "Un fin de semana con tiempo para desaparecer.", format: "Tapa blanda", year: 1962,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Viajar", pages: 384,
    creativeSpark: "Cartografiar un lugar que no existe.",
  },
  {
    slug: "abisinio", title: "El abisinio", author: "Jean-Christophe Rufin",
    genre: "Aventura", mood: "Curiosidad", priceCents: 2290,
    cover: "/assets/covers/abisinio.jpg", accent: "#F1D56A",
    hook: "Diplomacia, desierto y viaje para lectores que prefieren la aventura con contexto.",
    description: "Una novela histórica luminosa que cruza culturas, medicina, política y descubrimiento sin perder el sentido del viaje.",
    idealMoment: "Cuando quieres una aventura larga pero hospitalaria.", format: "Tapa blanda", year: 1997,
    readingTime: "Sin prisa", pace: "Envolvente", entry: "Viajar", pages: 512,
    creativeSpark: "Mirar una frontera desde los dos lados.",
  },
  {
    slug: "vendaval-jamaica", title: "Un vendaval en Jamaica", author: "Richard Hughes",
    genre: "Aventura", mood: "Inquietud", priceCents: 1490,
    cover: "/assets/covers/vendaval-jamaica.jpg", accent: "#F1D56A",
    hook: "Piratas e infancia en una aventura mucho más extraña de lo que parece.",
    description: "Un clásico breve que empieza como relato marino y se vuelve una observación psicológica difícil de olvidar.",
    idealMoment: "Una tarde de viento y curiosidad.", format: "Tapa blanda", year: 1929,
    readingTime: "Una tarde", pace: "Intenso", entry: "Viajar", pages: 224,
    creativeSpark: "Reescribir una aventura desde una mirada inesperada.",
  },
  {
    slug: "kalpa-imperial", title: "Kalpa Imperial", author: "Angélica Gorodischer",
    genre: "Fantasía", mood: "Asombro", priceCents: 1890,
    cover: "/assets/covers/kalpa-imperial.jpg", accent: "#A7D8B0",
    hook: "Imperios, memoria y relatos que parecen llegar desde otra edad.",
    description: "Una fantasía literaria construida con voces, ruinas, poder y tiempo. No exige mapas ni sagas: pide imaginación.",
    idealMoment: "Noches en las que apetece escuchar una historia antigua.", format: "Tapa blanda", year: 1983,
    readingTime: "Varias noches", pace: "Sereno", entry: "Crear", pages: 304,
    creativeSpark: "Inventar la leyenda de una ciudad desaparecida.",
  },
  {
    slug: "lud-in-the-mist", title: "Lud-in-the-Mist", author: "Hope Mirrlees",
    genre: "Fantasía", mood: "Extrañeza", priceCents: 1790,
    cover: "/assets/covers/lud-in-the-mist.jpg", accent: "#A7D8B0",
    hook: "Una ciudad imposible y una frontera inquietante con lo feérico.",
    description: "Ley, deseo y fruta mágica en una rareza fantástica con perfume antiguo y una sorprendente modernidad.",
    idealMoment: "Cuando quieres fantasía sin fórmulas.", format: "Tapa blanda", year: 1926,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Crear", pages: 288,
    creativeSpark: "Dar una regla absurda a una ciudad perfectamente seria.",
  },
  {
    slug: "espada-rota", title: "La espada rota", author: "Poul Anderson",
    genre: "Fantasía", mood: "Intensidad", priceCents: 1690,
    cover: "/assets/covers/espada-rota.jpg", accent: "#A7D8B0",
    hook: "Mitología nórdica, destino trágico y una energía de saga antigua.",
    description: "Una fantasía compacta y afilada para quien busca mitos, conflicto y consecuencias reales.",
    idealMoment: "Cuando quieres una historia que no se detenga.", format: "Tapa blanda", year: 1954,
    readingTime: "Varias noches", pace: "Intenso", entry: "Viajar", pages: 272,
    creativeSpark: "Crear un objeto con un precio imposible.",
  },
  {
    slug: "carta-desconocida", title: "Carta de una desconocida", author: "Stefan Zweig",
    genre: "Romance", mood: "Melancolía", priceCents: 1290,
    cover: "/assets/covers/carta-desconocida.jpg", accent: "#F56B50",
    hook: "Una emoción contenida para leer de una vez y recordar durante días.",
    description: "Una confesión breve donde el amor, la memoria y la distancia pesan con una precisión casi física.",
    idealMoment: "Una noche tranquila, sin interrupciones.", format: "Tapa blanda", year: 1922,
    readingTime: "Una tarde", pace: "Intenso", entry: "Sentir", pages: 96,
    creativeSpark: "Escribir una carta que nunca será enviada.",
  },
  {
    slug: "final-affaire", title: "El final del affaire", author: "Graham Greene",
    genre: "Romance", mood: "Melancolía", priceCents: 1590,
    cover: "/assets/covers/final-affaire.jpg", accent: "#F56B50",
    hook: "Amor, celos y fe para quien acepta que una historia íntima también puede ser un misterio.",
    description: "Un vínculo observado desde la pérdida y la contradicción, escrito con una tensión moral poco complaciente.",
    idealMoment: "Una noche de lluvia y preguntas difíciles.", format: "Tapa blanda", year: 1951,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Sentir", pages: 256,
    creativeSpark: "Narrar una ausencia a través de cinco objetos.",
  },
  {
    slug: "libreria-livingstone", title: "La librería del señor Livingstone", author: "Mónica Gutiérrez",
    genre: "Romance", mood: "Calidez", priceCents: 1790,
    cover: "/assets/covers/libreria-livingstone.jpg", accent: "#F56B50",
    hook: "Una librería londinense y personajes a los que apetece volver.",
    description: "Una historia amable sobre segundas oportunidades, conversación y la sensación de encontrar refugio entre libros.",
    idealMoment: "Cuando necesitas que una historia te reciba.", format: "Tapa blanda", year: 2019,
    readingTime: "Varias noches", pace: "Sereno", entry: "Volver", pages: 320,
    creativeSpark: "Diseñar el rincón perfecto para una conversación.",
  },
  {
    slug: "mr-ripley", title: "El talento de Mr. Ripley", author: "Patricia Highsmith",
    genre: "Misterio", mood: "Inquietud", priceCents: 1590,
    cover: "/assets/covers/mr-ripley.jpg", accent: "#5B3C67",
    hook: "Sol, deseo y una identidad que empieza a deslizarse.",
    description: "Un thriller psicológico elegante y oscuro que convierte la fascinación en peligro sin necesidad de ruido.",
    idealMoment: "Para un viaje en el que quieres desconectar del entorno.", format: "Tapa blanda", year: 1955,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Pensar", pages: 320,
    creativeSpark: "Crear una identidad a partir de pequeñas mentiras.",
  },
  {
    slug: "cripta-embrujada", title: "El misterio de la cripta embrujada", author: "Eduardo Mendoza",
    genre: "Misterio", mood: "Curiosidad", priceCents: 1290,
    cover: "/assets/covers/cripta-embrujada.jpg", accent: "#5B3C67",
    hook: "Un caso imposible contado con humor, suciedad y una lógica completamente propia.",
    description: "Misterio urbano y sátira barcelonesa para entrar al género sin solemnidad ni detectives impecables.",
    idealMoment: "Una tarde en la que quieres intriga y aire.", format: "Tapa blanda", year: 1979,
    readingTime: "Una tarde", pace: "Intenso", entry: "Volver", pages: 208,
    creativeSpark: "Resolver un caso con la peor pista posible.",
  },
  {
    slug: "promesa", title: "La promesa", author: "Friedrich Dürrenmatt",
    genre: "Misterio", mood: "Inquietud", priceCents: 1490,
    cover: "/assets/covers/promesa.jpg", accent: "#5B3C67",
    hook: "Una investigación que se convierte en obsesión y cuestiona el consuelo de los finales perfectos.",
    description: "Una novela policiaca breve y filosófica sobre azar, método y el precio de necesitar una respuesta.",
    idealMoment: "Cuando quieres un misterio que siga pensando después de ti.", format: "Tapa blanda", year: 1958,
    readingTime: "Una tarde", pace: "Intenso", entry: "Pensar", pages: 192,
    creativeSpark: "Construir una historia donde el azar sea un personaje.",
  },
  {
    slug: "utilidad-inutil", title: "La utilidad de lo inútil", author: "Nuccio Ordine",
    genre: "Ensayo", mood: "Claridad", priceCents: 1390,
    cover: "/assets/covers/utilidad-inutil.jpg", accent: "#63B7C9",
    hook: "Una defensa de aquello que no produce beneficio inmediato, pero nos hace humanos.",
    description: "Un manifiesto accesible sobre cultura, educación y conocimiento para leer sin lenguaje académico innecesario.",
    idealMoment: "Cuando necesitas reconciliarte con aprender por placer.", format: "Tapa blanda", year: 2013,
    readingTime: "Una tarde", pace: "Sereno", entry: "Pensar", pages: 176,
    creativeSpark: "Defender algo valioso que no puede medirse.",
  },
  {
    slug: "historia-lectura", title: "Una historia de la lectura", author: "Alberto Manguel",
    genre: "Ensayo", mood: "Curiosidad", priceCents: 2490,
    cover: "/assets/covers/historia-lectura.jpg", accent: "#63B7C9",
    hook: "Un viaje ilustrado por las muchas maneras en que la humanidad ha leído.",
    description: "Historia cultural, memoria personal e imágenes para entender que leer siempre ha sido un gesto físico y social.",
    idealMoment: "Para consultar, subrayar y dejar abierto sobre la mesa.", format: "Tapa blanda", year: 1996,
    readingTime: "Sin prisa", pace: "Sereno", entry: "Pensar", pages: 480,
    creativeSpark: "Dibujar tu autobiografía como lector.",
  },
  {
    slug: "infraordinario", title: "Lo infraordinario", author: "Georges Perec",
    genre: "Ensayo", mood: "Claridad", priceCents: 1490,
    cover: "/assets/covers/infraordinario.jpg", accent: "#63B7C9",
    hook: "Aprender a mirar lo cotidiano hasta que vuelva a ser extraño.",
    description: "Textos breves que convierten calles, objetos y hábitos en materia de observación y juego creativo.",
    idealMoment: "Una mañana lenta con un cuaderno cerca.", format: "Tapa blanda", year: 1989,
    readingTime: "Una tarde", pace: "Sereno", entry: "Crear", pages: 128,
    creativeSpark: "Inventariar todo lo que ocurre mientras no ocurre nada.",
  },
  {
    slug: "mas-que-humano", title: "Más que humano", author: "Theodore Sturgeon",
    genre: "Ciencia ficción", mood: "Asombro", priceCents: 1690,
    cover: "/assets/covers/mas-que-humano.jpg", accent: "#6FC6B1",
    hook: "Personas incompletas que juntas pueden convertirse en algo nuevo.",
    description: "Ciencia ficción humana y extraña sobre identidad, evolución y pertenencia, escrita desde la fragilidad.",
    idealMoment: "Cuando quieres ideas grandes con personajes cercanos.", format: "Tapa blanda", year: 1953,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Pensar", pages: 256,
    creativeSpark: "Diseñar una inteligencia hecha de talentos imperfectos.",
  },
  {
    slug: "estacion-transito", title: "Estación de tránsito", author: "Clifford D. Simak",
    genre: "Ciencia ficción", mood: "Contemplación", priceCents: 1690,
    cover: "/assets/covers/estacion-transito.jpg", accent: "#6FC6B1",
    hook: "Una casa rural, visitantes imposibles y la ciencia ficción más hospitalaria.",
    description: "Una historia serena sobre soledad, contacto y confianza que imagina el futuro sin renunciar a la ternura.",
    idealMoment: "Cuando quieres amplitud sin estridencia.", format: "Tapa blanda", year: 1963,
    readingTime: "Varias noches", pace: "Sereno", entry: "Volver", pages: 256,
    creativeSpark: "Imaginar el lugar de paso más improbable del universo.",
  },
  {
    slug: "juicio-final", title: "El libro del día del juicio final", author: "Connie Willis",
    genre: "Ciencia ficción", mood: "Intensidad", priceCents: 2190,
    cover: "/assets/covers/juicio-final.jpg", accent: "#6FC6B1",
    hook: "Viajes en el tiempo donde la historia pesa más que la tecnología.",
    description: "Una investigación temporal emocionante y humana que enlaza epidemias, conocimiento y vínculos inesperados.",
    idealMoment: "Un puente largo para entregarte a otra época.", format: "Tapa blanda", year: 1992,
    readingTime: "Sin prisa", pace: "Intenso", entry: "Viajar", pages: 608,
    creativeSpark: "Enviar un objeto cotidiano a la época equivocada.",
  },
  {
    slug: "puente-drina", title: "Un puente sobre el Drina", author: "Ivo Andrić",
    genre: "Histórica", mood: "Contemplación", priceCents: 2190,
    cover: "/assets/covers/puente-drina.jpg", accent: "#D3906F",
    hook: "Siglos de vida observados desde un puente que permanece.",
    description: "Una novela coral sobre comunidad, memoria y cambio. Exige calma y devuelve perspectiva.",
    idealMoment: "Un periodo de lectura lento y sin objetivos.", format: "Tapa blanda", year: 1945,
    readingTime: "Sin prisa", pace: "Sereno", entry: "Pensar", pages: 448,
    creativeSpark: "Contar un siglo desde la mirada de un lugar.",
  },
  {
    slug: "hija-capitan", title: "La hija del capitán", author: "Aleksandr Pushkin",
    genre: "Histórica", mood: "Esperanza", priceCents: 1390,
    cover: "/assets/covers/hija-capitan.jpg", accent: "#D3906F",
    hook: "Honor, rebelión y amor en una historia histórica que avanza con ligereza.",
    description: "Un clásico accesible, íntimo y aventurero sobre crecer mientras el mundo alrededor pierde el equilibrio.",
    idealMoment: "Para volver a los clásicos sin sentir distancia.", format: "Tapa blanda", year: 1836,
    readingTime: "Una tarde", pace: "Intenso", entry: "Viajar", pages: 192,
    creativeSpark: "Escribir un juramento que cambie una decisión.",
  },
  {
    slug: "samurai", title: "El samurái", author: "Shūsaku Endō",
    genre: "Histórica", mood: "Contemplación", priceCents: 1990,
    cover: "/assets/covers/samurai.jpg", accent: "#D3906F",
    hook: "Un viaje entre Japón, Nueva España y Roma narrado desde el silencio y la lealtad.",
    description: "Historia, choque cultural y fe en una novela de desplazamiento interior tan importante como el geográfico.",
    idealMoment: "Cuando quieres viajar despacio y mirar con atención.", format: "Tapa blanda", year: 1980,
    readingTime: "Sin prisa", pace: "Sereno", entry: "Viajar", pages: 320,
    creativeSpark: "Trazar una ruta que transforme a quien la recorre.",
  },
  {
    slug: "gran-dios-pan", title: "El gran dios Pan", author: "Arthur Machen",
    genre: "Terror", mood: "Inquietud", priceCents: 1290,
    cover: "/assets/covers/gran-dios-pan.jpg", accent: "#B07B9B",
    hook: "Horror antiguo que prefiere sugerir una puerta antes que mostrar lo que hay detrás.",
    description: "Una pieza breve de terror extraño, atmósfera decadente y consecuencias que se intuyen más de lo que se explican.",
    idealMoment: "Una noche silenciosa y con poca luz.", format: "Tapa blanda", year: 1894,
    readingTime: "Una tarde", pace: "Intenso", entry: "Sentir", pages: 128,
    creativeSpark: "Dibujar la puerta que nadie debería abrir.",
  },
  {
    slug: "casa-confin", title: "La casa en el confín de la Tierra", author: "William Hope Hodgson",
    genre: "Terror", mood: "Extrañeza", priceCents: 1590,
    cover: "/assets/covers/casa-confin.jpg", accent: "#B07B9B",
    hook: "Una casa aislada asomada a algo demasiado grande para comprenderlo.",
    description: "Terror cósmico, manuscrito encontrado y visiones imposibles en un clásico de imaginación desbordada.",
    idealMoment: "Una noche larga en la que quieras perder pie.", format: "Tapa blanda", year: 1908,
    readingTime: "Varias noches", pace: "Envolvente", entry: "Crear", pages: 240,
    creativeSpark: "Diseñar una casa con una habitación fuera del mundo.",
  },
  {
    slug: "sauces", title: "Los sauces", author: "Algernon Blackwood",
    genre: "Terror", mood: "Inquietud", priceCents: 1190,
    cover: "/assets/covers/sauces.jpg", accent: "#B07B9B",
    hook: "Un río, una isla y la sensación de haber acampado en el lugar equivocado.",
    description: "Una narración breve de naturaleza extraña donde el paisaje observa y la amenaza nunca necesita explicarse.",
    idealMoment: "Una tarde gris cerca de una ventana.", format: "Tapa blanda", year: 1907,
    readingTime: "Una tarde", pace: "Envolvente", entry: "Sentir", pages: 112,
    creativeSpark: "Describir un paisaje como si tuviera intención.",
  },
];

export const MOODS = [...new Set(PRODUCTS.map((product) => product.mood))];
export const GENRES = [...new Set(PRODUCTS.map((product) => product.genre))];
export const READING_TIMES = [...new Set(PRODUCTS.map((product) => product.readingTime))];
export const READING_PACES = [...new Set(PRODUCTS.map((product) => product.pace))];
export const STORY_ENTRIES = [...new Set(PRODUCTS.map((product) => product.entry))];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}
