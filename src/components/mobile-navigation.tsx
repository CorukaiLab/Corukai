"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="mobile-navigation">
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-controls="mobile-menu-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen ? (
        <>
          <button className="mobile-menu-backdrop" type="button" aria-label="Cerrar menú" onClick={closeMenu} />
          <nav id="mobile-menu-panel" className="mobile-menu-panel" aria-label="Navegación móvil">
            <Link href="/" onClick={closeMenu}>Inicio</Link>
            <Link href="/#descubrir" onClick={closeMenu}>Descubrir</Link>
            <Link className="mobile-library-link" href="/tienda" onClick={closeMenu}>
              Biblioteca <span aria-hidden="true">↗</span>
            </Link>
            <div className="mobile-menu-cart">
              <CartLink onNavigate={closeMenu} />
            </div>
          </nav>
        </>
      ) : null}
    </div>
  );
}
