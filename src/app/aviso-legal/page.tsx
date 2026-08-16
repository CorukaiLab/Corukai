import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Aviso legal" };

export default function LegalNoticePage() {
  return (
    <LegalDocument
      eyebrow="Marco del proyecto"
      title="Aviso legal"
      introduction="CoruKai es una beta editorial para descubrir libros con menos presión y más contexto."
    >
      <section><h2>Responsable del sitio</h2><p>CoruKai es un proyecto editorial independiente en fase beta. El canal de contacto es <a href="mailto:hola@corukai.com">hola@corukai.com</a>. Los datos identificativos y fiscales completos del titular se incorporarán antes del inicio de cualquier venta directa.</p></section>
      <section><h2>Qué ofrece CoruKai</h2><p>La web facilita descubrimiento, selección y recomendación de libros. Actualmente no procesa pagos ni envíos: cuando exista un enlace de compra, la operación se completará en la plataforma del vendedor indicada.</p></section>
      <section><h2>Contenido editorial</h2><p>Las recomendaciones, clasificaciones emocionales y tiempos de lectura son criterios editoriales orientativos. Las cubiertas, títulos y marcas pertenecen a sus respectivos titulares.</p></section>
      <section><h2>Responsabilidad</h2><p>Trabajamos para mantener la información actualizada, pero la edición, el precio y la disponibilidad definitivos son los mostrados por el vendedor en el momento de la compra.</p></section>
    </LegalDocument>
  );
}
