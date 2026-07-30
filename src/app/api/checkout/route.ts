import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/catalog";

type CheckoutBody = {
  items?: Array<{ slug?: string; quantity?: number }>;
};

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json(
      {
        message:
          "La beta ha guardado tu selección, pero el cobro aún no está activado. Falta conectar la cuenta comercial de Stripe.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ message: "Solicitud no válida." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return NextResponse.json({ message: "La selección está vacía o no es válida." }, { status: 400 });
  }

  const validated = body.items.map((item) => {
    const product = PRODUCTS.find((entry) => entry.slug === item.slug);
    const quantity = Math.min(Math.max(Math.floor(item.quantity || 0), 1), 9);
    return product ? { product, quantity } : null;
  });

  if (validated.some((item) => item === null)) {
    return NextResponse.json({ message: "Uno de los productos ya no está disponible." }, { status: 400 });
  }

  const url = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const form = new URLSearchParams({
    mode: "payment",
    success_url: `${siteUrl}/?compra=correcta`,
    cancel_url: `${siteUrl}/cesta?compra=cancelada`,
    "automatic_tax[enabled]": "true",
    allow_promotion_codes: "false",
  });

  validated.forEach((line, index) => {
    if (!line) return;
    form.set(`line_items[${index}][quantity]`, String(line.quantity));
    form.set(`line_items[${index}][price_data][currency]`, "eur");
    form.set(`line_items[${index}][price_data][unit_amount]`, String(line.product.priceCents));
    form.set(`line_items[${index}][price_data][product_data][name]`, line.product.title);
    form.set(
      `line_items[${index}][price_data][product_data][description]`,
      `${line.product.author} · ${line.product.format}`,
    );
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const stripeData = (await stripeResponse.json()) as { url?: string; error?: { message?: string } };

  if (!stripeResponse.ok || !stripeData.url) {
    return NextResponse.json(
      { message: stripeData.error?.message || "Stripe no pudo crear la sesión de pago." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: stripeData.url });
}

