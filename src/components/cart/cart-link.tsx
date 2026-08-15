"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link className="cart-link" href="/cesta" title={`Mi estante: ${count} libros`}>
      Mi estante
      <span>{count}</span>
    </Link>
  );
}
