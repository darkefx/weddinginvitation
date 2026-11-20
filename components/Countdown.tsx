"use client";

import { useEffect, useState } from "react";
import { weddingDetails } from "@/src/data/weddingDetails";
import { ArchCard } from "./art/ArchCard";
import { Divider } from "./art/Icons";
import { Line, Reveal } from "./Reveal";

const target = new Date(weddingDetails.wedding.startsAt).getTime();

function remaining(now: number) {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  return {
    finished: ms === 0,
    units: [
      { label: "days", value: Math.floor(s / 86400) },
      { label: "hours", value: Math.floor((s % 86400) / 3600) },
      { label: "minutes", value: Math.floor((s % 3600) / 60) },
      { label: "seconds", value: s % 60 },
    ],
  };
}

export function Countdown() {
  const { copy } = weddingDetails;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const { finished, units } = remaining(now);

  return (
    <section className="px-5 pb-20 pt-4 text-center">
      <Reveal>
        <Line>
          <h2 className="font-display text-[1.9rem] leading-tight text-ink">{copy.countdown.heading}</h2>
        </Line>
        <Line>
          <Divider className="mx-auto mt-4 w-44" />
        </Line>
        <Line>
          <div className="mx-auto mt-12 grid max-w-[360px] grid-cols-4 gap-2.5" role="timer" aria-label="Time until the wedding">
            {units.map((unit) => (
              <ArchCard key={unit.label} compact finial={false} contentClassName="px-1 pb-3 pt-[38%]">
                <span className="block font-display text-[1.75rem] leading-none tabular-nums text-ink">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="mt-1.5 block font-body text-[0.95rem] italic leading-none text-ink-soft">{unit.label}</span>
              </ArchCard>
            ))}
          </div>
        </Line>
        {finished && (
          <Line>
            <p className="mt-8 font-body text-xl italic text-ink-soft">{copy.countdown.finished}</p>
          </Line>
        )}
      </Reveal>
    </section>
  );
}
