"use client";

import { useEffect } from "react";
import { trackCoruEvent } from "@/lib/analytics";

export function ProductViewTracker({ slug, genre }: { slug: string; genre: string }) {
  useEffect(() => {
    trackCoruEvent("product_view", { product: slug, genre });
  }, [genre, slug]);

  return null;
}
