import Image from "next/image";
import Link from "next/link";

export function DiscoveryGateway() {
  return (
    <section className="discovery-gateway" id="descubrir" aria-labelledby="discovery-gateway-title">
      <div className="discovery-gateway__intro">
        <p className="discovery-gateway__eyebrow">Descubrir · sin prisa</p>
        <h2 id="discovery-gateway-title">Un libro para <em>este momento.</em></h2>
        <p>Elige cómo quieres empezar. Lo demás puede esperar.</p>
      </div>
      <div className="discovery-gateway__doors">
        <Link className="discovery-gateway__door discovery-gateway__door--guided" href="/descubrir?camino=guiado">
          <span className="discovery-gateway__tag">Guíame</span>
          <span className="discovery-gateway__seal" aria-hidden="true"><Image src="/assets/brand/corukai-normal.svg" alt="" width={54} height={62} /></span>
          <strong>No sé qué leer</strong>
          <span>Empecemos por cómo te quieres sentir.</span>
          <b>Encontrar mi camino <span aria-hidden="true">→</span></b>
        </Link>
        <Link className="discovery-gateway__door discovery-gateway__door--direct" href="/descubrir?camino=directo">
          <span className="discovery-gateway__tag">Búsqueda directa</span>
          <strong>Tengo algo en mente</strong>
          <span>Un título, un autor o un género. Sin preguntas previas.</span>
          <b>Ir a la búsqueda <span aria-hidden="true">→</span></b>
        </Link>
      </div>
    </section>
  );
}
