import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { LEGAL_UPDATED_AT } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookies",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Tecnología necesaria"
      title="Cookies y almacenamiento"
      introduction="La beta evita la publicidad comportamental y utiliza el mínimo almacenamiento posible."
    >
      <section><h2>Almacenamiento esencial</h2><p>CoruKai utiliza <code>localStorage</code> para recordar los libros de “Mi estante”. Esta información permanece en tu dispositivo, no se transmite al servidor y puedes eliminarla vaciando el estante o los datos del navegador.</p></section>
      <section><h2>Medición sin cookies</h2><p>Vercel Web Analytics y Speed Insights miden visitas, uso agregado y rendimiento sin instalar cookies publicitarias ni crear perfiles entre sitios. Los eventos personalizados nunca incluyen tu nombre, correo u otros identificadores directos.</p></section>
      <section><h2>Servicios externos</h2><p>Amazon y otros servicios enlazados pueden establecer sus propias cookies cuando interactúas con ellos. CoruKai no controla ese almacenamiento externo.</p></section>
      <section><h2>Cómo controlar el almacenamiento</h2><p>Puedes borrar o bloquear cookies y almacenamiento local desde la configuración de tu navegador. El bloqueo del almacenamiento local impedirá conservar el estante entre visitas.</p></section>
      <section><h2>Cambios futuros</h2><p>Si CoruKai incorpora tecnologías no esenciales que requieran consentimiento, se mostrará un panel que permita aceptar, rechazar y configurar esas tecnologías con el mismo nivel de facilidad.</p></section>
      <p><small>Última actualización: {LEGAL_UPDATED_AT}.</small></p>
    </LegalDocument>
  );
}
