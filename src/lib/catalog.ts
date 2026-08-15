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
  coruNote: string;
  isbn?: string;
  affiliateUrl?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "hacia-rutas-salvajes", title: "Hacia rutas salvajes", author: "Jon Krakauer", genre: "Aventura", mood: "Libertad", priceCents: 1295,
    cover: "/assets/covers/hacia-rutas-salvajes.jpg", accent: "#F1D56A", format: "Bolsillo", year: 1996, pages: 304,
    hook: "Salir de la ruta marcada y descubrir cuánto pesa de verdad la libertad.",
    description: "Crónica, naturaleza y una búsqueda radical de sentido. Una aventura real que no idealiza del todo el precio de desaparecer.",
    idealMoment: "Cuando la rutina empieza a quedarte demasiado estrecha.", readingTime: "Varias noches", pace: "Envolvente", entry: "Viajar",
    creativeSpark: "Dibujar un mapa de los lugares a los que irías sin itinerario.",
    coruNote: "Yo te lo acercaría si necesitas aire, pero también una historia que cuestione la idea romántica de dejarlo todo.", isbn: "9788413141220",
  },
  {
    slug: "shogun", title: "Shōgun", author: "James Clavell", genre: "Aventura", mood: "Inmersión", priceCents: 1695,
    cover: "/assets/covers/shogun.jpg", accent: "#F1D56A", format: "Bolsillo", year: 1975, pages: 1216,
    hook: "Japón feudal, naufragio y aprendizaje en una aventura que pide vivir dentro de ella.",
    description: "Una novela épica de choque cultural, estrategia y transformación personal que convierte el viaje en una nueva forma de mirar.",
    idealMoment: "Unas vacaciones o una temporada con espacio para una historia larga.", readingTime: "Sin prisa", pace: "Intenso", entry: "Viajar",
    creativeSpark: "Imaginar qué norma cotidiana sería más difícil aprender en otro mundo.",
    coruNote: "La elegiría cuando no quieras visitar otro lugar, sino habitarlo durante semanas y aprender sus reglas desde cero.", isbn: "9788466376983",
  },
  {
    slug: "rosa-tibet", title: "La rosa del Tibet", author: "Lionel Davidson", genre: "Aventura", mood: "Asombro", priceCents: 1990,
    cover: "/assets/covers/rosa-tibet.jpg", accent: "#F1D56A", format: "Tapa blanda", year: 1962, pages: 384,
    hook: "Una expedición secreta para cuando necesitas que el mundo vuelva a parecer grande.",
    description: "Montañas, búsqueda y una promesa de lugar oculto. Aventura clásica con un pulso espiritual y geográfico poco frecuente.",
    idealMoment: "Un fin de semana con tiempo para desaparecer.", readingTime: "Varias noches", pace: "Envolvente", entry: "Viajar",
    creativeSpark: "Cartografiar un lugar que no existe.",
    coruNote: "Esta es mi puerta menos obvia del género: para quien quiere aventura clásica con un misterio que parece escondido en el paisaje.",
  },
  {
    slug: "imperio-final", title: "El imperio final", author: "Brandon Sanderson", genre: "Fantasía", mood: "Energía", priceCents: 1695,
    cover: "/assets/covers/imperio-final.jpg", accent: "#A7D8B0", format: "Bolsillo", year: 2006, pages: 672,
    hook: "Una rebelión imposible y un sistema de magia que hace avanzar cada decisión.",
    description: "Fantasía accesible, ritmo alto y un mundo construido con reglas claras. Una entrada eficaz a las grandes sagas contemporáneas.",
    idealMoment: "Cuando quieres recuperar las ganas de devorar páginas.", readingTime: "Sin prisa", pace: "Intenso", entry: "Viajar",
    creativeSpark: "Inventar un poder que solo funcione a cambio de perder algo pequeño.",
    coruNote: "Yo lo usaría como puerta de entrada a la fantasía moderna: es amplio, pero nunca te deja solo ante el mundo que construye.", isbn: "9788413149813",
  },
  {
    slug: "piranesi", title: "Piranesi", author: "Susanna Clarke", genre: "Fantasía", mood: "Extrañeza", priceCents: 1990,
    cover: "/assets/covers/piranesi.jpg", accent: "#A7D8B0", format: "Tapa blanda", year: 2020, pages: 272,
    hook: "Una casa infinita, mareas interiores y un habitante que todavía confía en el mundo.",
    description: "Misterio fantástico, arquitectura imposible y una voz luminosa. Breve, singular y más emocional de lo que su premisa sugiere.",
    idealMoment: "Cuando necesitas salir de lo conocido sin empezar una saga.", readingTime: "Varias noches", pace: "Envolvente", entry: "Crear",
    creativeSpark: "Diseñar una habitación que solo aparezca durante una marea.",
    coruNote: "Te lo sugeriría si quieres volver a sentir asombro sin ruido: su mundo es inmenso, pero la emoción permanece muy cerca.", isbn: "9788418363283",
  },
  {
    slug: "kalpa-imperial", title: "Kalpa Imperial", author: "Angélica Gorodischer", genre: "Fantasía", mood: "Asombro", priceCents: 1890,
    cover: "/assets/covers/kalpa-imperial.jpg", accent: "#A7D8B0", format: "Tapa blanda", year: 1983, pages: 304,
    hook: "Imperios, memoria y relatos que parecen llegar desde otra edad.",
    description: "Una fantasía literaria construida con voces, ruinas, poder y tiempo. No exige mapas ni sagas: pide imaginación.",
    idealMoment: "Noches en las que apetece escuchar una historia antigua.", readingTime: "Varias noches", pace: "Sereno", entry: "Crear",
    creativeSpark: "Inventar la leyenda de una ciudad desaparecida.",
    coruNote: "Es mi hallazgo para quien ya conoce la fantasía y quiere descubrir cuánto puede hacer el género sin repetir sus fórmulas.",
  },
  {
    slug: "nosotros-en-la-luna", title: "Nosotros en la luna", author: "Alice Kellen", genre: "Romance", mood: "Conexión", priceCents: 1095,
    cover: "/assets/covers/nosotros-en-la-luna.webp", accent: "#F56B50", format: "Bolsillo", year: 2020, pages: 480,
    hook: "Una noche en París y dos vidas que siguen encontrándose a pesar de la distancia.",
    description: "Romance contemporáneo sobre identidad, amistad y el paso del tiempo, con una voz cercana que facilita entrar y quedarse.",
    idealMoment: "Cuando quieres emoción reconocible y una lectura que avance sola.", readingTime: "Varias noches", pace: "Envolvente", entry: "Sentir",
    creativeSpark: "Escribir el correo que enviarías a alguien desde otra ciudad.",
    coruNote: "La pondría en tus manos si buscas un romance popular que no se limite al encuentro: también habla de aprender quién eres.", isbn: "9788408237389",
  },
  {
    slug: "seda", title: "Seda", author: "Alessandro Baricco", genre: "Romance", mood: "Delicadeza", priceCents: 1390,
    cover: "/assets/covers/seda.jpg", accent: "#F56B50", format: "Tapa blanda", year: 1996, pages: 128,
    hook: "Un deseo dicho con pocas palabras y una distancia que lo vuelve inolvidable.",
    description: "Una novela breve, musical y contenida sobre viaje, fascinación y aquello que apenas llega a suceder.",
    idealMoment: "Una tarde tranquila en la que quieras leer despacio.", readingTime: "Una tarde", pace: "Sereno", entry: "Sentir",
    creativeSpark: "Contar una emoción sin nombrarla directamente.",
    coruNote: "Yo la recomendaría cuando quieras intensidad sin exceso: termina pronto, pero deja mucho espacio después de la última frase.", isbn: "9788433908407",
  },
  {
    slug: "carta-desconocida", title: "Carta de una desconocida", author: "Stefan Zweig", genre: "Romance", mood: "Melancolía", priceCents: 1290,
    cover: "/assets/covers/carta-desconocida.jpg", accent: "#F56B50", format: "Tapa blanda", year: 1922, pages: 96,
    hook: "Una emoción contenida para leer de una vez y recordar durante días.",
    description: "Una confesión breve donde el amor, la memoria y la distancia pesan con una precisión casi física.",
    idealMoment: "Una noche tranquila, sin interrupciones.", readingTime: "Una tarde", pace: "Intenso", entry: "Sentir",
    creativeSpark: "Escribir una carta que nunca será enviada.",
    coruNote: "Es mi opción para quien quiere comprobar que un libro corto puede contener una vida emocional completa.",
  },
  {
    slug: "paciente-silenciosa", title: "La paciente silenciosa", author: "Alex Michaelides", genre: "Misterio", mood: "Tensión", priceCents: 1295,
    cover: "/assets/covers/paciente-silenciosa.jpg", accent: "#5B3C67", format: "Bolsillo", year: 2019, pages: 384,
    hook: "Un crimen, un silencio absoluto y un terapeuta decidido a encontrar una explicación.",
    description: "Thriller psicológico de capítulos ágiles y preguntas claras, diseñado para mantener la sospecha activa hasta el final.",
    idealMoment: "Cuando necesitas un libro que compita con el teléfono.", readingTime: "Varias noches", pace: "Intenso", entry: "Pensar",
    creativeSpark: "Anotar tres explicaciones distintas para un mismo silencio.",
    coruNote: "La elegiría para salir de un bloqueo lector: entra rápido, plantea pronto su enigma y sabe mantener la curiosidad.",
  },
  {
    slug: "camara-maravillas", title: "La cámara de las maravillas", author: "María Oruña", genre: "Misterio", mood: "Curiosidad", priceCents: 2290,
    cover: "/assets/covers/camara-maravillas.jpg", accent: "#5B3C67", format: "Tapa dura", year: 2026,
    hook: "Arte, objetos extraordinarios y un caso que convierte la investigación en viaje cultural.",
    description: "Misterio español contemporáneo con patrimonio, documentación y un sentido visual que amplía el placer de seguir las pistas.",
    idealMoment: "Cuando quieres intriga con lugares y conocimiento alrededor.", readingTime: "Sin prisa", pace: "Envolvente", entry: "Pensar",
    creativeSpark: "Crear una vitrina con tres objetos y el secreto que comparten.",
    coruNote: "Te la acercaría si el misterio te gusta más cuando cada pista abre también una puerta hacia el arte y la historia.",
  },
  {
    slug: "mr-ripley", title: "El talento de Mr. Ripley", author: "Patricia Highsmith", genre: "Misterio", mood: "Inquietud", priceCents: 1590,
    cover: "/assets/covers/mr-ripley.jpg", accent: "#5B3C67", format: "Tapa blanda", year: 1955, pages: 320,
    hook: "Sol, deseo y una identidad que empieza a deslizarse.",
    description: "Un thriller psicológico elegante y oscuro que convierte la fascinación en peligro sin necesidad de ruido.",
    idealMoment: "Para un viaje en el que quieres desconectar del entorno.", readingTime: "Varias noches", pace: "Envolvente", entry: "Pensar",
    creativeSpark: "Crear una identidad a partir de pequeñas mentiras.",
    coruNote: "Es mi sugerencia menos evidente del misterio: no corre detrás del crimen, te deja caminar dentro de una mente incómoda.",
  },
  {
    slug: "infinito-junco", title: "El infinito en un junco", author: "Irene Vallejo", genre: "Ensayo", mood: "Curiosidad", priceCents: 1395,
    cover: "/assets/covers/infinito-junco.jpg", accent: "#63B7C9", format: "Bolsillo", year: 2019, pages: 472,
    hook: "La historia de los libros contada como una aventura humana y cercana.",
    description: "Un recorrido por la invención, conservación y viaje de las palabras que combina investigación, memoria y placer narrativo.",
    idealMoment: "Cuando quieres aprender sin sentir que estás estudiando.", readingTime: "Sin prisa", pace: "Sereno", entry: "Pensar",
    creativeSpark: "Imaginar qué objeto cotidiano guardarías para dentro de mil años.",
    coruNote: "Yo lo elegiría para recordar por qué existen las librerías y por qué seguimos necesitando historias aunque cambien sus soportes.",
  },
  {
    slug: "utilidad-inutil", title: "La utilidad de lo inútil", author: "Nuccio Ordine", genre: "Ensayo", mood: "Claridad", priceCents: 1390,
    cover: "/assets/covers/utilidad-inutil.jpg", accent: "#63B7C9", format: "Tapa blanda", year: 2013, pages: 176,
    hook: "Una defensa de aquello que no produce beneficio inmediato, pero nos hace humanos.",
    description: "Un manifiesto accesible sobre cultura, educación y conocimiento para leer sin lenguaje académico innecesario.",
    idealMoment: "Cuando necesitas reconciliarte con aprender por placer.", readingTime: "Una tarde", pace: "Sereno", entry: "Pensar",
    creativeSpark: "Defender algo valioso que no puede medirse.",
    coruNote: "Te lo sugeriría cuando todo parece exigir productividad: es una defensa breve de hacer cosas porque ensanchan la vida.",
  },
  {
    slug: "historia-lectura", title: "Una historia de la lectura", author: "Alberto Manguel", genre: "Ensayo", mood: "Contemplación", priceCents: 2490,
    cover: "/assets/covers/historia-lectura.jpg", accent: "#63B7C9", format: "Tapa blanda", year: 1996, pages: 480,
    hook: "Un viaje ilustrado por las muchas maneras en que la humanidad ha leído.",
    description: "Historia cultural, memoria personal e imágenes para entender que leer siempre ha sido un gesto físico y social.",
    idealMoment: "Para consultar, subrayar y dejar abierto sobre la mesa.", readingTime: "Sin prisa", pace: "Sereno", entry: "Pensar",
    creativeSpark: "Dibujar tu autobiografía como lector.",
    coruNote: "Es mi hallazgo para quien quiere verse dentro de la historia de la lectura, no solo conocer fechas o acumular datos.",
  },
  {
    slug: "problema-tres-cuerpos", title: "El problema de los tres cuerpos", author: "Cixin Liu", genre: "Ciencia ficción", mood: "Asombro", priceCents: 1495,
    cover: "/assets/covers/problema-tres-cuerpos.jpg", accent: "#6FC6B1", format: "Bolsillo", year: 2008, pages: 416,
    hook: "Una señal enviada al universo y una idea capaz de cambiar la escala de todo.",
    description: "Ciencia ficción de grandes conceptos, misterio científico y perspectiva histórica que recompensa la atención con verdadero vértigo.",
    idealMoment: "Cuando quieres una idea que siga creciendo después de cerrar el libro.", readingTime: "Sin prisa", pace: "Envolvente", entry: "Pensar",
    creativeSpark: "Escribir el primer mensaje que enviarías a otra civilización.",
    coruNote: "Yo lo pondría delante de quien busca ciencia ficción que no sea solo decorado: aquí cada idea cambia la historia y nuestra posición en ella.", isbn: "9788413143415",
  },
  {
    slug: "proyecto-hail-mary", title: "Proyecto Hail Mary", author: "Andy Weir", genre: "Ciencia ficción", mood: "Ingenio", priceCents: 2390,
    cover: "/assets/covers/proyecto-hail-mary.jpg", accent: "#6FC6B1", format: "Tapa blanda", year: 2021, pages: 544,
    hook: "Un hombre despierta solo, lejos de la Tierra y con un problema que parece imposible.",
    description: "Supervivencia espacial, humor y resolución de problemas en una aventura científica muy accesible y emocional.",
    idealMoment: "Cuando quieres volver a disfrutar resolviendo cosas junto al protagonista.", readingTime: "Sin prisa", pace: "Intenso", entry: "Viajar",
    creativeSpark: "Resolver una emergencia usando solo tres objetos de tu habitación.",
    coruNote: "Te lo recomendaría si buscas una lectura popular que haga sentir inteligente sin convertir la ciencia en una barrera.", isbn: "9788418037016",
  },
  {
    slug: "estacion-transito", title: "Estación de tránsito", author: "Clifford D. Simak", genre: "Ciencia ficción", mood: "Contemplación", priceCents: 1690,
    cover: "/assets/covers/estacion-transito.jpg", accent: "#6FC6B1", format: "Tapa blanda", year: 1963, pages: 256,
    hook: "Una casa rural, visitantes imposibles y la ciencia ficción más hospitalaria.",
    description: "Una historia serena sobre soledad, contacto y confianza que imagina el futuro sin renunciar a la ternura.",
    idealMoment: "Cuando quieres amplitud sin estridencia.", readingTime: "Varias noches", pace: "Sereno", entry: "Volver",
    creativeSpark: "Imaginar el lugar de paso más improbable del universo.",
    coruNote: "Es mi hallazgo para demostrar que la ciencia ficción también puede sentirse como una casa encendida en mitad del campo.",
  },
  {
    slug: "peninsula-casas-vacias", title: "La península de las casas vacías", author: "David Uclés", genre: "Histórica", mood: "Memoria", priceCents: 2600,
    cover: "/assets/covers/peninsula-casas-vacias.jpg", accent: "#D3906F", format: "Tapa blanda", year: 2024, pages: 700,
    hook: "La Guerra Civil española atravesada por una imaginación que hace visible lo que la historia no alcanza.",
    description: "Una novela coral y ambiciosa en clave de realismo mágico, construida desde la memoria, el territorio y una voz propia.",
    idealMoment: "Cuando quieres entregarte a una historia grande y conversar con ella.", readingTime: "Sin prisa", pace: "Envolvente", entry: "Pensar",
    creativeSpark: "Contar un recuerdo familiar haciendo visible una emoción imposible.",
    coruNote: "La elegiría como gran novela española del catálogo: exige tiempo, pero devuelve imágenes y preguntas que no se parecen a otras.", isbn: "9788419942319",
  },
  {
    slug: "hamnet", title: "Hamnet", author: "Maggie O’Farrell", genre: "Histórica", mood: "Duelo", priceCents: 2395,
    cover: "/assets/covers/hamnet.jpg", accent: "#D3906F", format: "Tapa blanda", year: 2020, pages: 350,
    hook: "Una familia, una pérdida y la vida que existió al margen del nombre de Shakespeare.",
    description: "Ficción histórica íntima y sensorial que recupera a quienes quedaron fuera del foco para hablar de amor, cuerpo y ausencia.",
    idealMoment: "Cuando puedes entrar en una emoción difícil sin necesidad de resolverla.", readingTime: "Varias noches", pace: "Sereno", entry: "Sentir",
    creativeSpark: "Describir una ausencia mediante los sonidos de una casa.",
    coruNote: "Yo la sugeriría si buscas historia desde lo íntimo: no convierte una época en decorado, la deja respirar dentro de una familia.", isbn: "9788417977580",
  },
  {
    slug: "samurai", title: "El samurái", author: "Shūsaku Endō", genre: "Histórica", mood: "Contemplación", priceCents: 1990,
    cover: "/assets/covers/samurai.jpg", accent: "#D3906F", format: "Tapa blanda", year: 1980, pages: 320,
    hook: "Un viaje entre Japón, Nueva España y Roma narrado desde el silencio y la lealtad.",
    description: "Historia, choque cultural y fe en una novela de desplazamiento interior tan importante como el geográfico.",
    idealMoment: "Cuando quieres viajar despacio y mirar con atención.", readingTime: "Sin prisa", pace: "Sereno", entry: "Viajar",
    creativeSpark: "Trazar una ruta que transforme a quien la recorre.",
    coruNote: "Es mi elección secreta del género: un viaje enorme contado con una voz silenciosa, humana y poco complaciente.",
  },
  {
    slug: "nuestra-parte-noche", title: "Nuestra parte de noche", author: "Mariana Enríquez", genre: "Terror", mood: "Oscuridad", priceCents: 2490,
    cover: "/assets/covers/nuestra-parte-noche.jpg", accent: "#B07B9B", format: "Tapa blanda", year: 2019, pages: 672,
    hook: "Un padre y un hijo huyen de una herencia donde el poder y el horror comparten raíces.",
    description: "Terror político, familiar y sobrenatural en una novela amplia que convierte la oscuridad en un mundo completo.",
    idealMoment: "Cuando quieres una historia intensa que no se agote en el susto.", readingTime: "Sin prisa", pace: "Intenso", entry: "Sentir",
    creativeSpark: "Inventar la regla principal de una sociedad secreta.",
    coruNote: "Yo la elegiría si quieres saber hasta dónde puede crecer el terror cuando tiene historia, vínculos y una voz literaria propia.", isbn: "9788433998859",
  },
  {
    slug: "cadaver-exquisito", title: "Cadáver exquisito", author: "Agustina Bazterrica", genre: "Terror", mood: "Desasosiego", priceCents: 1890,
    cover: "/assets/covers/cadaver-exquisito.jpg", accent: "#B07B9B", format: "Tapa blanda", year: 2017, pages: 256,
    hook: "Una sociedad que normaliza lo impensable y obliga a mirar de frente sus propias palabras.",
    description: "Distopía breve, incómoda y directa sobre consumo, lenguaje y deshumanización. No necesita ocultar su idea para perturbar.",
    idealMoment: "Cuando buscas una lectura provocadora y puedes tolerar su dureza.", readingTime: "Varias noches", pace: "Intenso", entry: "Pensar",
    creativeSpark: "Cambiar una palabra cotidiana y observar cómo altera una sociedad.",
    coruNote: "No te la sugeriría para desconectar. Sí cuando quieras un libro que incomode con una idea clara y te obligue a discutirla.",
  },
  {
    slug: "sauces", title: "Los sauces", author: "Algernon Blackwood", genre: "Terror", mood: "Inquietud", priceCents: 1190,
    cover: "/assets/covers/sauces.jpg", accent: "#B07B9B", format: "Tapa blanda", year: 1907, pages: 112,
    hook: "Un río, una isla y la sensación de haber acampado en el lugar equivocado.",
    description: "Una narración breve de naturaleza extraña donde el paisaje observa y la amenaza nunca necesita explicarse.",
    idealMoment: "Una tarde gris cerca de una ventana.", readingTime: "Una tarde", pace: "Envolvente", entry: "Sentir",
    creativeSpark: "Describir un paisaje como si tuviera intención.",
    coruNote: "Es mi hallazgo de terror para quien prefiere que el miedo nazca del paisaje y continúe creciendo sin mostrarlo todo.",
  },
];

