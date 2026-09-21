import type { Product } from "@/lib/products";

const correctedLabels: Record<string, string> = {
  Fantasia: "Fantasía",
  "Ciencia ficcion": "Ciencia ficción",
  Historica: "Histórica",
  Melancolia: "Melancolía",
  "Angelica Gorodischer": "Angélica Gorodischer",
};

export function correctCatalogLabel(value: string) {
  return correctedLabels[value] || value;
}

export function correctProductLabels(product: Product): Product {
  return {
    ...product,
    author: correctCatalogLabel(product.author),
    genre: correctCatalogLabel(product.genre),
    mood: correctCatalogLabel(product.mood),
  };
}
