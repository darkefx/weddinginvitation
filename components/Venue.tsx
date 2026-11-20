"use client";

import { useState } from "react";
import { CalendarPlus, MapPin } from "lucide-react";
import { weddingDetails } from "@/src/data/weddingDetails";
import { dateParts, googleCalendarUrl } from "@/src/lib/dates";
import { ArchCard } from "./art/ArchCard";
import { InlayBand } from "./art/InlayBand";
import { Line, Reveal } from "./Reveal";

const action =
  "inline-flex min-h-11 w-full items-center justify-center gap-2.5 border border-jade-deep px-5 py-2.5 font-display text-[1.02rem] tracking-wide text-jade-deep transition-colors hover:bg-jade-deep hover:text-marble";

export function Venue() {
  const { venue, wedding, copy } = weddingDetails;
  const date = dateParts(wedding.startsAt);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <section className="pb-20">
      <InlayBand className="block" />
      <div className="px-5 pt-20 text-center">
        <ArchCard contentClassName="px-7 pb-10 pt-[30%]">
          <Reveal>
            <Line>
              <p className="font-body text-xl italic text-ink-soft">{copy.venue.heading}</p>
            </Line>
            <Line>
              <h2 className="mt-4 text-balance font-display text-[2.1rem] leading-[1.15] text-ink">{venue.name}</h2>
            </Line>
            <Line>
              <address className="mt-3 font-body text-[1.1rem] not-italic leading-snug text-ink-soft">
                {venue.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </Line>
            <Line>
              <div className="mx-auto my-6 h-px w-16 bg-gold-soft" />
            </Line>
            <Line>
              <p className="text-balance font-display text-[min(5.2vw,1.25rem)] text-ink">
                {date.weekday}, {date.day} {date.month} {date.year}
              </p>
            </Line>
            <Line>
              <p className="mt-1 font-body text-[1.1rem] italic text-ink-soft">{wedding.timeLabel}</p>
            </Line>
            <Line>
              <div className="mt-8 space-y-3">
                <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" className={action}>
                  <MapPin className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                  {copy.venue.mapsButton}
                </a>
                <button type="button" className={action} aria-expanded={calendarOpen} aria-controls="calendar-options" onClick={() => setCalendarOpen((open) => !open)}>
                  <CalendarPlus className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                  {copy.venue.calendarButton}
                </button>
                {calendarOpen && (
                  <div id="calendar-options" className="grid grid-cols-2 gap-3 pt-1 font-body text-[1.02rem]">
                    <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="border-b border-gold py-2 text-jade-deep hover:text-carnelian">
                      Google Calendar
                    </a>
                    <a href="/calendar.ics" className="border-b border-gold py-2 text-jade-deep hover:text-carnelian">
                      Apple or Outlook
                    </a>
                  </div>
                )}
              </div>
            </Line>
          </Reveal>
        </ArchCard>
      </div>
    </section>
  );
}
