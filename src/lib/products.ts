export type ReadingTime = "Una tarde" | "Varias noches" | "Sin prisa";
export type ReadingPace = "Sereno" | "Envolvente" | "Intenso";
export type StoryEntry = "Volver" | "Viajar" | "Sentir" | "Pensar" | "Crear";

export type Product = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  mood: string;
  priceCents: number;
  cover: string;
  accent: string;
  hook: string;
  description: string;
  idealMoment: string;
  format: string;
  year: number;
  readingTime: ReadingTime;
  pace: ReadingPace;
  entry: StoryEntry;
  pages?: number;
  creativeSpark: string;
  coruNote: string;
  isbn?: string;
  affiliateUrl?: string;
  isCoruPick: boolean;
};

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}
