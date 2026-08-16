import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Tecnología necesaria"
      title="Cookies y almacenamiento"
      introduction="La beta evita la publicidad comportamental y utiliza el mínimo almacenamiento posible."
    >
      <section><h2>Almacenamiento esencial</h2><p>CoruKai utiliza almacenamiento local para recordar los libros de “Mi estante”. Esta información permanece en tu dispositivo y puedes eliminarla vaciando el estante o los datos del navegador.</p></section>
      <section><h2>Medición</h2><p>Vercel Analytics y Speed Insights ayudan a medir rendimiento y uso agregado. No empleamos estos datos para construir perfiles publicitarios personales.</p></section>
      <section><h2>Servicios externos</h2><p>Amazon, MailerLite y otros servicios enlazados pueden establecer sus propias cookies cuando interactúas con ellos. CoruKai no controla ese almacenamiento externo.</p></section>
      <section><h2>Cómo controlar el almacenamiento</h2><p>Puedes borrar o bloquear cookies y almacenamiento local desde la configuración de tu navegador. El bloqueo del almacenamiento local impedirá conservar el estante entre visitas.</p></section>
    </LegalDocument>
  );
}
