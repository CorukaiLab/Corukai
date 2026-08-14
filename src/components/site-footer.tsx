import Image from "next/image";
import Link from "next/link";

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
        <div>
          <p>CoruKai · beta</p>
          <p className="affiliate-disclosure">
            En calidad de Afiliado de Amazon, obtengo ingresos por las compras
            adscritas que cumplen los requisitos aplicables.
          </p>
        </div>
        <nav aria-label="Enlaces del pie">
          <Link href="/tienda">Tienda</Link>
          <a href="mailto:hola@corukai.com">Contacto</a>
        </nav>
      </div>
    </footer>
  );
}
