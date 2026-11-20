import type { ReactNode } from "react";
import { stone } from "./palette";

/** Arch head: shoulders that sweep up to a point. Stretches to any width. */
const HEAD = "M0,100 L0,66 C0,48 20,43 46,38 C92,30 128,19 150,0 C172,19 208,30 254,38 C280,43 300,48 300,66 L300,100";
/** Walls and floor of the niche, drawn in the same coordinate space so the lines meet exactly. */
const BODY = "M0,0 L0,100 L300,100 L300,0";

function Layer({ inset, weight, color, fill }: { inset: number; weight: number; color: string; fill?: string }) {
  const stroke = { fill: "none", stroke: color, strokeWidth: weight, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "round" as const };
  return (
    <div className="pointer-events-none absolute flex flex-col" style={{ inset, padding: weight / 2, paddingTop: 0 }} aria-hidden="true">
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="block w-full shrink-0 overflow-visible" style={{ aspectRatio: "300 / 100" }}>
        {fill && <path d={`${HEAD} Z`} fill={fill} />}
        <path d={HEAD} {...stroke} />
      </svg>
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="-mt-px block h-0 w-full flex-1 overflow-visible">
        {fill && <path d={`${BODY} Z`} fill={fill} />}
        <path d={BODY} {...stroke} strokeLinejoin="miter" />
      </svg>
    </div>
  );
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Classes for the content box. Top padding should clear the arch head. */
  contentClassName?: string;
  /** Draw the small stone above the point of the arch. */
  finial?: boolean;
  /** Finer lines for small niches. */
  compact?: boolean;
};

/** A marble niche with a pointed arch: outer gold line, finer inner line. */
export function ArchCard({ children, className = "", contentClassName = "", finial = true, compact = false }: Props) {
  return (
    <div className={`relative ${className}`}>
      <Layer inset={0} weight={compact ? 1 : 1.5} color={stone.gold} fill={stone.marble} />
      <Layer inset={compact ? 4 : 7} weight={1} color={stone.goldSoft} />
      {finial && (
        <svg viewBox="0 0 20 28" className="absolute left-1/2 -top-[22px] h-[24px] w-[18px] -translate-x-1/2" aria-hidden="true">
          <path d="M10,4 L15,13 L10,22 L5,13 Z" fill={stone.carnelian} stroke={stone.gold} strokeWidth="1" />
          <circle cx="10" cy="2.2" r="1.6" fill={stone.gold} />
          <path d="M10,22 V28" stroke={stone.gold} strokeWidth="1" />
        </svg>
      )}
      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}
