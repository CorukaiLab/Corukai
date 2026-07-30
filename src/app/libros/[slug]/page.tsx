import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { formatPrice, getProduct, PRODUCTS } from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.hook,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (item) => item.slug !== product.slug && (item.genre === product.genre || item.mood === product.mood),
  ).slice(0, 3);

  return (
    <main className="detail-page" style={{ "--accent": product.accent } as React.CSSProperties}>
      <section className="detail-hero">
        <div className="detail-cover-stage">
          <p>{product.genre}</p>
          <Image
            src={product.cover}
            alt={`Portada de ${product.title}`}
            width={520}
            height={780}
            priority
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
          <div className="detail-price">
            <strong>{formatPrice(product.priceCents)}</strong>
            <span>{product.format} · precio beta</span>
          </div>
          <AddToCartButton slug={product.slug} />
          <p className="purchase-note">
            La cesta ya funciona. El cobro se activará al conectar la cuenta comercial de Stripe.
          </p>
        </div>
      </section>

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

      {related.length > 0 && (
        <section className="related-section">
          <header>
            <p className="eyebrow">Si esta puerta te interesa</p>
            <h2>Hay otras formas de entrar.</h2>
          </header>
          <div className="catalog-grid catalog-grid--related">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}

