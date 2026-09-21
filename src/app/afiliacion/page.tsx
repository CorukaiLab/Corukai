import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = {
  title: "Cómo funciona la compra y la afiliación",
  description: "Cómo elige libros CoruKai, qué significa un enlace pagado y qué parte de la compra se realiza en Amazon.",
  alternates: { canonical: "/afiliacion" },
};

export default function AffiliateInfoPage() {
  return (
    <LegalDocument
      eyebrow="De CoruKai a tu libro"
      title="Compra y afiliación"
      introduction="CoruKai te ayuda a elegir. Amazon confirma la edición y completa la compra."
    >
      <section><h2>Quién selecciona</h2><p>CoruKai es un proyecto editorial independiente. La selección se organiza por atmósfera, ritmo, momento de lectura y la pregunta que puede dejar cada libro; no por puestos de ventas ni puntuaciones. El responsable del proyecto y su contacto figuran en el <a href="/aviso-legal">aviso legal</a>.</p></section>
      <section><h2>El recorrido</h2><ol><li>Descubres un libro y puedes guardarlo en tu estante.</li><li>Abres el enlace pagado de la edición recomendada.</li><li>Amazon muestra el precio, disponibilidad y condiciones vigentes.</li><li>El pago, envío, devolución y atención posventa se realizan en Amazon.</li></ol></section>
      <section><h2>Qué significa “Enlace pagado”</h2><p>CoruKai participa en el Programa de Afiliados de Amazon.es. Si realizas una compra adscrita después de usar uno de estos enlaces, CoruKai puede recibir una comisión sin incrementar por ello el precio que pagas.</p></section>
      <section><h2>Precios y ediciones</h2><p>CoruKai solo muestra un precio cuando procede de la API oficial autorizada de Amazon. Si ese dato no está disponible, verás “Consultar en Amazon”. Los precios y la disponibilidad son precisos en la fecha y hora indicadas y están sujetos a cambios. El precio y disponibilidad mostrados en Amazon en el momento de la compra prevalecen sobre cualquier información anterior.</p></section>
      <section><h2>Varios libros</h2><p>El estante de CoruKai es una lista de posibilidades, no una cesta de pago. Cada enlace abre el libro correspondiente en Amazon; la cesta final y cualquier agrupación de productos dependen de Amazon.</p></section>
    </LegalDocument>
  );
}
