import { getAmazonPriceLabel, type Product } from "@/lib/products";

export function AmazonPrice({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <span className={`amazon-price${compact ? " amazon-price--compact" : ""}`}>
      <strong>{getAmazonPriceLabel(product)}</strong>
      <small>{product.amazonOffer ? "precio Amazon verificado" : "precio y disponibilidad al abrir"}</small>
    </span>
  );
}
