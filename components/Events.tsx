"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { weddingDetails } from "@/src/data/weddingDetails";
import { longDate, weekday } from "@/src/lib/dates";
import { Divider, EventIcon } from "./art/Icons";
import { Line, Reveal } from "./Reveal";

export function Events() {
  const { events, copy } = weddingDetails;
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.55"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section className="px-6 pb-20 text-center">
      <Reveal>
        <Line>
          <h2 className="font-display text-[1.9rem] leading-tight text-ink">{copy.events.heading}</h2>
        </Line>
        <Line>
          <Divider className="mx-auto mt-4 w-44" />
        </Line>
      </Reveal>

      <ol ref={listRef} className="relative mx-auto mt-10 max-w-[360px] text-left">
        {/* The thread between events: a faint rule that fills in as you scroll. */}
        <span className="absolute bottom-10 left-[90px] top-10 w-px bg-gold-soft/60" aria-hidden="true" />
        <motion.span
          className="absolute bottom-10 left-[90px] top-10 w-px origin-top bg-jade"
          style={{ scaleY: reduceMotion ? 1 : drawn }}
          aria-hidden="true"
        />

        {events.map((event) => (
          <li key={event.id} className="relative py-9">
            <Reveal className="grid grid-cols-[72px_36px_1fr] items-center" amount={0.4}>
              <Line>
                <EventIcon kind={event.icon} className="mx-auto h-[76px] w-[68px]" />
              </Line>
              <Line className="flex justify-center">
                <span className="relative block h-3 w-3 rotate-45 border border-gold bg-carnelian" aria-hidden="true" />
              </Line>
              <div className="pl-1">
                <Line>
                  <p className="font-body text-[1.02rem] italic text-ink-soft">{weekday(event.date)}</p>
                </Line>
                <Line>
                  <p className="font-display text-[1.3rem] leading-snug text-ink">{longDate(event.date)}</p>
                </Line>
                <Line>
                  <h3 className="mt-1.5 font-script text-[1.95rem] leading-none text-jade-deep">{event.title}</h3>
                </Line>
                <Line>
                  <p className="mt-2 font-body text-[1.05rem] leading-snug text-ink-soft">
                    {event.time ?? copy.events.timePending}
                    {event.place && <span className="block">{event.place}</span>}
                  </p>
                </Line>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
