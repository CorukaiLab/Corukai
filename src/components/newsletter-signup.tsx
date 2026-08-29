"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { trackCoruEvent } from "@/lib/analytics";

interface NewsletterResponse {
  message?: string;
}

export function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json() as NewsletterResponse;
      if (!response.ok) throw new Error(data.message || "No hemos podido guardar tu correo.");
      setStatus("success");
      setMessage(data.message || "Ya estás dentro. La próxima carta llegará sin hacer ruido.");
      trackCoruEvent("newsletter_signup", { placement: "home" });
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No hemos podido guardar tu correo.");
    }
  }

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-intro">
        <p className="eyebrow">Una pequeña dosis de curiosidad</p>
        <h2 id="newsletter-title">Una historia para este momento.</h2>
        <div className="newsletter-preview" aria-label="Contenido de cada carta">
          <span>En cada carta</span>
          <p><b>01</b> libro elegido con una razón</p>
          <p><b>01</b> conexión cultural inesperada</p>
          <p><b>01</b> chispa creativa para continuar</p>
        </div>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email">Tu correo</label>
        <div className="newsletter-field">
          <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" required />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Guardando…" : "Quiero recibirla"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <label className="newsletter-consent">
          <input name="consent" type="checkbox" required />
          <span>Acepto recibir la carta quincenal y he leído la <Link href="/privacidad">política de privacidad</Link>.</span>
        </label>
        <p>Dos viernes al mes. Puedes salir con un clic. Sin ruido ni cesión de tus datos.</p>
        <p className={`newsletter-status newsletter-status--${status}`} aria-live="polite">{message}</p>
      </form>
    </section>
  );
}
