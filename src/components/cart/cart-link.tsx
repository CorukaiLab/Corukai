"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link className="cart-link" href="/cesta" aria-label={`Mi selección, ${count} libros`}>
      Mi selección
      <span aria-hidden="true">{count}</span>
    </Link>
  );
}

