import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__number" aria-hidden="true">404</div>
      <div className="not-found-page__copy">
        <p className="eyebrow">Página no encontrada</p>
        <h1>Este capítulo no está aquí.</h1>
        <p>Puede que la dirección haya cambiado. La próxima historia sigue esperándote.</p>
        <div className="not-found-page__links">
          <Link className="button button--coral" href="/tienda">Volver a descubrir <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/">Ir al inicio</Link>
        </div>
      </div>
    </main>
  );
}
