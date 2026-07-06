import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/#explorar", label: "Explorar" },
  { href: "/libros", label: "Libros" },
  { href: "/studio", label: "Studio" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Volver al inicio">
        <Image
          alt=""
          className="brand__mark"
          height="48"
          src="/assets/brand/corukai-normal.svg"
          width="48"
        />
        <span className="brand__text">
          <strong>CoruKai</strong>
          <small>Decide mejor que leer</small>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Navegacion principal">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <ThemeToggle />
    </header>
  );
}
