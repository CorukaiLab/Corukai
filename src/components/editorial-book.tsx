import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateLink } from "@/components/affiliate-link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { AmazonPrice } from "@/components/amazon-price";
import { CreativeSparkCard } from "@/components/creative-spark-card";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { AUTHOR_PROFILES } from "@/lib/author-profiles";
import { getProductCoverAlt, type Product } from "@/lib/products";

interface EditorialBookProps {
  product: Product;
  related: Product[];
}

const algeriaOutline = [[11.999506,23.471668],[8.572893,21.565661],[5.677566,19.601207],[4.267419,19.155265],[3.158133,19.057364],[3.146661,19.693579],[2.683588,19.85623],[2.060991,20.142233],[1.823228,20.610809],[-1.550055,22.792666],[-4.923337,24.974574],[-8.6844,27.395744],[-8.674116,28.841289],[-7.059228,29.579228],[-6.060632,29.7317],[-5.242129,30.000443],[-4.859646,30.501188],[-3.690441,30.896952],[-3.647498,31.637294],[-3.06898,31.724498],[-2.616605,32.094346],[-1.307899,32.262889],[-1.124551,32.651522],[-1.388049,32.864015],[-1.733455,33.919713],[-1.792986,34.527919],[-2.169914,35.168396],[-1.208603,35.714849],[-.127454,35.888662],[.503877,36.301273],[1.466919,36.605647],[3.161699,36.783905],[4.815758,36.865037],[5.32012,36.716519],[6.26182,37.110655],[7.330385,37.118381],[7.737078,36.885708],[8.420964,36.946427],[8.217824,36.433177],[8.376368,35.479876],[8.140981,34.655146],[7.612642,33.344115],[8.430473,32.748337],[8.439103,32.506285],[9.055603,32.102692],[9.48214,30.307556],[9.805634,29.424638],[9.859998,28.95999],[9.683885,28.144174],[9.756128,27.688259],[9.629056,27.140953],[9.716286,26.512206],[9.319411,26.094325],[9.910693,25.365455],[9.948261,24.936954],[10.303847,24.379313],[10.771364,24.562532],[11.560669,24.097909]];

