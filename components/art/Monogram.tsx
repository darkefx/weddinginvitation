import { Mandala } from "./Mandala";

/** Rosette medallion carrying the couple's initials. */
export function Monogram({ initials, className = "" }: { initials: [string, string]; className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <Mandala className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-[21%] flex items-center justify-center rounded-full border border-gold bg-niche shadow-[inset_0_0_0_3px_var(--color-niche),inset_0_0_0_4px_var(--color-gold-soft)]">
        <span className="flex items-baseline gap-2 font-script text-[min(10vw,2.5rem)] leading-none text-ink">
          <span>{initials[0]}</span>
          <span className="font-display text-[0.38em] text-gold">&amp;</span>
          <span>{initials[1]}</span>
        </span>
      </div>
    </div>
  );
}
