import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateLink } from "@/components/affiliate-link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AmazonPrice } from "@/components/amazon-price";
import { ChapterTransition } from "@/components/chapter-transition";
import { CreativeSparkCard } from "@/components/creative-spark-card";
import { ProductCard } from "@/components/product-card";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { absoluteUrl } from "@/lib/site";
import { getAllProducts, getCatalogProducts, getProductBySlug } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.hook,
    alternates: { canonical: `/libros/${product.slug}` },
    openGraph: {
      title: `${product.title} · ${product.author}`,
      description: product.seoDescription || product.hook,
      url: `/libros/${product.slug}`,
      images: [{ url: product.cover, alt: `Portada de ${product.title}` }],
      type: "book",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getProductBySlug(slug),
    getCatalogProducts(),
  ]);
  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug)
    .map((item) => ({
      item,
      affinity:
        (item.genre === product.genre ? 3 : 0) +
        (item.mood === product.mood ? 2 : 0) +
        (item.entry === product.entry ? 1 : 0),
    }))
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 3)
    .map(({ item }) => ({
      item,
      reason: item.mood === product.mood
        ? `La misma sensación: ${item.mood.toLocaleLowerCase("es")}`
        : item.genre === product.genre
          ? `Otra forma de entrar en ${item.genre.toLocaleLowerCase("es")}`
          : item.entry === product.entry
            ? `También puede ayudarte a ${item.entry.toLocaleLowerCase("es")}`
            : "Una forma distinta de continuar",
    }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": absoluteUrl(`/libros/${product.slug}#book`),
    url: absoluteUrl(`/libros/${product.slug}`),
    name: product.title,
    author: { "@type": "Person", name: product.author },
    genre: product.genre,
    datePublished: String(product.year),
    image: product.cover,
    description: product.seoDescription || product.hook,
    inLanguage: "es",
    ...(product.isbn ? { isbn: product.isbn } : {}),
  };

  const editionFacts = [
    { label: "Formato de referencia", value: product.format },
    { label: "Extensión", value: product.pages ? `${product.pages} páginas` : "Por confirmar" },
    { label: "Primera publicación", value: String(product.year) },
    { label: "ISBN de referencia", value: product.isbn || "Según edición" },
    { label: "Editorial y traducción", value: "Se confirman con la edición enlazada" },
    { label: "Disponibilidad", value: product.affiliateUrl ? "Consultar en Amazon" : "Enlace en preparación" },
  ];

  return (
    <main className="detail-page" style={{ "--accent": product.accent } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <ProductViewTracker slug={product.slug} genre={product.genre} />
      <section className="detail-hero">
        <div className="detail-cover-stage">
          <p>{product.genre}</p>
          <Image
            src={product.cover}
            alt={`Portada de ${product.title}`}
            width={520}
            height={780}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 760px) 72vw, 38vw"
          />
          <span>{product.year}</span>
        </div>
        <div className="detail-copy">
          <Link className="back-link" href="/tienda">← Volver a descubrir</Link>
          <p className="eyebrow">{product.genre} · {product.mood}</p>
          <h1>{product.title}</h1>
          <p className="detail-author">{product.author}</p>
          <p className="detail-hook">{product.hook}</p>
          <dl className="detail-signals">
            <div><dt>Tiempo</dt><dd>{product.readingTime}</dd></div>
            <div><dt>Ritmo</dt><dd>{product.pace}</dd></div>
            <div><dt>Entrada</dt><dd>{product.entry}</dd></div>
          </dl>
          <section className="detail-commerce" aria-label="Edición y compra">
            <div className="detail-commerce__heading">
              <p className="eyebrow">La edición de referencia</p>
              <div className="detail-price">
                <AmazonPrice product={product} />
              </div>
            </div>
            <dl className="detail-commerce__facts">
              <div><dt>Formato</dt><dd>{product.format}</dd></div>
              <div><dt>Extensión</dt><dd>{product.pages ? `${product.pages} páginas` : "Por confirmar"}</dd></div>
            </dl>
            <div className="detail-commerce__actions">
              {product.affiliateUrl && (
                <AffiliateLink
                  className="button button--ink"
                  href={product.affiliateUrl}
                  slug={product.slug}
                  genre={product.genre}
                  placement="ficha"
                >
                  Ver disponibilidad en Amazon <span aria-hidden="true">↗</span>
                </AffiliateLink>
              )}
              <AddToCartButton slug={product.slug} placement="ficha" />
            </div>
            {!product.affiliateUrl && (
              <p className="availability-pending"><strong>Compra en preparación.</strong> Puedes guardarlo ahora; añadiremos el enlace de la edición española cuando esté verificado.</p>
            )}
            <p className="purchase-note"><b>Enlace pagado.</b> La compra se completa en Amazon. CoruKai no cobra ni recibe tus datos bancarios.</p>
          </section>
        </div>
      </section>

      <nav className="detail-route" aria-label="Recorrido por la ficha">
        <a href="#encaje"><span>Antes</span><b>¿Encaja conmigo?</b></a>
        <a href="#edicion"><span>El objeto</span><b>¿Qué edición compro?</b></a>
        <a href="#despues"><span>Después</span><b>¿Qué me deja?</b></a>
      </nav>

      <header className="detail-act-marker" id="encaje">
        <span>Acto I</span><p>Antes de abrirlo</p><h2>¿Encaja conmigo?</h2>
      </header>

      <section className="decision-section">
        <p className="decision-number">01</p>
        <div>
          <p className="eyebrow">Por qué puede encajar</p>
          <h2>{product.description}</h2>
        </div>
        <aside>
          <p>Momento ideal</p>
          <strong>{product.idealMoment}</strong>
        </aside>
      </section>

      <section className="honest-section">
        <div>
          <p className="eyebrow">Para quién sí</p>
          <p>
            Para quien busca {product.mood.toLocaleLowerCase("es")} y prefiere
            una recomendación con contexto antes que una puntuación.
          </p>
        </div>
        <div>
          <p className="eyebrow">Quizá no ahora</p>
          <p>
            Si necesitas acción inmediata, lectura muy ligera o una historia
            parecida a la última que terminaste.
          </p>
        </div>
      </section>

      <header className="detail-act-marker detail-act-marker--dark" id="edicion">
        <span>Acto II</span><p>El libro como objeto</p><h2>¿Qué edición compro?</h2>
      </header>

      <section className="edition-ledger" aria-labelledby="edition-ledger-title">
        <header>
          <p className="eyebrow">La edición, sin letra pequeña</p>
          <h2 id="edition-ledger-title">Datos para elegir sin sorpresas.</h2>
        </header>
        <dl>
          {editionFacts.map((fact, index) => (
            <div key={fact.label}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="edition-ledger__note">Los datos corresponden a la edición usada como referencia. Antes de comprar, Amazon mostrará editorial, traducción, formato, precio y disponibilidad definitivos.</p>
      </section>

      <header className="detail-act-marker" id="despues">
        <span>Acto III</span><p>Después de cerrarlo</p><h2>¿Qué me deja?</h2>
      </header>

      <section className="coru-recommendation" aria-labelledby="coru-recommendation-title">
        <div className="coru-recommendation__book">
          <Image src={product.cover} alt="" width={210} height={315} sizes="170px" loading="eager" fetchPriority="low" />
        </div>
        <div className="coru-recommendation__intro">
          <p className="eyebrow">La sugerencia de Coru</p>
          <h2 id="coru-recommendation-title">Por qué lo pondría hoy en tu mesa.</h2>
        </div>
        <div className="coru-recommendation__note"><b>Coru</b><p>“{product.coruNote}”</p><span>Una nota dejada junto al libro</span></div>
      </section>

      <ChapterTransition chapter="VI" eyebrow="La última página no cierra aquí" title="Ahora la historia te devuelve una pregunta." tone="aloe" />

      <CreativeSparkCard slug={product.slug} prompt={product.creativeSpark} />

      {related.length > 0 && (
        <section className="related-section">
          <header>
            <p className="eyebrow">Si esta puerta te interesa</p>
            <h2>Hay otras formas de entrar.</h2>
          </header>
          <div className="catalog-grid catalog-grid--related">
            {related.map(({ item, reason }) => (
              <div className="related-echo" key={item.slug}>
                <p><span>Si te quedas con…</span><b>{reason}</b></p>
                <ProductCard product={item} compact />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
