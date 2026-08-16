import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Revisa el correo antes de continuar." }, { status: 400 });
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
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "No hemos podido guardar tu correo. Inténtalo de nuevo en unos minutos." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Ya estás dentro. La próxima carta llegará sin hacer ruido." });
}
