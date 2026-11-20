import { stone } from "./palette";
import { Mandala } from "./Mandala";

/** An arched niche with a hanging lamp, for the wedding evening. */
export function LampNiche({ className }: { className?: string }) {
  const s = { fill: "none", stroke: stone.gold, strokeWidth: 1.1, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden="true">
      <path d="M12,94 V46 C12,32 27,27 40,10 C53,27 68,32 68,46 V94" {...s} fill={stone.marble} />
      <path d="M17,94 V47 C17,36 29,31 40,18 C51,31 63,36 63,47 V94" {...s} strokeWidth={0.6} />
      <path d="M40,18 V36" {...s} strokeWidth={0.7} strokeDasharray="1.5 2" />
      <path d="M35,36 H45 L43.5,40 H36.5 Z" {...s} fill={stone.amber} />
      <path d="M36.5,40 C30,48 30,60 35,66 H45 C50,60 50,48 43.5,40 Z" {...s} fill={stone.jade} fillOpacity={0.16} />
      <path d="M40,47 C36.5,52 37.5,58 40,61 C42.5,58 43.5,52 40,47 Z" fill={stone.carnelian} stroke={stone.gold} strokeWidth={0.5} />
      <path d="M36,66 H44 V69 H36 Z" {...s} fill={stone.amber} />
      <path d="M40,69 V76" {...s} strokeWidth={0.8} />
      <circle cx={40} cy={78} r={1.6} fill={stone.lapis} />
      <path d="M5,94 H75" {...s} />
      <path d="M9,98 H71" {...s} strokeWidth={0.6} />
    </svg>
  );
}

export function EventIcon({ kind, className }: { kind: "mehndi" | "wedding"; className?: string }) {
  return kind === "mehndi" ? <Mandala className={className} /> : <LampNiche className={className} />;
}

/** Thin rule with a cut stone at its centre. */
export function Divider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" className={className} aria-hidden="true">
      <path d="M8,8 H84 M116,8 H192" stroke={stone.goldSoft} strokeWidth={1} strokeLinecap="round" />
      <path d="M100,2 L106,8 L100,14 L94,8 Z" fill={stone.carnelian} stroke={stone.gold} strokeWidth={0.8} />
      <circle cx={88} cy={8} r={1.6} fill={stone.jade} />
      <circle cx={112} cy={8} r={1.6} fill={stone.jade} />
    </svg>
  );
}
