"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { weddingDetails } from "@/src/data/weddingDetails";
import { dateParts } from "@/src/lib/dates";
import { Divider } from "./art/Icons";
import { PetalShower } from "./PetalShower";
import { Line, Reveal } from "./Reveal";
import { ScratchCard } from "./ScratchCard";

export function SaveTheDate({ id }: { id: string }) {
  const { wedding, copy } = weddingDetails;
  const date = dateParts(wedding.startsAt);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [petalOrigin, setPetalOrigin] = useState<DOMRect | null>(null);

  const onReveal = useCallback(() => {
    setRevealed(true);
    if (!reduceMotion && cardRef.current) setPetalOrigin(cardRef.current.getBoundingClientRect());
  }, [reduceMotion]);

  return (
    <section id={id} className="scroll-mt-0 px-6 pb-16 pt-20 text-center">
      <Reveal>
        <Line>
          <h2 className="font-script text-[min(14vw,3.5rem)] leading-none text-ink">{copy.saveTheDate.heading}</h2>
        </Line>
        <Line>
          <Divider className="mx-auto mt-5 w-44" />
        </Line>
        <Line>
          <div
            ref={cardRef}
            className="relative mx-auto mt-9 aspect-[8/5] w-full max-w-[330px] border border-gold bg-niche p-[7px] shadow-[0_14px_30px_-18px_rgb(23_53_44/0.55)]"
          >
            <div className="h-full w-full border border-gold-soft">
              <ScratchCard foilText={copy.saveTheDate.foilText} onReveal={onReveal}>
                <div>
                  <p className="font-body text-lg italic text-ink-soft">{date.weekday}</p>
                  <p className="mt-1 font-display text-[2rem] leading-tight text-ink">
                    {date.day} {date.month} {date.year}
                  </p>
                  <p className="mt-1 font-body text-lg italic text-ink-soft">{wedding.timeLabel}</p>
                </div>
              </ScratchCard>
            </div>
          </div>
        </Line>
      </Reveal>

      <motion.p
        className="mt-7 font-body text-lg italic text-ink-soft"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-live="polite"
      >
        {revealed ? copy.saveTheDate.afterReveal : " "}
      </motion.p>
      <p className="sr-only" aria-live="polite">
        {revealed ? `${date.weekday}, ${date.day} ${date.month} ${date.year}, ${wedding.timeLabel}` : ""}
      </p>

      {petalOrigin && <PetalShower origin={petalOrigin} />}
    </section>
  );
}
