import { performance } from "node:perf_hooks";

const baseUrl = process.argv[2] || process.env.BASE_URL || "http://localhost:3010";
const clientCount = Number(process.env.CLIENTS || 60);
const books = [
  "hacia-rutas-salvajes",
  "piranesi",
  "seda",
  "paciente-silenciosa",
  "infinito-junco",
  "proyecto-hail-mary",
  "hamnet",
  "nuestra-parte-noche",
  "libreria-livingstone",
  "infraordinario",
  "mas-que-humano",
];
const filters = [
  "genre=Aventura&entry=Viajar",
  "genre=Fantas%C3%ADa&mood=Extra%C3%B1eza",
  "genre=Romance&time=Una%20tarde",
  "genre=Misterio&pace=Intenso",
  "genre=Ensayo&entry=Pensar",
  "genre=Ciencia%20ficci%C3%B3n&entry=Crear",
  "genre=Hist%C3%B3rica&time=Sin%20prisa",
  "genre=Terror&mood=Inquietud",
];

async function request(path, clientId, step) {
  const started = performance.now();
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "User-Agent": `CoruKai-Simulated-Client/${clientId}` },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.text();
  const duration = performance.now() - started;

  if (!response.ok) throw new Error(`cliente ${clientId}, ${step}: HTTP ${response.status} en ${path}`);
  if (!body.includes("CoruKai")) throw new Error(`cliente ${clientId}, ${step}: contenido incompleto en ${path}`);
  return { path, duration };
}

async function simulateClient(clientId) {
  const bookIndex = clientId % books.length;
  const filterIndex = clientId % filters.length;
  const journey = [
    ["/", "home"],
    [`/tienda?${filters[filterIndex]}`, "filtro"],
    [`/libros/${books[bookIndex]}`, "ficha"],
    ["/cesta", "estante"],
  ];
  const timings = [];
  for (const [path, step] of journey) timings.push(await request(path, clientId, step));
  return timings;
}

const settled = await Promise.allSettled(
  Array.from({ length: clientCount }, (_, index) => simulateClient(index + 1)),
);
const failures = settled.filter((result) => result.status === "rejected");
const timings = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
const durations = timings.map((entry) => entry.duration).sort((a, b) => a - b);
const percentile = (value) => durations[Math.min(durations.length - 1, Math.floor(durations.length * value))] || 0;

console.log(JSON.stringify({
  baseUrl,
  clients: clientCount,
  requests: timings.length,
  failures: failures.length,
  latencyMs: {
    median: Math.round(percentile(0.5)),
    p95: Math.round(percentile(0.95)),
    maximum: Math.round(durations.at(-1) || 0),
  },
  errors: failures.map((failure) => String(failure.reason)),
}, null, 2));

if (failures.length > 0) process.exitCode = 1;
