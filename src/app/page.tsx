import Image from "next/image";
import Link from "next/link";
import { ChapterTransition } from "@/components/chapter-transition";
import { DiscoverySearch } from "@/components/discovery-search";
import { EditorialShowcase } from "@/components/editorial-showcase";
import { InteractiveLibrary } from "@/components/interactive-library";
import { CoruShelf } from "@/components/coru-shelf";
import { NewsletterSignup } from "@/components/newsletter-signup";
import type { Product } from "@/lib/products";
import { getCatalogProducts, getCoruPicks } from "@/sanity/lib/queries";

const entryPoints = [
  { number: "01", title: "Quiero volver", text: "Una historia que te reciba sin pedirte que seas más lector de lo que hoy puedes ser.", href: "/tienda?entry=Volver", className: "entry--aloe", image: "/assets/editorial/curiosity-table.webp" },
  { number: "02", title: "Necesito salir", text: "Lugares, ideas y decisiones para cambiar de aire sin convertirlo en una huida.", href: "/tienda?entry=Viajar", className: "entry--yellow", image: "/assets/editorial/hero-ritual.png" },
  { number: "03", title: "Quiero crear", text: "Libros que dejan una pregunta, una imagen o el comienzo de algo que todavía no existe.", href: "/tienda?entry=Crear", className: "entry--coral", image: "/assets/editorial/library-wall-mobile.webp" },
];

function selectProducts(products: Product[], slugs: string[]) {
  return slugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as Product[];
}

export default async function Home() {
  const [products, coruPicks] = await Promise.all([
    getCatalogProducts(),
    getCoruPicks(),
  ]);
  const selected = selectProducts(products, ["piranesi", "seda", "proyecto-hail-mary", "paciente-silenciosa"]);
  const librarySelection = selectProducts(products, [
    "hacia-rutas-salvajes",
    "imperio-final",
    "nosotros-en-la-luna",
    "paciente-silenciosa",
    "infinito-junco",
    "problema-tres-cuerpos",
    "peninsula-casas-vacias",
    "nuestra-parte-noche",
  ]);

  return (
    <main>
      <InteractiveLibrary products={librarySelection} />

      <CoruShelf products={coruPicks} />

      <DiscoverySearch products={products} />

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
              <Image src={entry.image} alt="" fill sizes="(max-width: 760px) 100vw, 32vw" />
              <span>{entry.number}</span><div><h3>{entry.title}</h3><p>{entry.text}</p></div><b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <ChapterTransition chapter="IV" eyebrow="Siguiente capítulo" title="La lectura también puede dejar algo en tus manos." tone="coral" />

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

      <EditorialShowcase products={selected} />

      <section className="human-curation">
        <p className="human-curation__number">24</p>
        <div><p className="eyebrow">Pequeño a propósito</p><h2>Un catálogo mayor no sirve si nadie te ayuda a atravesarlo.</h2></div>
        <p>Empezamos con tres libros por género. Cada uno aporta una voz, una atmósfera o una forma distinta de mirar. Creceremos sin convertir la elección en ruido.</p>
      </section>

      <NewsletterSignup />
    </main>
  );
}
