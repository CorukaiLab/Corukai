import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { getAllProducts } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Mi estante",
  robots: { index: false, follow: false },
};

export default async function CartRoute() {
  const products = await getAllProducts();
  return <CartPage products={products} />;
}
