import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/site-header";
import { getCollections, getFeaturedBooks } from "@/sanity/lib/queries";

interface RoadmapStep {
  phase: string;
  title: string;
  detail: string;
}

const roadmapSteps: RoadmapStep[] = [
  {
    phase: "01",
    title: "Validar sensacion",
    detail: "Comprobar si la home consigue que alguien quiera curiosear sin prisa.",
  },
  {
    phase: "02",
    title: "Catalogo manual",
    detail: "Subir las primeras fichas de libros con portada, emocion, vibe y momento ideal.",
  },
  {
    phase: "03",
    title: "CMS y newsletter",
    detail: "Conectar Sanity y MailerLite solo cuando la experiencia base este clara.",
  },
];

export default async function Home() {
  const [featuredBooks, collections] = await Promise.all([
    getFeaturedBooks(),
    getCollections(),
  ]);

  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero" id="inicio">
          <div className="hero__content">
            <p className="eyebrow">Experiencia editorial de descubrimiento</p>
            <h1>Leer deberia sentirse bien.</h1>
            <p className="hero__lead">
              CoruKai ayuda a descubrir libros desde la curiosidad, la calma y
              la emocion del momento. No vienes a demostrar que lees: vienes a
              encontrar algo que te apetezca vivir.
            </p>

            <div className="hero__actions" aria-label="Acciones principales">
              <Link className="button button--primary" href="#explorar">
                Explorar sin prisa
              </Link>
              <Link className="button button--secondary" href="/libros">
                Ver libros
              </Link>
            </div>
          </div>

          <aside className="hero-card" aria-label="Entrada de exploracion">
            <span className="hero-card__label">Para empezar</span>
            <h2>Que te apetece descubrir hoy?</h2>
            <div className="search-mock">
              algo tranquilo, aventura suave, volver a leer...
            </div>
            <div className="mood-list" aria-label="Sensaciones de ejemplo">
              <span>Calma</span>
              <span>Aventura</span>
              <span>Misterio</span>
              <span>Melancolia</span>
            </div>
          </aside>
        </section>

        <section className="section" id="explorar">
          <div className="section__intro">
            <p className="eyebrow">Primeras fichas</p>
            <h2>Historias para probar la sensacion CoruKai.</h2>
            <p>
              El MVP debe empezar con pocas fichas muy cuidadas: portada
              protagonista, contexto emocional y una decision facil.
            </p>
          </div>

          <div className="book-grid">
            {featuredBooks.map((book) => (
              <article className="book-card" key={book.title}>
                <div
                  className="book-card__cover"
                  style={{ "--genre-color": book.genreColor } as CSSProperties}
                  aria-hidden="true"
                >
                  <span>{book.genre}</span>
                </div>
                <div className="book-card__body">
                  <p>{book.primaryEmotion ?? book.genre}</p>
                  <h3>{book.title}</h3>
                  <span>{book.author}</span>
                  <small>{book.vibe}</small>
                  <Link className="text-link" href={`/libros/${book.slug}`}>
                    Entrar en la historia
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__intro">
            <p className="eyebrow">Colecciones</p>
            <h2>Puertas de entrada por sensacion.</h2>
            <p>
              Las colecciones ayudan a entrar por momento vital, no por ranking.
              Primero la sensacion, luego el libro.
            </p>
          </div>

          <div className="collection-grid">
            {collections.map((collection) => (
              <article className="collection-card" key={collection.slug}>
                <span>{collection.primaryEmotion ?? "Curiosidad"}</span>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <small>{collection.bookCount} libros vinculados</small>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--split" id="ruta">
          <div className="section__intro">
            <p className="eyebrow">Ruta inmediata</p>
            <h2>Lo siguiente no es decorar mas. Es convertirlo en producto.</h2>
            <p>
              El objetivo ahora es pasar de maqueta bonita a MVP navegable:
              estructura, contenido real, medicion y publicacion progresiva.
            </p>
          </div>

          <div className="roadmap">
            {roadmapSteps.map((step) => (
              <article className="roadmap-card" key={step.phase}>
                <span>{step.phase}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <div>
            <p className="eyebrow">Newsletter MVP</p>
            <h2>Curiosidad tranquila, de vez en cuando.</h2>
          </div>
          <Link className="button button--primary" href="mailto:hola@corukai.com">
            Quiero curiosear
          </Link>
        </section>
      </main>
    </>
  );
}