// Editorial guests rotate independently from the fixed 24-book catalogue.
export const CORU_PICKS: Product[] = [
  {
    slug: "libreria-livingstone", title: "La librería del señor Livingstone", author: "Mónica Gutiérrez", genre: "Romance", mood: "Calidez", priceCents: 1790,
    cover: "/assets/covers/libreria-livingstone.jpg", accent: "#F56B50", format: "Tapa blanda", year: 2019, pages: 320,
    hook: "Una librería londinense y personajes a los que apetece volver.",
    description: "Una historia amable sobre segundas oportunidades, conversación y la sensación de encontrar refugio entre libros.",
    idealMoment: "Cuando necesitas que una historia te reciba.", readingTime: "Varias noches", pace: "Sereno", entry: "Volver",
    creativeSpark: "Diseñar el rincón perfecto para una conversación.",
    coruNote: "La dejaría unas semanas en mi balda porque entiende algo esencial de CoruKai: una librería también puede sentirse como un lugar al que volver.",
  },
  {
    slug: "infraordinario", title: "Lo infraordinario", author: "Georges Perec", genre: "Ensayo", mood: "Claridad", priceCents: 1490,
    cover: "/assets/covers/infraordinario.jpg", accent: "#63B7C9", format: "Tapa blanda", year: 1989, pages: 128,
    hook: "Aprender a mirar lo cotidiano hasta que vuelva a ser extraño.",
    description: "Textos breves que convierten calles, objetos y hábitos en materia de observación y juego creativo.",
    idealMoment: "Una mañana lenta con un cuaderno cerca.", readingTime: "Una tarde", pace: "Sereno", entry: "Crear",
    creativeSpark: "Inventariar todo lo que ocurre mientras no ocurre nada.",
    coruNote: "Es mi invitado para las almas creativas y para quienes creen que no lo son: demuestra que una mirada atenta ya es una forma de crear.",
  },
  {
    slug: "mas-que-humano", title: "Más que humano", author: "Theodore Sturgeon", genre: "Ciencia ficción", mood: "Asombro", priceCents: 1690,
    cover: "/assets/covers/mas-que-humano.jpg", accent: "#6FC6B1", format: "Tapa blanda", year: 1953, pages: 256,
    hook: "Personas incompletas que juntas pueden convertirse en algo nuevo.",
    description: "Ciencia ficción humana y extraña sobre identidad, evolución y pertenencia, escrita desde la fragilidad.",
    idealMoment: "Cuando quieres ideas grandes con personajes cercanos.", readingTime: "Varias noches", pace: "Envolvente", entry: "Pensar",
    creativeSpark: "Diseñar una inteligencia hecha de talentos imperfectos.",
    coruNote: "Lo elijo temporalmente porque convierte una gran idea de ciencia ficción en una pregunta íntima: qué aparece cuando dejamos de estar solos.",
  },
];

export const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...CORU_PICKS];

export const MOODS = [...new Set(PRODUCTS.map((product) => product.mood))];
export const GENRES = [...new Set(PRODUCTS.map((product) => product.genre))];
export const READING_TIMES = [...new Set(PRODUCTS.map((product) => product.readingTime))];
export const READING_PACES = [...new Set(PRODUCTS.map((product) => product.pace))];
export const STORY_ENTRIES = [...new Set(PRODUCTS.map((product) => product.entry))];

export function getProduct(slug: string) {
  return ALL_PRODUCTS.find((product) => product.slug === slug);
}

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(priceCents / 100);
}
