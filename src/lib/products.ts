export type ReadingTime = "Una tarde" | "Varias noches" | "Sin prisa";
export type ReadingPace = "Sereno" | "Envolvente" | "Intenso";
export type StoryEntry = "Volver" | "Viajar" | "Sentir" | "Pensar" | "Crear";

export interface AmazonOffer {
  amount: number;
  currency: string;
  displayAmount: string;
  availability?: string;
  fetchedAt: string;
}

export type Product = {
  slug: string;
  title: string;
  author: string;
  genre: string;
  mood: string;
  priceCents: number;
  amazonAsin?: string;
  amazonOffer?: AmazonOffer;
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
  seoTitle?: string;
  seoDescription?: string;
  affiliateUrl?: string;
  isCoruPick: boolean;
};

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}

export function getAmazonPriceLabel(product: Product) {
  return product.amazonOffer?.displayAmount || "Consultar en Amazon";
}
