"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackCoruEvent } from "@/lib/analytics";
import { getProductCoverAlt, type Product } from "@/lib/products";

interface BookRibbonProps {
  products: Product[];
}

const SLOT_COUNT = 9;
let rememberedOffset = 0;

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function BookRibbon({ products }: BookRibbonProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const releaseTimerRef = useRef<number | null>(null);
  const offsetRef = useRef(rememberedOffset);
  const dragRef = useRef<{ x: number; offset: number; pointerId: number } | null>(null);
  const draggedRef = useRef(false);
  const playingRef = useRef(true);
  const visibleRef = useRef(true);
  const selectedRef = useRef<Product | null>(null);
  const motionSyncRef = useRef<() => void>(() => {});
  const [base, setBase] = useState(Math.floor(rememberedOffset));
  const [isPlaying, setIsPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || products.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;

    function draw() {
      if (!root) return;
      const width = root.clientWidth;
      const height = root.clientHeight;
      const fraction = offsetRef.current - Math.floor(offsetRef.current);
      const mobile = width < 761;
      const count = mobile ? 5 : SLOT_COUNT;
      slotRefs.current.forEach((button, index) => {
        if (!button) return;
        button.hidden = index >= count;
        if (index >= count) return;
        const t = (index - fraction) / (count - 2);
        const x = width * (t * 1.12 - .06);
        const y = mobile
          ? height * (.43 + .065 * Math.sin(t * Math.PI * 2))
          : height * (.73 - .47 * (3 * t * t - 2 * t * t * t));
        const tilt = mobile ? Math.sin(t * 5) * 10 : Math.sin(t * 5 - 1) * 17;
        button.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${tilt}deg)`;
      });
    }

    function canMove() {
      return playingRef.current && visibleRef.current && !document.hidden &&
        !selectedRef.current && !dragRef.current &&
        !stage?.querySelector(":focus-visible");
    }

    function animate(time: number) {
      frame = 0;
      if (!canMove()) return;
      offsetRef.current += Math.min(time - previous, 40) * .00012;
      rememberedOffset = offsetRef.current;
      const nextBase = Math.floor(offsetRef.current);
      setBase((current) => current === nextBase ? current : nextBase);
      previous = time;
      draw();
      frame = requestAnimationFrame(animate);
    }

    function syncMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (canMove()) {
        previous = performance.now();
        frame = requestAnimationFrame(animate);
      }
    }
    motionSyncRef.current = syncMotion;

    function release() {
      if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(() => {
        dragRef.current = null;
        releaseTimerRef.current = null;
        syncMotion();
      }, 120);
    }

    function updatePreference() {
      if (reducedMotion.matches) {
        playingRef.current = false;
        setIsPlaying(false);
      }
      syncMotion();
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      syncMotion();
    });
    const resize = new ResizeObserver(draw);
    intersection.observe(root);
    resize.observe(root);
    reducedMotion.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", syncMotion);
    window.addEventListener("pointerup", release);
    stage.addEventListener("focusout", syncMotion);
    updatePreference();
    draw();
    setReady(true);

    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      reducedMotion.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", syncMotion);
      window.removeEventListener("pointerup", release);
      stage.removeEventListener("focusout", syncMotion);
      if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current);
      motionSyncRef.current = () => {};
    };
  }, [products]);

  useEffect(() => {
    selectedRef.current = selected;
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
    if (!selected && dialog?.open) dialog.close();
    motionSyncRef.current();
  }, [selected]);

  function step(direction: number) {
    offsetRef.current += direction;
    rememberedOffset = offsetRef.current;
    setBase(Math.floor(offsetRef.current));
    const root = rootRef.current;
    if (!root) return;
    const width = root.clientWidth;
    const height = root.clientHeight;
    const count = width < 761 ? 5 : SLOT_COUNT;
    slotRefs.current.forEach((button, index) => {
      if (!button || index >= count) return;
      const t = index / (count - 2);
      const x = width * (t * 1.12 - .06);
      const y = width < 761 ? height * (.43 + .065 * Math.sin(t * Math.PI * 2)) : height * (.73 - .47 * (3 * t * t - 2 * t * t * t));
      const tilt = width < 761 ? Math.sin(t * 5) * 10 : Math.sin(t * 5 - 1) * 17;
      button.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${tilt}deg)`;
    });
  }

  if (products.length === 0) return <section className="ck-ribbon ck-ribbon--empty"><h1>La biblioteca te espera.</h1><Link href="/tienda">Ver la biblioteca ↗</Link></section>;

  return (
    <section ref={rootRef} className="ck-ribbon" aria-label="Recorrido de libros">
      <div className="ck-ribbon__intro">
        <p className="ck-ribbon__eyebrow">CoruKai · una biblioteca para curiosear</p>
        <h1>Sin un orden.<em>Con un rumbo.</em></h1>
      </div>
      <div
        ref={stageRef}
        className="ck-ribbon__stage"
        data-ready={ready || undefined}
        role="group"
        aria-label="Portadas: arrastra o utiliza las flechas"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current);
          dragRef.current = { x: event.clientX, offset: offsetRef.current, pointerId: event.pointerId };
          draggedRef.current = false;
          motionSyncRef.current();
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag || event.pointerId !== drag.pointerId) return;
          const delta = event.clientX - drag.x;
          if (Math.abs(delta) <= 7) return;
          draggedRef.current = true;
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          offsetRef.current = drag.offset - delta / ((rootRef.current?.clientWidth ?? 1000) < 761 ? 100 : 155);
          rememberedOffset = offsetRef.current;
          setBase(Math.floor(offsetRef.current));
        }}
        onPointerCancel={() => { draggedRef.current = true; dragRef.current = null; motionSyncRef.current(); }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          step(event.key === "ArrowRight" ? 1 : -1);
        }}
      >
        {Array.from({ length: SLOT_COUNT }, (_, slot) => {
          const book = products[wrap(base + slot, products.length)];
          return (
            <button
              ref={(element) => { slotRefs.current[slot] = element; }}
              className="ck-ribbon__book"
              type="button"
              hidden={slot >= 5}
              aria-label={`Descubrir ${book.title}, de ${book.author}`}
              onFocus={() => motionSyncRef.current()}
              onClick={(event) => {
                if (draggedRef.current && event.detail !== 0) { draggedRef.current = false; return; }
                setSelected(book);
              }}
              key={slot}
            >
              <Image src={book.cover} alt="" width={132} height={198} sizes="(max-width: 760px) 82px, 132px" loading={slot < 5 ? "eager" : "lazy"} />
            </button>
          );
        })}
      </div>
      <div className="ck-ribbon__aside">
        <p>No hace falta saber qué buscas.<br />Una portada puede ser el comienzo.</p>
        <Link className="ck-ribbon__link" href="/descubrir?camino=guiado">Ayúdame a elegir <span aria-hidden="true">↗</span></Link>
        <Link className="ck-ribbon__link ck-ribbon__link--quiet" href="/tienda">Biblioteca · todos los libros <span aria-hidden="true">↗</span></Link>
      </div>
      <p className="ck-ribbon__note">Los mismos libros.<br />Otra forma de encontrarlos.</p>
      <div className="ck-ribbon__bottom">
        <p className="ck-ribbon__hint">Arrastra para recorrer.<br />Toca una portada para descubrir.</p>
        <div className="ck-ribbon__controls">
          <button type="button" aria-label="Libros anteriores" onClick={() => step(-1)}>←</button>
          <button type="button" aria-label="Libros siguientes" onClick={() => step(1)}>→</button>
          <button type="button" aria-label={isPlaying ? "Pausar movimiento de libros" : "Reanudar movimiento de libros"} aria-pressed={!isPlaying} onClick={() => { playingRef.current = !playingRef.current; setIsPlaying(playingRef.current); motionSyncRef.current(); }}>{isPlaying ? "Pausar" : "Reanudar"}</button>
        </div>
      </div>
      <dialog ref={dialogRef} className="ck-ribbon__dialog" aria-labelledby="ribbon-title" onClose={() => setSelected(null)}>
        <form method="dialog"><button type="submit">Cerrar ×</button></form>
        {selected && <><div className="ck-ribbon__detail"><Image src={selected.cover} alt={getProductCoverAlt(selected)} width={120} height={180} sizes="120px" /><div><p>{selected.author}</p><h2 id="ribbon-title">{selected.title}</h2><p>{selected.hook}</p></div></div><Link className="ck-ribbon__link" href={`/libros/${selected.slug}`} onClick={() => trackCoruEvent("product_open", { product: selected.slug, genre: selected.genre, placement: "home_ribbon" })}>Entrar en este libro <span aria-hidden="true">↗</span></Link></>}
      </dialog>
    </section>
  );
}
