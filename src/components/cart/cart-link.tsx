"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

interface CartLinkProps {
  onNavigate?: () => void;
}

export function CartLink({ onNavigate }: CartLinkProps = {}) {
  const { count } = useCart();

  return (
    <Link className="cart-link" href="/cesta" title={`Mi estante: ${count} libros`} onClick={onNavigate}>
      <span className="cart-link__label">Mi estante</span>
      <span className="cart-link__label-mobile">Estante</span>
      <span className="cart-link__count" aria-label={`${count} libros guardados`}>{count}</span>
    </Link>
  );
}
