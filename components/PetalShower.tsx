"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const SHADES = ["#b63e52", "#c9566a", "#de8793", "#eab4ba", "#a53246"];
const DURATION_MS = 3300;

type Petal = {
  id: number;
  left: number;
  top: number;
  dx: number;
  dy: number;
  size: number;
  spin: number;
  turn: number;
  delay: number;
  duration: number;
  color: string;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makePetals(card: DOMRect, vw: number, vh: number): Petal[] {
  const petals: Petal[] = [];
  let id = 0;

  // From the top of the screen.
  for (let i = 0; i < 30; i++) {
    petals.push({
      id: id++,
      left: rand(0, vw),
      top: -30,
      dx: rand(-70, 70),
      dy: vh + 80,
      size: rand(12, 22),
      spin: rand(0, 360),
      turn: rand(-360, 360),
      delay: rand(0, 0.7),
      duration: rand(2.1, 2.6),
      color: SHADES[i % SHADES.length],
    });
  }

  // From around the edge of the card, drifting outwards and then down.
  for (let i = 0; i < 22; i++) {
    const side = i % 4;
    const along = Math.random();
    const x = side === 0 || side === 2 ? card.left + along * card.width : side === 1 ? card.right : card.left;
    const y = side === 1 || side === 3 ? card.top + along * card.height : side === 0 ? card.top : card.bottom;
    const outX = (x - (card.left + card.width / 2)) / (card.width / 2);
    petals.push({
      id: id++,
      left: x,
      top: y,
      dx: outX * rand(40, 120),
      dy: rand(180, 420),
      size: rand(10, 18),
      spin: rand(0, 360),
      turn: rand(-300, 300),
      delay: rand(0, 0.35),
      duration: rand(1.9, 2.7),
      color: SHADES[(i + 2) % SHADES.length],
    });
  }
  return petals;
}

/**
 * Rose petals for about three seconds: a shower from the top of the screen
 * plus a scatter from around `origin`. Rendered on <body> so it covers the
 * whole screen, never blocks touches, and removes itself when finished.
 */
export function PetalShower({ origin }: { origin: DOMRect }) {
  const [alive, setAlive] = useState(true);
  const petals = useMemo(() => makePetals(origin, window.innerWidth, window.innerHeight), [origin]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAlive(false), DURATION_MS + 200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!alive) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <motion.svg
          key={p.id}
          viewBox="0 0 20 24"
          width={p.size}
          height={p.size * 1.2}
          className="absolute"
          style={{ left: p.left, top: p.top }}
          initial={{ x: 0, y: 0, rotate: p.spin, opacity: 0 }}
          animate={{
            x: [0, p.dx * 0.6, p.dx],
            y: [0, p.dy * 0.35, p.dy],
            rotate: p.spin + p.turn,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            opacity: { duration: p.duration, delay: p.delay, times: [0, 0.12, 0.8, 1], ease: "linear" },
            x: { duration: p.duration, delay: p.delay, ease: "easeInOut" },
          }}
        >
          <path d="M10,0 C17,4 20,13 10,24 C0,13 3,4 10,0 Z" fill={p.color} />
          <path d="M10,3 C10,9 10,15 10,21" stroke="rgb(255 255 255 / 0.28)" strokeWidth="0.8" fill="none" />
        </motion.svg>
      ))}
    </div>,
    document.body,
  );
}
