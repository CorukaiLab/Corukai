"use client";

import { useId, useState, useSyncExternalStore } from "react";

interface CreativeSparkCardProps {
  slug: string;
  prompt: string;
}

export function CreativeSparkCard({ slug, prompt }: CreativeSparkCardProps) {
  const inputId = useId();
  const storageKey = `corukai:spark:${slug}`;
  const storedAnswer = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    () => window.localStorage.getItem(storageKey) ?? "",
    () => "",
  );
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const answer = draft ?? storedAnswer;

  function saveAnswer() {
    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      setStatus("Escribe una línea antes de guardarla.");
      return;
    }
    window.localStorage.setItem(storageKey, trimmedAnswer);
    setDraft(trimmedAnswer);
    setStatus("Guardado en este dispositivo.");
  }

  return (
    <section className="creative-spark-card" aria-labelledby={`${inputId}-title`}>
      <div className="creative-spark-card__mark" aria-hidden="true">✦</div>
      <div className="creative-spark-card__prompt">
        <p className="eyebrow">La lectura continúa fuera del libro</p>
        <h2 id={`${inputId}-title`}>Una chispa para llevarte.</h2>
        <p>{prompt}</p>
      </div>
      <div className="creative-spark-card__answer">
        <label htmlFor={inputId}>Prueba con una sola imagen o frase</label>
        <textarea
          id={inputId}
          value={answer}
          onChange={(event) => {
            setDraft(event.target.value);
            setStatus("");
          }}
          placeholder="Empieza aquí, sin hacerlo perfecto…"
          rows={4}
        />
        <div>
          <button type="button" onClick={saveAnswer}>Guardar para mí</button>
          <span aria-live="polite">{status}</span>
        </div>
      </div>
    </section>
  );
}
