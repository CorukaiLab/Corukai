import Image from "next/image";
import Link from "next/link";
import { DiscoverySearch } from "@/components/discovery-search";
import { InteractiveLibrary } from "@/components/interactive-library";
import { ProductCard } from "@/components/product-card";
import { CoruShelf } from "@/components/coru-shelf";
import { PRODUCTS } from "@/lib/catalog";

const entryPoints = [
  { number: "01", title: "Quiero volver", text: "Una historia que te reciba sin pedirte que seas más lector de lo que hoy puedes ser.", href: "/tienda?entry=Volver", className: "entry--aloe" },
  { number: "02", title: "Necesito salir", text: "Lugares, ideas y decisiones para cambiar de aire sin convertirlo en una huida.", href: "/tienda?entry=Viajar", className: "entry--yellow" },
  { number: "03", title: "Quiero crear", text: "Libros que dejan una pregunta, una imagen o el comienzo de algo que todavía no existe.", href: "/tienda?entry=Crear", className: "entry--coral" },
];

function selectProducts(slugs: string[]) {
  return slugs.map((slug) => PRODUCTS.find((product) => product.slug === slug)).filter(Boolean) as typeof PRODUCTS;
}

const selected = selectProducts(["piranesi", "seda", "proyecto-hail-mary", "paciente-silenciosa"]);
const coruSelection = selectProducts(["hacia-rutas-salvajes", "piranesi", "seda"]);
const librarySelection = selectProducts([
  "hacia-rutas-salvajes",
  "imperio-final",
  "nosotros-en-la-luna",
  "paciente-silenciosa",
  "infinito-junco",
  "problema-tres-cuerpos",
  "peninsula-casas-vacias",
  "nuestra-parte-noche",
]);

export default function Home() {
  return (
    <main>
      <InteractiveLibrary products={librarySelection} />

      <section className="home-thesis" aria-label="La promesa CoruKai">
        <p>Sin rankings.</p><p>Sin prisa.</p><p>Con una razón para abrir cada libro.</p>
      </section>

      <section className="entry-section" id="maneras">
        <header className="section-heading">
          <p className="eyebrow">Antes del género</p>
          <h2>¿Qué necesitas que haga una historia por ti?</h2>
        </header>
        <div className="entry-grid">
          {entryPoints.map((entry) => (
            <Link className={`entry-panel ${entry.className}`} href={entry.href} key={entry.title}>
              <span>{entry.number}</span><div><h3>{entry.title}</h3><p>{entry.text}</p></div><b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <DiscoverySearch products={PRODUCTS} />

      <CoruShelf products={coruSelection} />

      <section className="curiosity-scene">
        <Image src="/assets/editorial/curiosity-table.webp" alt="Cuaderno, brújula, libros y objetos creativos sobre una mesa azul noche" fill sizes="100vw" />
        <div className="curiosity-scene__veil" />
        <div className="curiosity-scene__copy">
          <p className="eyebrow">Para las almas creativas. También para las que aún no lo saben.</p>
          <h2>Un libro puede ser una puerta. O una herramienta para fabricar la tuya.</h2>
          <p>Cada ficha incluye una chispa creativa: una pregunta o gesto breve para que la lectura no termine en la última página.</p>
          <Link className="button button--yellow" href="/tienda?entry=Crear">Encontrar una chispa <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="shelf-section">
        <header className="shelf-heading">
          <div><p className="eyebrow">Historias con una razón para estar aquí</p><h2>Cuatro puertas.<br />Cuatro ritmos.</h2></div>
          <Link className="text-link" href="/tienda">Ver las 24 historias →</Link>
        </header>
        <div className="home-products">
          {selected.map((product, index) => <ProductCard key={product.slug} product={product} priority={index < 2} />)}
        </div>
      </section>

      <section className="human-curation">
        <p className="human-curation__number">24</p>
        <div><p className="eyebrow">Pequeño a propósito</p><h2>Un catálogo mayor no sirve si nadie te ayuda a atravesarlo.</h2></div>
        <p>Empezamos con tres libros por género. Cada uno aporta una voz, una atmósfera o una forma distinta de mirar. Creceremos sin convertir la elección en ruido.</p>
      </section>

      <section className="newsletter-section">
        <div><p className="eyebrow">Una pequeña dosis de curiosidad</p><h2>Una historia para este momento.</h2></div>
        <form className="newsletter-form">
          <label htmlFor="email">Tu correo</label>
          <div><input id="email" name="email" type="email" placeholder="nombre@correo.com" required /><button type="submit">Quiero recibirla <span aria-hidden="true">→</span></button></div>
          <p>Quincenal. Una recomendación, una conexión cultural y una chispa creativa. Sin ruido.</p>
        </form>
      </section>
    </main>
  );
}
