import Image from "next/image";
import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { MobileNavigation } from "@/components/mobile-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="CoruKai, inicio">
        <Image
          src="/assets/brand/corukai-normal.svg"
          alt=""
          width={34}
          height={39}
          priority
        />
        <span>CoruKai</span>
      </Link>
      <nav className="primary-nav" aria-label="Navegación principal">
        <Link className="home-link" href="/">Inicio</Link>
        <Link className="discovery-link" href="/descubrir">
          Descubrir
        </Link>
        <Link className="library-link" href="/tienda">
          Biblioteca
        </Link>
      </nav>
      <div className="header-actions">
        <CartLink />
      </div>
      <MobileNavigation />
    </header>
  );
}