function spineTextColor(accent: string) {
  const hex = accent.match(/^#([\da-f]{6})$/i)?.[1];
  if (!hex) return "#fff";
  const channels = [0, 2, 4].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000" : "#fff";
}

function CultureCards({ product, related }: EditorialBookProps) {
  const isStranger = product.slug === "el-extranjero";
  if (isStranger) return (
    <section className="editorial-book__culture" aria-label="Explorar el universo del libro">
      <details><summary><span>Entre páginas</span><strong>Una curiosidad</strong><b aria-hidden="true">＋</b></summary><div><p>Camus también escribió teatro y trabajó en el periódico <em>Combat</em>. Su obra no se limita a la novela.</p></div></details>
      <details><summary><span>La primera línea</span><strong>Una frase</strong><b aria-hidden="true">＋</b></summary><div><blockquote>«Mamá se ha muerto hoy. O puede que ayer, no lo sé.»</blockquote><p>Así abre esta edición. Una voz que marca la distancia desde el principio.</p></div></details>
      <details><summary><span>Para acompañar</span><strong>Una escucha</strong><b aria-hidden="true">＋</b></summary><div><p><em>Gnossienne n.º 1</em>, Erik Satie. Piano espaciado y una sensación suspendida. Una asociación de CoruKai, no música vinculada a la novela.</p><a href="https://open.spotify.com/search/Gnossienne%20No.%201%20Erik%20Satie" target="_blank" rel="noopener noreferrer">Buscar una interpretación ↗</a></div></details>
      <details><summary><span>Otra mirada</span><strong>Una película</strong><b aria-hidden="true">＋</b></summary><div><p><em>Lo straniero</em> · Luchino Visconti, 1967. La adaptación cinematográfica: otra manera de acercarse a la misma historia, preferiblemente después del libro.</p><a href="https://www.criterion.com/current/posts/7274-giuseppe-rotunno-it-s-like-being-a-painter" target="_blank" rel="noopener noreferrer">Sobre la adaptación ↗</a></div></details>
    </section>
  );

  const cards = [
    { label: "Entre páginas", title: "Una pista", text: product.idealMoment },
    { label: "La mirada de Coru", title: "Una nota", text: product.coruNote },
    { label: "Tu momento", title: "Un ritmo", text: `${product.readingTime} · ${product.pace.toLocaleLowerCase("es")}.` },
    { label: "Sigue el hilo", title: "Otra puerta", text: related[0] ? `${related[0].title}, de ${related[0].author}.` : "Vuelve a la biblioteca cuando quieras descubrir otro libro.", href: related[0] ? `/libros/${related[0].slug}` : "/tienda" },
  ];
  return (
    <section className="editorial-book__culture editorial-book__culture--general" aria-label="Explorar el libro">
      {cards.map((card) => <details key={card.title}><summary><span>{card.label}</span><strong>{card.title}</strong><b aria-hidden="true">＋</b></summary><div><p>{card.text}</p>{card.href && <Link href={card.href}>Abrir este libro ↗</Link>}</div></details>)}
    </section>
  );
}

function AuthorPanel({ product }: { product: Product }) {
  const profile = AUTHOR_PROFILES[product.author];
  if (!profile) return (
    <aside className="editorial-book__author editorial-book__author--general" aria-label="Datos del libro">
      <p className="editorial-book__eyebrow">Una voz para descubrir</p>
      <h2>{product.author}</h2>
      <dl><div><dt>Género</dt><dd>{product.genre}</dd></div><div><dt>Primera publicación</dt><dd>{product.year}</dd></div><div><dt>Ritmo</dt><dd>{product.pace}</dd></div><div><dt>Entrada</dt><dd>{product.entry}</dd></div></dl>
    </aside>
  );
  const isCamus = product.author === "Albert Camus";
  return (
    <aside className="editorial-book__author" aria-label={`Acerca de ${product.author}`}>
      <p className="editorial-book__eyebrow">Lugar de nacimiento</p>
      {isCamus ? (
        <svg className="editorial-book__map" viewBox="-10 -39 24 22" role="img" aria-label="Contorno de Argelia"><polygon points={algeriaOutline.map(([longitude, latitude]) => `${longitude},${-latitude}`).join(" ")} /></svg>
      ) : (
        <svg className="editorial-book__origin-mark" viewBox="0 0 70 70" aria-hidden="true"><circle cx="35" cy="35" r="28" /><path d="M7 35h56M35 7c-13 14-13 42 0 56M35 7c13 14 13 42 0 56M14 22h42M14 48h42" /><circle className="editorial-book__origin-dot" cx="35" cy="35" r="5" /></svg>
      )}
      <p className="editorial-book__map-caption">Un punto de partida</p>
      <h2>{profile.country}</h2>
      <p>{profile.birthplace}{profile.context && <><br />{profile.context}</>}</p>
      {isCamus ? <Image src="/assets/editorial/albert-camus-sandbox.webp" alt="Retrato de Albert Camus. Fuente: Penguin Libros." width={66} height={78} className="editorial-book__portrait" /> : <span className="editorial-book__author-monogram" aria-hidden="true">{product.author.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("")}</span>}
      <strong>{product.author}</strong>
      {isCamus && <p>1913 — 1960</p>}
      <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer">Conocer al autor ↗</a>
    </aside>
  );
}

function RelatedShelf({ related }: { related: Product[] }) {
  const shapes = [{ height: 150, width: 48, tilt: -1 }, { height: 170, width: 56, tilt: 1 }, { height: 144, width: 46, tilt: 0 }, { height: 160, width: 52, tilt: -1 }];
  if (!related.length) return null;
  return <section className="editorial-book__related" aria-labelledby="related-books-title">
    <header><div><p className="editorial-book__eyebrow">Sigue el hilo</p><h2 id="related-books-title">Otras puertas en CoruKai.</h2></div><p>Libros distintos para seguir explorando.<br />Todos están en nuestra biblioteca.</p></header>
    <div className="editorial-book__spines" role="group" aria-label="Otros libros de CoruKai">
      {related.map((book, index) => {
        const shape = shapes[index % shapes.length];
        return <Link href={`/libros/${book.slug}`} className="editorial-book__spine" style={{ "--spine-color": book.accent, "--spine-ink": spineTextColor(book.accent), "--spine-height": `${shape.height}px`, "--spine-width": `${shape.width}px`, "--spine-tilt": `${shape.tilt}deg` } as CSSProperties} aria-label={`Abrir ${book.title}`} key={book.slug}><span>{book.title}</span><b aria-hidden="true">C</b></Link>;
      })}
    </div>
    <p>Una historia termina. Otra asoma por el lomo.</p>
    <Link className="editorial-book__all" href="/tienda">Ver toda la biblioteca ↗</Link>
  </section>;
}

export function EditorialBook({ product, related }: EditorialBookProps) {
  const isStranger = product.slug === "el-extranjero";
  const edition = isStranger ? [
    ["Autor", product.author], ["Obra original", `L’Étranger · ${product.year}`], ["Formato", product.format],
    ["Extensión", product.pages ? `${product.pages} páginas` : "Por confirmar"], ["ISBN de referencia", product.isbn || "Según edición"], ["Editorial", "Debolsillo"],
  ] : [
    ["Autor", product.author], ["Primera publicación", String(product.year)], ["Formato", product.format],
    ["Extensión", product.pages ? `${product.pages} páginas` : "Por confirmar"], ["ISBN de referencia", product.isbn || "Según edición"], ["Género", product.genre],
  ];

  return <main className="editorial-book">
    <ProductViewTracker slug={product.slug} genre={product.genre} />
    <section className="editorial-book__hero" aria-labelledby="book-title">
      <div className="editorial-book__intro">
        <p className="editorial-book__eyebrow">Dentro de este libro · {product.genre}</p>
        <h1 id="book-title">{product.title}</h1>
        <p className="editorial-book__byline">{product.author}</p>
        <p className="editorial-book__lead">{isStranger ? <>El sol. El silencio.<br />La extrañeza de estar aquí.</> : product.hook}</p>
        <details className="editorial-book__secret"><summary>Un detalle escondido <span aria-hidden="true">＋</span></summary><p>{isStranger ? "Prueba a fijarte en el calor, la luz y las sensaciones del cuerpo. En esta lectura, el ambiente puede decir tanto como lo que Meursault cuenta." : product.idealMoment}</p><small>Una pista de lectura de CoruKai · sin spoilers.</small></details>
      </div>
      <figure className="editorial-book__cover"><Image src={product.cover} alt={getProductCoverAlt(product)} width={400} height={600} sizes="(max-width: 760px) 62vw, 205px" priority /><figcaption>Primera publicación <b>{product.year}</b></figcaption></figure>
      <AuthorPanel product={product} />
    </section>

    <section id="guardar-libro" className="editorial-book__keep" aria-label="Guardar o comprar el libro">
      <div><p className="editorial-book__eyebrow">Un sitio en tu estante</p><AddToCartButton slug={product.slug} placement="ficha" /></div>
      <a className="editorial-book__edition-jump" href="#edicion">Consultar ficha técnica ↓</a>
      <div className="editorial-book__buy">{product.affiliateUrl ? <><AffiliateLink href={product.affiliateUrl} slug={product.slug} genre={product.genre} placement="ficha" className="editorial-book__amazon">Ver edición en Amazon <span aria-hidden="true">↗</span></AffiliateLink><AmazonPrice product={product} compact /></> : <p><strong>Compra en preparación.</strong> Puedes guardarlo ahora; añadiremos el enlace cuando la edición esté verificada.</p>}</div>
    </section>

    <section id="edicion" className="editorial-book__edition"><header><p className="editorial-book__eyebrow">El ejemplar que tienes delante</p><h2>Ficha técnica</h2></header><dl>{edition.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>Datos de referencia de la ficha. Confirma edición, precio y disponibilidad en Amazon antes de comprar.</p></section>

    <CultureCards product={product} related={related} />

    <div className="editorial-book__stories">
      <section className="editorial-book__story" aria-labelledby="story-title">
        {isStranger ? <figure className="editorial-book__scene"><Image src="/assets/editorial/extranjero-vaso-v1.webp" alt="Interpretación visual generada: un vaso de agua sobre una mesa bajo una luz dura" width={1024} height={768} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>Interpretación visual · CoruKai · IA</figcaption></figure> : <figure className="editorial-book__scene editorial-book__scene--cover"><Image src={product.cover} alt="" width={400} height={600} sizes="(max-width: 760px) 60vw, 220px" /><figcaption>Portada del libro · edición de referencia</figcaption></figure>}
        <div className="editorial-book__story-copy"><p className="editorial-book__eyebrow">Antes de abrirlo · sin spoilers</p><h2 id="story-title">{isStranger ? "Lo extraño está en la mirada." : "Una puerta para tu momento."}</h2><p>{isStranger ? "Meursault vive lo cotidiano con una distancia que desconcierta. Camus hace de esa mirada una novela sobre el juicio y nuestra necesidad de encontrar sentido." : product.description}</p><p>{isStranger ? "Puede interesarte si te gustan las voces que te dejan espacio para pensar. Es breve, pero aborda muerte, violencia y distancia emocional." : product.forWhom?.trim() || product.idealMoment}</p><p className="editorial-book__caution">{isStranger ? "No todo libro corto es una lectura ligera." : product.notForWhom?.trim() || "Si hoy no es tu momento, puedes guardarlo para después."}</p></div>
      </section>
      <section className="editorial-book__story editorial-book__story--note" aria-labelledby="note-title">
        {isStranger ? <figure className="editorial-book__scene"><Image src="/assets/editorial/extranjero-silla-v1.webp" alt="Interpretación visual generada: una silla vacía apartada de una mesa" width={1024} height={768} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>Interpretación visual · CoruKai · IA</figcaption></figure> : <div className="editorial-book__scene editorial-book__scene--type" aria-hidden="true"><span>{product.mood}</span><small>Una sensación, no una obligación.</small></div>}
        <div className="editorial-book__story-copy"><p className="editorial-book__eyebrow">La nota de Coru</p><h2 id="note-title">¿Lo pondría hoy en tu mesa?</h2><p>{isStranger ? "Te lo acercaría por la pregunta que deja, no por la obligación de leer un clásico." : product.coruNote}</p><p>{isStranger ? "Si hoy te apetece mirar las cosas desde un lugar menos cómodo, puede ser tu libro. Si necesitas una historia que te abrace, lo guardaría para otro momento." : product.idealMoment}</p><a href="#guardar-libro">Guardarlo para después ↑</a></div>
      </section>
    </div>

    <CreativeSparkCard slug={product.slug} prompt={product.creativeSpark} />
    <RelatedShelf related={related} />
    <div className="editorial-book__end"><Link href="/tienda">← Volver a la biblioteca</Link><span>Leer debería sentirse bien.</span></div>
  </main>;
}
