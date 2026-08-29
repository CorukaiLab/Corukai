import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart/cart-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "./library-theme.css";
import "./refinements.css";
import "./selected-direction.css";
import "./catalog-product-selection.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CoruKai · Leer debería sentirse bien",
    template: "%s · CoruKai",
  },
  description:
    "Una librería online para descubrir libros por cómo quieres sentirte, con criterio, calma y una compra sencilla.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: SITE_NAME,
    title: "CoruKai · Leer debería sentirse bien",
    description: "Descubre libros por cómo quieres sentirte, sin rankings ni prisa.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CoruKai, leer debería sentirse bien" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoruKai · Leer debería sentirse bien",
    description: "Descubre libros por cómo quieres sentirte, sin rankings ni prisa.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVercel = Boolean(process.env.VERCEL);

  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/editorial/library-wall-desktop.webp"
          media="(min-width: 761px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/editorial/library-wall-mobile.webp"
          media="(max-width: 760px)"
          fetchPriority="high"
        />
      </head>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
        {isVercel ? <Analytics /> : null}
        {isVercel ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
