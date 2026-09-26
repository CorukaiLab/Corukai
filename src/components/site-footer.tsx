import Image from "next/image";
import Link from "next/link";
import { legalIdentity } from "@/lib/legal";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <Image
          src="/assets/brand/corukai-normal.svg"
          alt=""
          width={52}
          height={59}
        />
        <p>La vida ya va demasiado rápido como para convertir los libros en otra obligación.</p>
      </div>
      <div className="footer-meta">
        <div className="footer-identity">
          <p>CoruKai · beta</p>
          <p className="affiliate-disclosure">
            En calidad de Afiliado de Amazon, obtengo ingresos por las compras
            adscritas que cumplen los requisitos aplicables.
          </p>
        </div>
        <div className="footer-links">
          <nav aria-label="Descubrir">
            <strong>Descubrir</strong>
            <Link href="/descubrir">Encuéntrame un libro</Link>
            <Link href="/tienda">Biblioteca</Link>
            <Link href="/cuaderno">Cuaderno editorial</Link>
            <Link href="/cesta">Mi estante</Link>
          </nav>
          <nav aria-label="Información">
            <strong>Información</strong>
            <Link href="/afiliacion">Cómo funciona la compra</Link>
            <a href={`mailto:${legalIdentity.email}`}>Contacto</a>
          </nav>
          <nav aria-label="Legal">
            <strong>Legal</strong>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
