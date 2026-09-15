import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { LEGAL_UPDATED_AT, legalIdentity } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: false, follow: true },
};

export default function LegalNoticePage() {
  return (
    <LegalDocument
      eyebrow="Marco del proyecto"
      title="Aviso legal"
      introduction="CoruKai es una beta editorial para descubrir libros con menos presión y más contexto."
    >
      <section>
        <h2>Responsable del sitio</h2>
        <address>
          <strong>{legalIdentity.name}</strong><br />
          NIF: {legalIdentity.taxId}<br />
          Domicilio: {legalIdentity.address || "pendiente de completar"}<br />
          Contacto: <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>
        </address>
      </section>
      <section><h2>Qué ofrece CoruKai</h2><p>La web facilita descubrimiento, selección y recomendación de libros. Actualmente no procesa pagos ni envíos: cuando exista un enlace de compra, la operación se completará en la plataforma del vendedor indicada.</p></section>
      <section><h2>Afiliación y relaciones comerciales</h2><p>CoruKai participa en el Programa de Afiliados de Amazon.es. Algunos enlaces son enlaces pagados y pueden generar una comisión por compras adscritas que cumplan los requisitos aplicables, sin incrementar el precio para el usuario. La relación de compraventa se establece entre el usuario y Amazon.</p></section>
      <section><h2>Contenido editorial</h2><p>Las recomendaciones, clasificaciones emocionales y tiempos de lectura son criterios editoriales orientativos. Las cubiertas, títulos y marcas pertenecen a sus respectivos titulares.</p></section>
      <section><h2>Responsabilidad</h2><p>Trabajamos para mantener la información actualizada, pero la edición, el precio y la disponibilidad definitivos son los mostrados por el vendedor en el momento de la compra.</p></section>
      <section><h2>Propiedad intelectual</h2><p>El diseño, los textos editoriales y la identidad de CoruKai pertenecen a sus respectivos titulares. No se autoriza su reproducción o explotación comercial salvo en los casos permitidos por la ley o con autorización expresa.</p></section>
      <section><h2>Ley aplicable</h2><p>Este sitio se dirige principalmente a usuarios en España y se rige por la legislación española, sin perjuicio de los derechos imperativos que correspondan a consumidores de otros territorios.</p></section>
      <p><small>Última actualización: {LEGAL_UPDATED_AT}.</small></p>
    </LegalDocument>
  );
}
