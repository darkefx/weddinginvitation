"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  /** What lies under the foil. */
  children: ReactNode;
  /** Two short lines printed on the foil. */
  foilText: string[];
  /** Share of the foil that must be rubbed away before it lifts (0 to 1). */
  threshold?: number;
  onReveal: () => void;
};

/**
 * A gold-foil panel that is rubbed away with a finger or the mouse.
 * Keyboard and screen-reader users get a plain "Reveal" button instead.
 */
export function ScratchCard({ children, foilText, threshold = 0.55, onReveal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const touched = useRef(false);
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || touched.current) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const foil = ctx.createLinearGradient(0, 0, w, h);
    foil.addColorStop(0, "#a97f33");
    foil.addColorStop(0.18, "#e6cf97");
    foil.addColorStop(0.36, "#c29a4c");
    foil.addColorStop(0.55, "#f2e3b8");
    foil.addColorStop(0.75, "#b48a3c");
    foil.addColorStop(1, "#dcc284");
    ctx.fillStyle = foil;
    ctx.fillRect(0, 0, w, h);

    // Fine grain so the foil reads as metal leaf rather than a flat gradient.
    for (let i = 0; i < (w * h) / 260; i++) {
      const light = Math.random() > 0.5;
      ctx.fillStyle = light ? `rgba(255,250,225,${Math.random() * 0.22})` : `rgba(96,66,14,${Math.random() * 0.16})`;
      const s = (Math.random() * 1.6 + 0.4) * dpr;
      ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
    }

    ctx.strokeStyle = "rgba(92,64,14,0.45)";
    ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(7 * dpr, 7 * dpr, w - 14 * dpr, h - 14 * dpr);

    const family = getComputedStyle(canvas).fontFamily || "serif";
    ctx.fillStyle = "rgba(70,47,8,0.82)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(17 * dpr)}px ${family}`;
    const gap = 26 * dpr;
    const top = h / 2 - ((foilText.length - 1) * gap) / 2;
    foilText.forEach((text, i) => ctx.fillText(text, w / 2, top + i * gap));
  }, [foilText]);

  useEffect(() => {
    paintFoil();
    // Repaint once the display font is in, and if the card is resized before use.
    document.fonts?.ready.then(paintFoil).catch(() => undefined);
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(paintFoil);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paintFoil]);

  const reveal = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    onReveal();
  }, [onReveal]);

  const clearedShare = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 40) clear++;
    }
    return total ? clear / total : 0;
  };

  const rub = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    const from = lastPoint.current ?? { x, y };

    touched.current = true;
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // fully opaque, so one pass lifts the foil cleanly
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = (event.pointerType === "mouse" ? 40 : 46) * scale;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x + 0.01, y + 0.01);
    ctx.stroke();
    lastPoint.current = { x, y };
  };

  const onDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (doneRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPoint.current = null;
    rub(event);
  };

  const onMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (doneRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    rub(event);
    if (++moves.current % 10 === 0 && clearedShare() >= threshold) reveal();
  };

  const onUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    lastPoint.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!doneRef.current && clearedShare() >= threshold) reveal();
  };

  return (
    <div className="relative h-full w-full">
      <div className="flex h-full w-full items-center justify-center" aria-hidden={!done}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none select-none font-display transition-opacity duration-700 ${
          done ? "pointer-events-none opacity-0" : "cursor-grab opacity-100 active:cursor-grabbing"
        }`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-hidden="true"
      />
      {!done && (
        <button
          type="button"
          onClick={reveal}
          className="sr-only focus:not-sr-only focus:absolute focus:bottom-2 focus:left-1/2 focus:z-10 focus:-translate-x-1/2 focus:bg-niche focus:px-3 focus:py-1 focus:text-sm"
        >
          Reveal the wedding date
        </button>
      )}
    </div>
  );
}
