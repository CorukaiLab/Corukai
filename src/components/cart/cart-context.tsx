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

export interface ShelfList {
  id: string;
  label: string;
  isCustom?: boolean;
}

export interface ShelfItem {
  slug: string;
  statusId: string;
  customListIds: string[];
}

export const STANDARD_SHELF_LISTS: ShelfList[] = [
  { id: "por-leer", label: "Por leer" },
  { id: "leyendo", label: "Leyendo" },
  { id: "leido", label: "Leído" },
  { id: "regalar", label: "Para regalar" },
];

interface CartContextValue {
  items: ShelfItem[];
  lists: ShelfList[];
  count: number;
  add: (slug: string, statusId?: string) => void;
  setStatus: (slug: string, statusId: string) => void;
  toggleCustomList: (slug: string, listId: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  addList: (name: string) => "created" | "exists" | "invalid";
  removeList: (listId: string) => void;
}

const STORAGE_KEY = "corukai-selection-v1";
const CUSTOM_LISTS_KEY = "corukai-custom-shelves-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredItems(value: string): ShelfItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  const entries: ShelfItem[] = parsed.flatMap((item: unknown): ShelfItem[] => {
    if (!item || typeof item !== "object" || !("slug" in item)) return [];
    if (typeof item.slug !== "string" || !item.slug) return [];
    const legacyListId = "listId" in item && typeof item.listId === "string" ? item.listId : "";
    const storedStatusId = "statusId" in item && typeof item.statusId === "string" ? item.statusId : "";
    const statusId = STANDARD_SHELF_LISTS.some((list) => list.id === storedStatusId)
      ? storedStatusId
      : STANDARD_SHELF_LISTS.some((list) => list.id === legacyListId) ? legacyListId : "por-leer";
    const rawCustomListIds: unknown[] = "customListIds" in item && Array.isArray(item.customListIds)
      ? item.customListIds
      : legacyListId && !STANDARD_SHELF_LISTS.some((list) => list.id === legacyListId) ? [legacyListId] : [];
    const storedCustomListIds = rawCustomListIds.filter((id): id is string => typeof id === "string");
    return [{ slug: item.slug, statusId, customListIds: [...new Set(storedCustomListIds)] }];
  });

  return entries.filter((item, index) => entries.findIndex((entry) => entry.slug === item.slug) === index);
}

function readStoredLists(value: string): ShelfList[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    if (!item || typeof item !== "object" || !("id" in item) || !("label" in item)) return [];
    if (typeof item.id !== "string" || typeof item.label !== "string") return [];
    return [{ id: item.id, label: item.label, isCustom: true }];
  });
}

function listIdFromName(name: string) {
  const base = name.toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `propia-${base || "lista"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [customLists, setCustomLists] = useState<ShelfList[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedItems = window.localStorage.getItem(STORAGE_KEY);
        const savedLists = window.localStorage.getItem(CUSTOM_LISTS_KEY);
        if (savedItems) setItems(readStoredItems(savedItems));
        if (savedLists) setCustomLists(readStoredLists(savedLists));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(CUSTOM_LISTS_KEY);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(customLists));
  }, [customLists, hydrated, items]);

  const add = useCallback((slug: string, statusId = "por-leer") => {
    setItems((current) => current.some((item) => item.slug === slug)
      ? current
      : [...current, { slug, statusId, customListIds: [] }]);
  }, []);

  const setStatus = useCallback((slug: string, statusId: string) => {
    setItems((current) => current.some((item) => item.slug === slug)
      ? current.map((item) => item.slug === slug ? { ...item, statusId } : item)
      : [...current, { slug, statusId, customListIds: [] }]);
  }, []);

  const toggleCustomList = useCallback((slug: string, listId: string) => {
    setItems((current) => current.some((item) => item.slug === slug)
      ? current.map((item) => item.slug !== slug ? item : {
        ...item,
        customListIds: item.customListIds.includes(listId)
          ? item.customListIds.filter((id) => id !== listId)
          : [...item.customListIds, listId],
      })
      : [...current, { slug, statusId: "por-leer", customListIds: [listId] }]);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const addList = useCallback((name: string) => {
    const label = name.trim();
    if (!label) return "invalid";
    const id = listIdFromName(label);
    if (customLists.some((list) => list.id === id)) return "exists";
    setCustomLists((current) => [...current, { id, label, isCustom: true }]);
    return "created";
  }, [customLists]);

  const removeList = useCallback((listId: string) => {
    setCustomLists((current) => current.filter((list) => list.id !== listId));
    setItems((current) => current.map((item) => ({
      ...item,
      customListIds: item.customListIds.filter((id) => id !== listId),
    })));
  }, []);

  const lists = useMemo(() => [...STANDARD_SHELF_LISTS, ...customLists], [customLists]);
  const count = items.length;
  const value = useMemo(
    () => ({ items, lists, count, add, setStatus, toggleCustomList, remove, clear, addList, removeList }),
    [items, lists, count, add, setStatus, toggleCustomList, remove, clear, addList, removeList],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
