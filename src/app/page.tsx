import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/lib/catalog";

const entryPoints = [
  {
    number: "01",
    title: "Quiero volver",
    text: "Libros que te reciben sin exigirte ritmo, contexto ni una identidad de lector.",
    href: "/tienda?mood=Claridad",
    className: "entry--aloe",
  },
  {
    number: "02",
    title: "Necesito salir",
    text: "Viajes, mundos y decisiones para cambiar de aire sin mirar el reloj.",
    href: "/tienda?mood=Asombro",
    className: "entry--yellow",
  },
  {
    number: "03",
    title: "Quiero sentir",
    text: "Historias íntimas que no confunden emoción con sentimentalismo.",
    href: "/tienda?mood=Melancolía",
    className: "entry--coral",
  },
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <Image
          className="home-hero__image"
          src="/assets/editorial/hero-ritual.png"
          alt="Libros, un marcador y una taza sobre una mesa editorial"
          fill
          priority
          sizes="100vw"
        />
        <div className="home-hero__veil" />
        <div className="home-hero__content">
          <p className="eyebrow">Librería sensorial · edición beta 01</p>
          <h1>Leer debería<br />sentirse bien.</h1>
          <p className="hero-intro">
            Encuentra una historia por cómo quieres sentirte. Con criterio,
            calma y una compra que no te persigue.
          </p>
          <div className="hero-actions">
            <Link className="button button--coral" href="/tienda">
              Encontrar mi próxima historia <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link text-link--light" href="#maneras">
              Curiosear sin prisa
            </Link>
          </div>
        </div>
        <p className="hero-note">Una mesa abierta para quien lee mucho, poco o está volviendo.</p>
      </section>

      <section className="entry-section" id="maneras">
        <header className="section-heading">
          <p className="eyebrow">No empieces por el género</p>
          <h2>¿Qué necesitas que haga una historia por ti?</h2>
        </header>
        <div className="entry-grid">
          {entryPoints.map((entry) => (
            <Link className={`entry-panel ${entry.className}`} href={entry.href} key={entry.title}>
              <span>{entry.number}</span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </div>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-pick">
        <div className="editorial-pick__copy">
          <p className="eyebrow">La elección de esta semana</p>
          <h2>Una expedición que empieza antes de abrir el libro.</h2>
          <p>
            <em>La rosa del Tibet</em> es aventura, misterio geográfico y una
            promesa de lugar secreto. Para cuando necesitas recordar que aún
            quedan puertas.
          </p>
          <Link className="button button--ink" href="/libros/rosa-tibet">
            Abrir esta historia <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="editorial-pick__cover">
          <span className="edition-mark">CORU<br />KAI<br />01</span>
          <Image
            src="/assets/covers/rosa-tibet.jpg"
            alt="Portada de La rosa del Tibet"
            width={420}
            height={630}
            sizes="(max-width: 800px) 68vw, 32vw"
          />
        </div>
        <p className="editorial-pick__aside">
          Sin puntuaciones. Sin “deberías”. Solo la información que ayuda a decidir.
        </p>
      </section>

      <section className="shelf-section">
        <header className="shelf-heading">
          <div>
            <p className="eyebrow">Historias con una razón para estar aquí</p>
            <h2>Cuatro puertas.<br />Ninguna obligación.</h2>
          </div>
          <Link className="text-link" href="/tienda">Ver toda la selección →</Link>
        </header>
        <div className="home-products">
          {PRODUCTS.slice(3, 7).map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="manifesto-strip">
        <p>Menos catálogo infinito.</p>
        <p>Más criterio.</p>
        <p>Más historias que llegan en el momento adecuado.</p>
      </section>

      <section className="newsletter-section">
        <div>
          <p className="eyebrow">Una pequeña dosis de curiosidad</p>
          <h2>Una historia para este momento.</h2>
        </div>
        <form className="newsletter-form">
          <label htmlFor="email">Tu correo</label>
          <div>
            <input id="email" name="email" type="email" placeholder="nombre@correo.com" required />
            <button type="submit">Quiero recibirla <span aria-hidden="true">→</span></button>
          </div>
          <p>Quincenal. Sin ruido. La conexión se activará durante la beta privada.</p>
        </form>
      </section>
    </main>
  );
}

