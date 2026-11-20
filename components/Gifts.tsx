import { weddingDetails } from "@/src/data/weddingDetails";
import { InlayBand } from "./art/InlayBand";
import { InlayFlower } from "./art/InlayFlower";
import { Line, Reveal } from "./Reveal";

export function Gifts() {
  const { gifts } = weddingDetails.copy;
  if (!gifts.enabled) return null;
  return (
    <section className="pb-20 text-center">
      <InlayBand className="block" />
      <Reveal className="px-9 pt-16">
        <Line>
          <InlayFlower variant="small" className="mx-auto w-16" />
        </Line>
        <Line>
          <h2 className="mt-5 font-display text-[1.9rem] leading-tight text-ink">{gifts.heading}</h2>
        </Line>
        <Line>
          <p className="mx-auto mt-4 max-w-[19rem] text-balance font-body text-xl italic leading-relaxed text-ink-soft">{gifts.body}</p>
        </Line>
      </Reveal>
    </section>
  );
}
