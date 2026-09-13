"use client";
import { useCallback, useRef, useState } from "react";

export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    update(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    update(e.clientX);
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") setPos((v) => Math.max(4, v - 4));
    if (e.key === "ArrowRight") setPos((v) => Math.min(96, v + 4));
    if (e.key === "Home") setPos(4);
    if (e.key === "End") setPos(96);
  }

  return (
    <div
      ref={trackRef}
      className="ba-track"
      role="slider"
      aria-label={`Comparar antes e depois: ${alt}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={alt} className="ba-img ba-after" loading="lazy" />
      <div className="ba-before-wrap" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="" className="ba-img" loading="lazy" aria-hidden="true" />
        <span className="ba-badge ba-badge-before">Antes</span>
      </div>
      <span className="ba-badge ba-badge-after">Depois</span>
      <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <span />
      </div>
      <div className="ba-line" style={{ left: `${pos}%` }} aria-hidden="true" />
    </div>
  );
}
