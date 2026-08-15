import Image from "next/image";
import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";

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
        <Link href="/">Inicio</Link>
        <Link href="/#descubrir">Encuéntrame un libro</Link>
        <Link className="library-link" href="/tienda">
          La biblioteca <span aria-hidden="true">24</span>
        </Link>
        <CartLink />
      </nav>
    </header>
  );
}
