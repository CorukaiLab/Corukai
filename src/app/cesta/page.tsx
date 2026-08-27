import { CartPage } from "@/components/cart/cart-page";
import { getAllProducts } from "@/sanity/lib/queries";

export default async function CartRoute() {
  const products = await getAllProducts();
  return <CartPage products={products} />;
}
