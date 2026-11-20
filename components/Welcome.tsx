import { weddingDetails } from "@/src/data/weddingDetails";
import { InlayFlower } from "./art/InlayFlower";
import { Line, Reveal } from "./Reveal";

export function Welcome() {
  const { couple, copy } = weddingDetails;
  return (
    <section className="px-7 pb-20 pt-10 text-center">
      <Reveal>
        <Line>
          <InlayFlower className="mx-auto w-40" />
        </Line>
        <Line>
          <p className="mt-8 font-body text-xl italic text-ink-soft">{copy.welcome.opening}</p>
        </Line>
        <Line>
          <h2 className="mt-7 text-balance font-script text-[min(13.5vw,3.4rem)] leading-[1.05] text-ink">{couple.bride.fullName}</h2>
        </Line>
        <Line>
          <p className="mt-2 font-body text-[1.05rem] text-ink-soft">{couple.bride.parents}</p>
        </Line>
        <Line>
          <p className="my-5 font-display text-2xl text-gold" aria-hidden="true">
            &amp;
          </p>
          <span className="sr-only">and</span>
        </Line>
        <Line>
          <h2 className="text-balance font-script text-[min(13.5vw,3.4rem)] leading-[1.05] text-ink">{couple.groom.fullName}</h2>
        </Line>
        <Line>
          <p className="mt-2 font-body text-[1.05rem] text-ink-soft">{couple.groom.parents}</p>
        </Line>
        <Line>
          <p className="mt-8 font-body text-xl italic text-ink-soft">{copy.welcome.closing}</p>
        </Line>
      </Reveal>
    </section>
  );
}
