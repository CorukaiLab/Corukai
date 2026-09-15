import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { NEWSLETTER_ENABLED } from "@/lib/features";
import { LEGAL_UPDATED_AT, legalIdentity } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacidad",
  alternates: { canonical: "/privacidad" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Tus datos, sin rodeos"
      title="Privacidad"
      introduction="Recogemos únicamente lo necesario para que CoruKai funcione y nunca recibimos tus datos bancarios."
    >
      <section><h2>Responsable y contacto</h2><p>El responsable del tratamiento es el titular identificado en el <a href="/aviso-legal">aviso legal</a>. Para cualquier consulta de privacidad puedes escribir a <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>.</p></section>
      <section><h2>Qué datos tratamos</h2><p>El estante y las respuestas creativas se guardan únicamente en tu navegador. La medición técnica registra páginas, dispositivo, país aproximado y uso agregado, sin pedir nombre, cuenta ni perfil personal.</p></section>
      <section><h2>Finalidad y base jurídica</h2><p>La medición agregada y la seguridad técnica responden al interés legítimo de mantener y mejorar el servicio, con un impacto reducido sobre la privacidad.</p></section>
      <section><h2>Conservación</h2><p>Los datos guardados en tu dispositivo permanecen hasta que vacías el estante, borras una respuesta o eliminas los datos del navegador. Los datos agregados de Vercel no permiten reconstruir tu actividad entre días o sitios.</p></section>
      <section><h2>Proveedores y transferencias</h2><p><a href="https://vercel.com/legal/privacy-policy" rel="external nofollow">Vercel</a> aloja y mide el sitio y <a href="https://www.sanity.io/legal/privacy" rel="external nofollow">Sanity</a> gestiona el contenido. Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías contractuales aplicables. Al abrir Amazon, esa navegación queda sujeta a su propia política.</p></section>
      <section><h2>Tus derechos</h2><p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a <a href={`mailto:${legalIdentity.email}`}>{legalIdentity.email}</a>. También puedes reclamar ante la <a href="https://www.aepd.es/" rel="external nofollow">Agencia Española de Protección de Datos</a>.</p></section>
      {NEWSLETTER_ENABLED ? <section><h2>Carta de CoruKai</h2><p>Si la carta vuelve a activarse, antes de recoger ningún correo explicaremos su finalidad, consentimiento, conservación y mecanismo de baja.</p></section> : null}
      <p><small>Última actualización: {LEGAL_UPDATED_AT}.</small></p>
    </LegalDocument>
  );
}
