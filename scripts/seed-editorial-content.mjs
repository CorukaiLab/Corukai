import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-04" });

const articles = [
  ["que-leer-cuando-necesitas-bajar-el-ruido", "Qué leer cuando necesitas bajar el ruido", "Guía", "Una forma de elegir lecturas serenas sin confundir calma con falta de intensidad.", ["seda", "estacion-transito", "siddhartha"], [
    ["h2", "No busques un libro que te arregle"],
    ["normal", "Hay días en los que incluso una buena recomendación pesa. En ese momento no necesitas una lista infinita, sino una voz que no compita con todo lo demás. Una lectura serena puede sostener la atención sin exigir una versión más productiva de ti."],
    ["normal", "Busca frases con aire, escenas que permitan detenerse y una extensión que no convierta cada pausa en culpa. La calma de un libro no depende de que ocurran pocas cosas, sino de que su ritmo te deje permanecer dentro."],
    ["h2", "Tres señales útiles"],
    ["normal", "Una prosa que puedas releer sin perder el hilo, capítulos que admitan descansos y una atmósfera a la que quieras volver. Si hoy solo puedes leer diez páginas, el libro adecuado seguirá esperándote mañana sin reproches."],
  ]],
  ["libros-para-volver-a-sentir-curiosidad", "Libros para volver a sentir curiosidad", "Selección", "Historias que abren una pregunta antes de ofrecer una respuesta.", ["piranesi", "problema-tres-cuerpos", "infinito-junco"], [
    ["h2", "La curiosidad no se fuerza"],
    ["normal", "A veces dejamos de leer porque elegimos desde el deber. Un libro curioso hace lo contrario: coloca una puerta entreabierta y permite que seas tú quien decida cruzarla. No promete convertirte en experto; te devuelve las ganas de mirar."],
    ["normal", "Los mundos extraños, las ideas inesperadas y las historias sobre el origen de los libros funcionan bien porque cambian la escala de lo cotidiano. Una habitación, una pregunta científica o un objeto antiguo pueden volver a sentirse nuevos."],
    ["h2", "Elige por la pregunta"],
    ["normal", "Antes de leer la sinopsis completa, pregúntate qué misterio te gustaría acompañar durante unos días. La mejor elección no siempre es la más famosa: es la que deja una pequeña incomodidad fértil en la cabeza."],
  ]],
  ["historias-breves-para-recuperar-el-habito", "Historias breves para recuperar el hábito", "Ritual", "Volver a leer no exige una hazaña: necesita un libro que quepa en tu vida real.", ["mendel-libros", "carta-desconocida", "sauces"], [
    ["h2", "Haz pequeño el comienzo"],
    ["normal", "Recuperar el hábito suele fallar cuando intentamos recuperar también nuestra mejor marca. La lectura no necesita una racha. Necesita un lugar, un momento posible y una historia que avance incluso cuando solo dispones de un cuarto de hora."],
    ["normal", "Las novelas cortas y los relatos permiten completar un arco sin sacrificar densidad. Terminar uno devuelve una sensación importante: no la de haber cumplido, sino la de haber vivido algo entero."],
    ["h2", "Un ritual que sí cabe"],
    ["normal", "Deja el teléfono fuera del alcance, abre el libro antes de sentirte preparado y detente cuando todavía queden ganas. Esa pequeña reserva convierte la siguiente sesión en una invitación, no en una obligación."],
  ]],
  ["leer-cuando-no-sabes-que-te-pasa", "Leer cuando no sabes qué te pasa", "Carta", "No siempre hace falta nombrar una emoción para encontrar una historia que la acompañe.", ["hamnet", "nosotros-en-la-luna", "paciente-silenciosa"], [
    ["h2", "Empieza por la sensación"],
    ["normal", "Los géneros ordenan librerías, pero no siempre ordenan días. Puedes no saber si buscas romance, misterio o memoria y, sin embargo, reconocer que necesitas delicadeza, tensión o una forma de duelo compartido."],
    ["normal", "Elegir desde una sensación no convierte al libro en medicina. Solo reconoce que leemos con el cuerpo y con el momento. La misma historia puede resultar inaccesible hoy y necesaria dentro de un año."],
    ["h2", "Date permiso para abandonar"],
    ["normal", "Si después de unas páginas la voz no te encuentra, cerrar el libro también es una decisión lectora. No has fallado. Has aprendido algo sobre lo que necesitas ahora, y esa información hace más precisa la siguiente elección."],
  ]],
  ["cinco-puertas-para-viajar-sin-salir", "Cinco puertas para viajar sin salir", "Selección", "Viajes físicos, históricos y mentales para cambiar de escala desde casa.", ["hacia-rutas-salvajes", "shogun", "ciudad-bestias", "samurai"], [
    ["h2", "Viajar también es cambiar de reglas"],
    ["normal", "Un buen viaje literario no se limita a describir un paisaje. Modifica lo que el personaje puede hacer, obliga a aprender códigos nuevos y convierte cada decisión cotidiana en una prueba de atención."],
    ["normal", "Puedes viajar hacia una naturaleza inmensa, una sociedad lejana, una expedición o una época que altera todas las certezas. Lo importante es que el lugar tenga consecuencias y no funcione como simple decorado."],
    ["h2", "Escoge la distancia adecuada"],
    ["normal", "Si necesitas energía, elige una travesía exterior. Si buscas perspectiva, entra en otro momento histórico. Y si hoy no quieres velocidad, busca un viaje interior donde el movimiento ocurra en la mirada."],
  ]],
  ["libros-que-dejan-ganas-de-crear", "Libros que dejan ganas de crear", "Guía", "Lecturas que no terminan en la última página porque dejan una imagen, una pregunta o un gesto.", ["kalpa-imperial", "imperio-final", "historia-lectura"], [
    ["h2", "Crear no es copiar la trama"],
    ["normal", "Una lectura fértil no te obliga a escribir una novela. Puede hacer que dibujes una habitación, inventes una regla para un mundo, anotes una frase propia o mires de otra manera el camino habitual."],
    ["normal", "La imaginación aparece cuando el libro deja huecos. Los sistemas demasiado cerrados impresionan; los que conservan un margen de misterio invitan a participar. Busca historias que sugieran más mundo del que muestran."],
    ["h2", "Guarda una chispa"],
    ["normal", "Al cerrar el libro, escribe una sola cosa que todavía no entiendas. No la resuelvas. Déjala cerca. Las ideas más personales suelen crecer alrededor de preguntas que aceptamos conservar durante un tiempo."],
  ]],
  ["como-elegir-un-libro-sin-mirar-rankings", "Cómo elegir un libro sin mirar rankings", "Guía", "Un método breve para sustituir la presión de lo popular por señales que sí hablan de ti.", ["utilidad-inutil", "mr-ripley", "nuestra-parte-noche"], [
    ["h2", "Un ranking responde otra pregunta"],
    ["normal", "Las listas de ventas explican qué compró mucha gente, no qué te conviene leer hoy. Son una señal de conversación pública, pero no miden la afinidad entre una voz, un ritmo y tu momento."],
    ["normal", "Prueba con tres filtros: qué sensación buscas, cuánto espacio mental tienes y qué tipo de entrada prefieres. Pensar, viajar, sentir, crear o simplemente volver son decisiones más útiles que perseguir una posición."],
    ["h2", "Lee una página, no veinte reseñas"],
    ["normal", "La voz del libro es la evidencia principal. Una página puede revelar si el ritmo te recibe o te expulsa. Las reseñas ayudan después, cuando necesitas contexto; no deberían sustituir el primer encuentro."],
  ]],
  ["una-biblioteca-para-dias-dificiles", "Una biblioteca para días difíciles", "Carta", "Lecturas que acompañan sin fingir que todo tiene una solución rápida.", ["conquista-felicidad", "hamnet", "siddhartha"], [
    ["h2", "Acompañar no es distraer"],
    ["normal", "En un día difícil, un libro puede ofrecer distancia o compañía. Ninguna de las dos opciones es superior. A veces necesitas salir de ti; otras, encontrar palabras que no simplifiquen lo que estás viviendo."],
    ["normal", "Evita las promesas de transformación instantánea. Busca una inteligencia amable: una voz capaz de sostener contradicciones, reconocer el dolor y seguir dejando sitio para la belleza o el humor."],
    ["h2", "Construye una balda de emergencia"],
    ["normal", "Guarda tres libros distintos: uno breve, uno conocido al que puedas volver y uno que abra una perspectiva nueva. No tienen que resolver nada. Basta con que hagan el tiempo un poco más habitable."],
  ]],
  ["que-hace-que-un-libro-se-quede-contigo", "Qué hace que un libro se quede contigo", "Carta", "La memoria lectora no siempre conserva la trama; a menudo guarda una temperatura.", ["seda", "piranesi", "infinito-junco"], [
    ["h2", "Recordamos de otra manera"],
    ["normal", "Puedes olvidar nombres y giros mientras una escena permanece intacta durante años. La lectura se mezcla con el lugar donde ocurrió, la edad que tenías y aquello que todavía no sabías nombrar."],
    ["normal", "Por eso no todo libro importante tiene que ser perfecto. A veces se queda por una imagen precisa, una incomodidad o la sensación de haber encontrado compañía en una frase."],
    ["h2", "Deja una marca fuera del libro"],
    ["normal", "Anota dónde estabas, qué te sorprendió o a quién se lo regalarías. Ese gesto crea una memoria alrededor de la obra y permite que la lectura continúe sin convertirla en una evaluación."],
  ]],
  ["balda-de-coru-tres-lecturas-para-empezar", "La balda de Coru: tres lecturas para empezar", "Selección", "Tres puertas distintas para conocer CoruKai: pensar, caminar y mirar con calma.", ["conquista-felicidad", "siddhartha", "mendel-libros"], [
    ["h2", "Una selección pequeña a propósito"],
    ["normal", "La balda de Coru no reúne los tres mejores libros. Reúne tres maneras de entrar: una inteligencia que discute la felicidad sin convertirla en receta, un viaje interior que no necesita ruido y un relato sobre la devoción absoluta por los libros."],
    ["normal", "Juntos explican la idea de CoruKai. Leer puede ser pensamiento, refugio, placer material y conversación íntima. No hace falta sentir todo a la vez; basta con reconocer qué puerta te apetece abrir."],
    ["h2", "Empieza donde haya una pregunta"],
    ["normal", "Elige a Russell si quieres ordenar ideas, a Hesse si necesitas silencio o a Zweig si te conmueve la vida secreta de las bibliotecas. Después, deja que esa elección te lleve a otra balda."],
  ]],
];

function block([style, text], index) {
  return { _key: `block-${index}`, _type: "block", style, markDefs: [], children: [{ _key: `span-${index}`, _type: "span", marks: [], text }] };
}

for (const [index, [slug, title, category, excerpt, books, sections]] of articles.entries()) {
  await client.createOrReplace({
    _id: `article-${slug}`,
    _type: "article",
    title,
    slug: { _type: "slug", current: slug },
    excerpt,
    category,
    publishedAt: new Date(Date.UTC(2026, 7, 20 + index, 8)).toISOString(),
    body: sections.map(block),
    relatedBooks: books.map((bookSlug, bookIndex) => ({ _key: `${bookSlug}-${bookIndex}`, _type: "reference", _ref: `book-${bookSlug}` })),
    seoTitle: title,
    seoDescription: excerpt,
  });
  console.log(`Published ${index + 1}/${articles.length}: ${title}`);
}
