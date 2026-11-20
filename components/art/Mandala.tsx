import { stone } from "./palette";

/** A henna-style rosette, drawn in fine gold line with a few inlaid stones. */
export function Mandala({ className, filled = true }: { className?: string; filled?: boolean }) {
  const s = { fill: "none", stroke: stone.gold, strokeWidth: 0.8, strokeLinejoin: "round" as const };
  const rot = (n: number) => Array.from({ length: n }, (_, i) => (360 / n) * i);
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      {rot(16).map((a) => (
        <path key={`o${a}`} d="M0,-47 C5.5,-41 5.5,-35 0,-31 C-5.5,-35 -5.5,-41 0,-47 Z" transform={`rotate(${a})`} {...s} fill={filled ? stone.marble : "none"} />
      ))}
      {rot(16).map((a) => (
        <circle key={`d${a}`} cx={0} cy={-34} r={1.1} transform={`rotate(${a + 11.25})`} fill={stone.gold} />
      ))}
      <circle r={30} {...s} />
      <circle r={27.5} {...s} strokeWidth={0.5} />
      {rot(8).map((a) => (
        <path key={`m${a}`} d="M0,-27 C8,-21 8,-14 0,-10 C-8,-14 -8,-21 0,-27 Z" transform={`rotate(${a})`} {...s} fill={filled ? stone.carnelian : "none"} fillOpacity={0.9} />
      ))}
      {rot(8).map((a) => (
        <path key={`l${a}`} d="M0,-24 C3.5,-20 3.5,-15 0,-12 C-3.5,-15 -3.5,-20 0,-24 Z" transform={`rotate(${a + 22.5})`} {...s} fill={filled ? stone.leaf : "none"} />
      ))}
      <circle r={9} {...s} fill={filled ? stone.marble : "none"} />
      {rot(8).map((a) => (
        <ellipse key={`c${a}`} cx={0} cy={-5} rx={1.8} ry={3.4} transform={`rotate(${a})`} fill={stone.amber} stroke={stone.gold} strokeWidth={0.4} />
      ))}
      <circle r={1.8} fill={stone.lapis} />
    </svg>
  );
}
