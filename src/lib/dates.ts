import { weddingDetails } from "@/src/data/weddingDetails";

const tz = weddingDetails.wedding.timeZone;

/** "2027-01-22" (or a full ISO string) → Date. Date-only strings are pinned to noon in Pakistan. */
function toDate(value: string): Date {
  return new Date(value.length === 10 ? `${value}T12:00:00+05:00` : value);
}

/** "23 January 2027" */
export function longDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  }).format(toDate(value));
}

/** "Saturday" */
export function weekday(value: string): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: tz }).format(toDate(value));
}

/** Parts for stacked date layouts. */
export function dateParts(value: string) {
  const d = toDate(value);
  const part = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz }).format(d);
  return {
    weekday: part({ weekday: "long" }),
    day: part({ day: "numeric" }),
    month: part({ month: "long" }),
    year: part({ year: "numeric" }),
  };
}

/** 20270123T140000Z, the UTC stamp calendar formats expect. */
export function calendarStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function calendarWindow() {
  const start = new Date(weddingDetails.wedding.startsAt);
  const end = new Date(start.getTime() + weddingDetails.wedding.calendarDurationHours * 3600_000);
  return { start, end };
}

export function calendarText() {
  const { couple, venue } = weddingDetails;
  return {
    title: `Wedding of ${couple.bride.fullName} & ${couple.groom.fullName}`,
    location: [venue.name, ...venue.addressLines].join(", "),
    description: `Directions: ${venue.mapsUrl}`,
  };
}

export function googleCalendarUrl(): string {
  const { start, end } = calendarWindow();
  const { title, location, description } = calendarText();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${calendarStamp(start)}/${calendarStamp(end)}`,
    location,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
