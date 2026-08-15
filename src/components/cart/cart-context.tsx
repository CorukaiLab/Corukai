"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "corukai-selection-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(value: string): CartItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  const slugs = parsed.flatMap((item) => {
    if (!item || typeof item !== "object" || !("slug" in item)) return [];
    return typeof item.slug === "string" && item.slug ? [item.slug] : [];
  });

  return [...new Set(slugs)].map((slug) => ({ slug, quantity: 1 }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setItems(readStoredItems(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const add = useCallback((slug: string) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug);
      if (!existing) return [...current, { slug, quantity: 1 }];
      return current;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const count = items.length;
  const value = useMemo(
    () => ({ items, count, add, remove, clear }),
    [items, count, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
