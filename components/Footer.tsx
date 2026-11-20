import { weddingDetails } from "@/src/data/weddingDetails";
import { InlayBand } from "./art/InlayBand";
import { Line, Reveal } from "./Reveal";

export function Footer() {
  const { couple, copy } = weddingDetails;
  return (
    <footer className="bg-jade-deep text-center text-marble">
      <InlayBand className="block bg-marble" />
      <Reveal className="px-8 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-14">
        <Line>
          <p className="font-body text-lg italic text-gold-soft">{copy.footer.line}</p>
        </Line>
        <Line>
          <p className="mt-4 font-script text-[min(13vw,3.2rem)] leading-none">
            {couple.bride.shortName} <span className="font-display text-[1.3rem] text-gold-soft">&amp;</span> {couple.groom.shortName}
          </p>
        </Line>
      </Reveal>
    </footer>
  );
}
