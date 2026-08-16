import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Tus datos, sin rodeos"
      title="Privacidad"
      introduction="Recogemos únicamente lo necesario para que CoruKai funcione y nunca recibimos tus datos bancarios."
    >
      <section><h2>Qué datos tratamos</h2><p>Si te apuntas a la carta, tratamos tu correo electrónico y el consentimiento asociado. El estante se guarda localmente en tu navegador. La analítica técnica puede registrar páginas visitadas, dispositivo y eventos agregados como clics de afiliación.</p></section>
      <section><h2>Para qué los usamos</h2><p>El correo se usa exclusivamente para enviar la carta de CoruKai. Los datos técnicos sirven para detectar errores y entender qué partes de la experiencia resultan útiles.</p></section>
      <section><h2>Proveedores</h2><p>La web se aloja en Vercel. La newsletter está preparada para MailerLite. Sanity gestiona contenido editorial. Al abrir un enlace de Amazon, su propia política de privacidad pasa a regir esa navegación.</p></section>
      <section><h2>Tus derechos</h2><p>Puedes solicitar acceso, rectificación, supresión u oposición escribiendo a <a href="mailto:hola@corukai.com">hola@corukai.com</a>. Cada correo de la newsletter incluirá también una opción de baja.</p></section>
    </LegalDocument>
  );
}
