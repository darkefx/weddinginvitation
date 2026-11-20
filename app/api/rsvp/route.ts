import { NextResponse } from "next/server";
import { weddingDetails } from "@/src/data/weddingDetails";

export const runtime = "nodejs";

type Reply = {
  name: string;
  phone: string;
  attending: "yes" | "no";
  guests: number;
  events: string[];
  message: string;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function parse(body: unknown): { reply?: Reply; errors?: Record<string, string> } {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = clean(b.name, 120);
  if (name.length < 2) errors.name = "Enter your full name.";

  const phone = clean(b.phone, 30);
  if (phone && !/^[+\d][\d\s\-()]{6,}$/.test(phone)) errors.phone = "Enter a valid phone number.";

  const attending = b.attending === "yes" || b.attending === "no" ? b.attending : null;
  if (!attending) errors.attending = "Choose whether you can attend.";

  let guests = 0;
  if (attending === "yes") {
    guests = Number(b.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      errors.guests = "Enter how many people are coming, between 1 and 20.";
    }
  }

  const known = new Set(weddingDetails.events.map((e) => e.id));
  const events = Array.isArray(b.events)
    ? b.events.filter((e): e is string => typeof e === "string" && known.has(e))
    : [];
  if (attending === "yes" && events.length === 0) {
    errors.events = "Choose at least one event.";
  }

  if (Object.keys(errors).length || !attending) return { errors };
  return { reply: { name, phone, attending, guests, events, message: clean(b.message, 1000) } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  // Honeypot: real guests never fill this hidden field.
  if (clean((body as Record<string, unknown>)?.website, 200)) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const { reply, errors } = parse(body);
  if (!reply) {
    return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 422 });
  }

  const webhook = process.env.RSVP_WEBHOOK_URL;
  if (!webhook) {
    // Nothing is stored anywhere yet, so never pretend the reply was received.
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const titles = new Map(weddingDetails.events.map((e) => [e.id, e.title]));
  const payload = {
    submittedAt: new Date().toISOString(),
    name: reply.name,
    phone: reply.phone,
    attending: reply.attending,
    guests: reply.guests,
    events: reply.events.map((id) => titles.get(id) ?? id),
    message: reply.message,
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (error) {
    console.error("RSVP webhook failed:", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
