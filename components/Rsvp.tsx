"use client";

import { useId, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Minus, Plus } from "lucide-react";
import { weddingDetails } from "@/src/data/weddingDetails";
import { Divider } from "./art/Icons";
import { Mandala } from "./art/Mandala";
import { Line, Reveal } from "./Reveal";

type Attending = "yes" | "no" | "";
type Errors = Partial<Record<"name" | "phone" | "attending" | "guests" | "events", string>>;
type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; attending: "yes" | "no" } | { kind: "error"; message: string };

const MAX_GUESTS = 20;
const field =
  "mt-1.5 block w-full rounded-none border-0 border-b border-gold bg-transparent px-0.5 py-2 font-body text-[1.15rem] text-ink placeholder:text-ink-soft/50 focus:border-jade-deep focus:outline-none focus:ring-0 aria-[invalid=true]:border-carnelian";
const label = "block font-body text-[1.05rem] italic text-ink-soft";
const problem = "mt-1.5 font-body text-base text-carnelian";

export function Rsvp() {
  const { copy, events } = weddingDetails;
  const text = copy.rsvp;
  const uid = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<Attending>("");
  const [guests, setGuests] = useState(1);
  const [chosen, setChosen] = useState<string[]>(events.map((e) => e.id));
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });

  const validate = (): Errors => {
    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Enter your full name.";
    if (phone.trim() && !/^[+\d][\d\s\-()]{6,}$/.test(phone.trim())) found.phone = "Enter a valid phone number, or leave it empty.";
    if (!attending) found.attending = "Choose whether you can attend.";
    if (attending === "yes") {
      if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) found.guests = `Enter a number between 1 and ${MAX_GUESTS}.`;
      if (chosen.length === 0) found.events = "Choose at least one event.";
    }
    return found;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "sending") return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length || !attending) {
      const first = Object.keys(found)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          attending,
          guests: attending === "yes" ? guests : 0,
          events: attending === "yes" ? chosen : [],
          message: message.trim(),
          website,
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Errors } | null;

      // Only a confirmed delivery counts as sent.
      if (response.ok && result?.ok) {
        setState({ kind: "sent", attending });
        return;
      }
      if (result?.error === "validation" && result.fields) {
        setErrors(result.fields);
        setState({ kind: "idle" });
        return;
      }
      setState({ kind: "error", message: result?.error === "not_configured" ? text.notConnected : text.failed });
    } catch {
      setState({ kind: "error", message: text.failed });
    }
  };

  const toggleEvent = (id: string) => setChosen((list) => (list.includes(id) ? list.filter((e) => e !== id) : [...list, id]));

  return (
    <section id="rsvp" className="px-6 pb-20 text-center">
      <Reveal>
        <Line>
          <h2 className="font-script text-[min(13.5vw,3.4rem)] leading-none text-ink">{text.heading}</h2>
        </Line>
        <Line>
          <Divider className="mx-auto mt-5 w-44" />
        </Line>
        {state.kind !== "sent" && (
          <Line>
            <p className="mx-auto mt-5 max-w-[20rem] text-balance font-body text-[1.15rem] italic text-ink-soft">{text.intro}</p>
          </Line>
        )}
      </Reveal>

      {state.kind === "sent" ? (
        <div className="mx-auto mt-8 max-w-[21rem]" role="status">
          <Mandala className="mx-auto w-24" />
          <p className="mt-6 text-balance font-body text-xl leading-relaxed text-ink">
            {state.attending === "yes" ? text.successAccept : text.successDecline}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mx-auto mt-9 max-w-[22rem] space-y-7 text-left">
          <div>
            <label htmlFor={`${uid}-name`} className={label}>
              Full name
            </label>
            <input
              id={`${uid}-name`}
              className={field}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            />
            {errors.name && (
              <p id={`${uid}-name-error`} className={problem}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${uid}-phone`} className={label}>
              Phone number (optional)
            </label>
            <input
              id={`${uid}-phone`}
              className={field}
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              maxLength={30}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
            />
            {errors.phone && (
              <p id={`${uid}-phone-error`} className={problem}>
                {errors.phone}
              </p>
            )}
          </div>

          <fieldset aria-describedby={errors.attending ? `${uid}-attending-error` : undefined}>
            <legend className={label}>Will you attend?</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["yes", text.accept],
                  ["no", text.decline],
                ] as const
              ).map(([value, caption], index) => (
                <label
                  key={value}
                  className="flex min-h-[4.25rem] cursor-pointer items-center justify-center border border-gold px-3 py-2 text-center font-display text-[1.02rem] leading-snug text-ink transition-colors has-[:checked]:border-jade-deep has-[:checked]:bg-jade-deep has-[:checked]:text-marble has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-jade"
                >
                  <input
                    id={index === 0 ? `${uid}-attending` : undefined}
                    type="radio"
                    name="attending"
                    value={value}
                    checked={attending === value}
                    onChange={() => setAttending(value)}
                    className="sr-only"
                  />
                  {caption}
                </label>
              ))}
            </div>
            {errors.attending && (
              <p id={`${uid}-attending-error`} className={problem}>
                {errors.attending}
              </p>
            )}
          </fieldset>

          {attending === "yes" && (
            <>
              <div>
                <span id={`${uid}-guests-label`} className={label}>
                  How many of you are coming, including yourself?
                </span>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.max(1, n - 1))}
                    disabled={guests <= 1}
                    aria-label="One fewer"
                    className="flex h-11 w-11 items-center justify-center border border-gold text-jade-deep disabled:opacity-35"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <output id={`${uid}-guests`} tabIndex={-1} aria-labelledby={`${uid}-guests-label`} className="w-10 text-center font-display text-2xl tabular-nums text-ink">
                    {guests}
                  </output>
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.min(MAX_GUESTS, n + 1))}
                    disabled={guests >= MAX_GUESTS}
                    aria-label="One more"
                    className="flex h-11 w-11 items-center justify-center border border-gold text-jade-deep disabled:opacity-35"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                {errors.guests && <p className={problem}>{errors.guests}</p>}
              </div>

              <fieldset>
                <legend className={label}>Which celebrations will you join?</legend>
                <div className="mt-2">
                  {events.map((event, index) => (
                    <label key={event.id} className="flex min-h-11 cursor-pointer items-center gap-3 py-1.5 font-body text-[1.15rem] text-ink">
                      <input
                        id={index === 0 ? `${uid}-events` : undefined}
                        type="checkbox"
                        checked={chosen.includes(event.id)}
                        onChange={() => toggleEvent(event.id)}
                        className="peer sr-only"
                      />
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-gold text-transparent peer-checked:border-jade-deep peer-checked:bg-jade-deep peer-checked:text-marble peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      {event.title}
                    </label>
                  ))}
                </div>
                {errors.events && <p className={problem}>{errors.events}</p>}
              </fieldset>
            </>
          )}

          <div>
            <label htmlFor={`${uid}-message`} className={label}>
              A note for the couple (optional)
            </label>
            <textarea id={`${uid}-message`} className={`${field} resize-none`} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>

          <div className="pt-1 text-center">
            <button
              type="submit"
              disabled={state.kind === "sending"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-jade-deep px-8 py-3 font-display text-[1.1rem] tracking-wide text-marble transition-colors hover:bg-jade disabled:opacity-70"
            >
              {state.kind === "sending" && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {state.kind === "sending" ? "Sending…" : text.submit}
            </button>
            <p className="mt-4 min-h-6 font-body text-[1.05rem] text-carnelian" role="alert">
              {state.kind === "error" ? state.message : ""}
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
