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
  const { add } = useCart();
  const [added, setAdded] = useState(false);

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
      {added ? "Añadido" : "Añadir a mi selección"}
      <span aria-hidden="true">{added ? "✓" : "+"}</span>
    </button>
  );
}

