import { NextResponse } from "next/server";
import { NEWSLETTER_ENABLED } from "@/lib/features";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!NEWSLETTER_ENABLED) {
    return NextResponse.json({ message: "La carta no está disponible actualmente." }, { status: 404 });
  }

  const body = await request.json().catch(() => null) as {
    email?: unknown;
    consent?: unknown;
    website?: unknown;
  } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  // A completed honeypot is treated as a successful submission to avoid helping bots adapt.
  if (typeof body?.website === "string" && body.website.trim()) {
    return NextResponse.json({ message: "Ya estás dentro. La próxima carta llegará sin hacer ruido." });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Revisa el correo antes de continuar." }, { status: 400 });
  }

  if (body?.consent !== true) {
    return NextResponse.json({ message: "Necesitamos tu consentimiento para enviarte la carta." }, { status: 400 });
  }

  const token = process.env.MAILERLITE_API_TOKEN;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!token) {
    return NextResponse.json(
      { message: "La carta todavía no está conectada. Prueba de nuevo cuando abramos la lista." },
      { status: 503 },
    );
  }

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      ...(groupId ? { groups: [groupId] } : {}),
      status: "unconfirmed",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("MailerLite subscription failed", { status: response.status });
    return NextResponse.json(
      { message: "No hemos podido guardar tu correo. Inténtalo de nuevo en unos minutos." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Ya estás dentro. La próxima carta llegará sin hacer ruido." });
}
