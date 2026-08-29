"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { trackCoruEvent } from "@/lib/analytics";

export function AddToCartButton({
  slug,
  placement = "ficha",
  compact = false,
}: {
  slug: string;
  placement?: "catalogo" | "ficha";
  compact?: boolean;
}) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const isOnShelf = items.some((item) => item.slug === slug);
  const isSaved = added || isOnShelf;
  const label = isSaved ? "En mi estante" : "Guardar en mi estante";

  function handleAdd() {
    add(slug);
    if (!isOnShelf) trackCoruEvent("shelf_add", { product: slug, placement });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      className={compact ? "add-button add-button--compact" : "add-button"}
      type="button"
      onClick={handleAdd}
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
    >
      {!compact && label}
      <span aria-hidden="true">{isSaved ? "✓" : "+"}</span>
    </button>
  );
}
