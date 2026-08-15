"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";

export function AddToCartButton({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const isOnShelf = items.some((item) => item.slug === slug);

  function handleAdd() {
    add(slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      className={compact ? "add-button add-button--compact" : "add-button"}
      type="button"
      onClick={handleAdd}
    >
      {added || isOnShelf ? "En mi estante" : "Guardar en mi estante"}
      <span aria-hidden="true">{added || isOnShelf ? "✓" : "+"}</span>
    </button>
  );
}
