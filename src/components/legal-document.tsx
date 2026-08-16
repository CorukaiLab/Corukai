import Link from "next/link";
import type { ReactNode } from "react";

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}

export function LegalDocument({ eyebrow, title, introduction, children }: LegalDocumentProps) {
  return (
    <main className="legal-page">
      <header className="legal-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{introduction}</p>
        <span>Última revisión · 16 de agosto de 2026</span>
      </header>
      <div className="legal-layout">
        <nav aria-label="Documentos legales">
          <strong>Información clara</strong>
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/afiliacion">Afiliación y compra</Link>
        </nav>
        <article className="legal-content">{children}</article>
      </div>
    </main>
  );
}
