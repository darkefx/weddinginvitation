"use client";

import { useId } from "react";
import { stone } from "./palette";

/** A running border of vine and blossom between two gold rules. */
export function InlayBand({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} width="100%" height="30" aria-hidden="true">
      <defs>
        <pattern id={id} width="48" height="30" patternUnits="userSpaceOnUse">
          <path d="M0,15 C12,3 12,3 24,15 C36,27 36,27 48,15" fill="none" stroke={stone.jade} strokeWidth="1.2" />
          <g transform="translate(12 17)">
            {[0, 90, 180, 270].map((a) => (
              <ellipse key={a} cx="0" cy="-3.4" rx="2.1" ry="3" transform={`rotate(${a})`} fill={stone.carnelian} stroke={stone.gold} strokeWidth="0.4" />
            ))}
            <circle r="1.3" fill={stone.amber} />
          </g>
          <g transform="translate(36 13)">
            <path d="M0,-5 L3.4,0 L0,5 L-3.4,0 Z" fill={stone.lapis} stroke={stone.gold} strokeWidth="0.4" />
          </g>
          <path d="M22,13 C25,9 29,8 31,9 C29,12 26,14 22,13 Z M26,17 C23,21 19,22 17,21 C19,18 22,16 26,17 Z" fill={stone.leaf} />
        </pattern>
      </defs>
      <rect width="100%" height="30" fill={`url(#${id})`} />
      <path d="M0,0.5 H2000 M0,29.5 H2000" stroke={stone.goldSoft} strokeWidth="1" />
    </svg>
  );
}
