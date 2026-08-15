import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/cart/cart-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./library-theme.css";
import "./refinements.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "CoruKai · Leer debería sentirse bien",
    template: "%s · CoruKai",
  },
  description:
    "Una librería online para descubrir libros por cómo quieres sentirte, con criterio, calma y una compra sencilla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVercel = Boolean(process.env.VERCEL);

  return (
    <html lang="es">
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
