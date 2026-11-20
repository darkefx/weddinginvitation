"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { weddingDetails } from "@/src/data/weddingDetails";
import { longDate } from "@/src/lib/dates";
import { ArchCard } from "./art/ArchCard";
import { InlayFlower } from "./art/InlayFlower";
import { Monogram } from "./art/Monogram";

/**
 * loading      the browser is still fetching public/videos/1.mp4
 * ready        the first frame is decoded and on screen
 * unavailable  the file is missing or cannot be played → illustrated fallback
 */
type VideoStatus = "loading" | "ready" | "unavailable";

/**
 * idle     closed, waiting for a tap
 * playing  opening (video running, or the fallback opening)
 * done     open. Held in component state only, so nothing short of a page
 *          refresh brings "idle" back and the video can never replay.
 */
type Phase = "idle" | "playing" | "done";

type Props = { onOpened: () => void; nextSectionId: string };

export function HeroIntro({ onOpened, nextSectionId }: Props) {
  const { intro, couple, wedding } = weddingDetails;
  const reduceMotion = useReducedMotion();

  const videoRef = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const statusRef = useRef<VideoStatus>("loading");
  const frameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const fallbackRunningRef = useRef(false);

  const [status, setStatusState] = useState<VideoStatus>("loading");
  const [phase, setPhaseState] = useState<Phase>("idle");
  const [showTapLabel, setShowTapLabel] = useState(false);
  const [showNames, setShowNames] = useState(false);
  const [buffering, setBuffering] = useState(false);

  const setPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  };
  const setStatus = (next: VideoStatus) => {
    statusRef.current = next;
    setStatusState(next);
  };

  /** The invitation is open: unlock the rest of the page. Runs once. */
  const finish = useCallback(() => {
    if (phaseRef.current === "done") return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    setPhase("done");
    setShowNames(true);
    setBuffering(false);
    onOpened();
  }, [onOpened]);

  /** Opening without the video: the illustrated cover lifts away instead. */
  const runFallback = useCallback(() => {
    if (fallbackRunningRef.current || phaseRef.current === "done") return;
    fallbackRunningRef.current = true;
    setBuffering(false);
    timersRef.current.push(
      window.setTimeout(() => setShowNames(true), reduceMotion ? 0 : 900),
      window.setTimeout(finish, reduceMotion ? 60 : 2400),
    );
  }, [finish, reduceMotion]);

  const markUnavailable = useCallback(() => {
    setStatus("unavailable");
    if (phaseRef.current === "playing") runFallback();
  }, [runFallback]);

  /** Called on every painted frame and on timeupdate while the video runs. */
  const checkTime = useCallback(() => {
    const video = videoRef.current;
    if (!video || phaseRef.current !== "playing") return false;
    const t = video.currentTime;
    if (t >= intro.namesAppearAtSeconds) setShowNames(true);
    if (t >= intro.pauseAtSeconds) {
      finish(); // phase is "done" before pause(), so nothing can resume it
      video.pause();
      // Land on the exact frame rather than wherever the last tick fell.
      if (Math.abs(video.currentTime - intro.pauseAtSeconds) > 0.001) {
        try {
          video.currentTime = intro.pauseAtSeconds;
        } catch {
          /* seeking can throw on some browsers mid-load; the frame shown is still within a tick of the mark */
        }
      }
      return false;
    }
    return true;
  }, [finish, intro.namesAppearAtSeconds, intro.pauseAtSeconds]);

  const watch = useCallback(() => {
    if (checkTime()) frameRef.current = requestAnimationFrame(watch);
  }, [checkTime]);

  /** The one and only way playback starts: a real tap or click. */
  const open = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    setPhase("playing");

    const video = videoRef.current;
    if (!video || statusRef.current === "unavailable") {
      runFallback();
      return;
    }

    try {
      video.currentTime = 0;
    } catch {
      /* not seekable yet: it will start from the beginning anyway */
    }
    setBuffering(video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);

    const started = () => {
      setBuffering(false);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(watch);
    };

    // On a very poor connection, stop waiting and open with the illustrated scene.
    timersRef.current.push(
      window.setTimeout(() => {
        if (phaseRef.current === "playing" && video.currentTime < 0.05) {
          video.pause();
          markUnavailable();
        }
      }, 15_000),
    );

    const attempt = video.play();
    if (!attempt) {
      started();
      return;
    }
    attempt.then(started).catch((error: unknown) => {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "AbortError") return; // interrupted by our own pause
      if (name === "NotAllowedError" && !video.muted) {
        // A browser refused sound even after a tap: play silently rather than not at all.
        video.muted = true;
        video.play().then(started).catch(markUnavailable);
        return;
      }
      markUnavailable();
    });
  }, [markUnavailable, runFallback, watch]);

  useEffect(() => {
    const labelTimer = window.setTimeout(() => setShowTapLabel(true), intro.tapLabelDelaySeconds * 1000);

    // The video may have loaded or failed before React attached its listeners.
    const video = videoRef.current;
    if (video) {
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) markUnavailable();
      else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setStatus("ready");
    }

    // Phones pause video when the tab is hidden; pick up where it stopped.
    const onVisible = () => {
      const v = videoRef.current;
      if (document.visibilityState === "visible" && phaseRef.current === "playing" && v && v.paused && !fallbackRunningRef.current) {
        v.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const timers = timersRef.current;
    return () => {
      window.clearTimeout(labelTimer);
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      fallbackRunningRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Belt and braces: once open, the video stays frozen whatever asks it to play. */
  const refuseReplay = () => {
    const video = videoRef.current;
    if (video && phaseRef.current !== "playing") video.pause();
  };

  const scrollOn = () => {
    document.getElementById(nextSectionId)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const usingFallback = status === "unavailable";
  const lightLabel = usingFallback || status === "ready" || Boolean(intro.posterSrc);

  return (
    <section className="relative h-svh min-h-[34rem] overflow-hidden" aria-label="Invitation cover">
      {intro.posterSrc && !usingFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={intro.posterSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}

      {/* Illustrated scene, only when there is no video to show. */}
      {usingFallback && (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} aria-hidden="true">
          <div className="absolute inset-x-4 bottom-9 top-9">
            <ArchCard className="h-full" contentClassName="hidden">
              {null}
            </ArchCard>
          </div>
          <div className="absolute inset-x-6 bottom-[4.6rem] flex h-[34%] items-end justify-center gap-[5%]">
            <InlayFlower variant="small" className="mb-1 h-[42%] w-auto" />
            <InlayFlower className="h-full w-auto" />
            <InlayFlower variant="small" className="mb-1 h-[42%] w-auto" />
          </div>
        </motion.div>
      )}

      {/* The couple's own video. Never autoplays, never loops, no controls. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        src={`${intro.videoSrc}#t=0.001`}
        preload="auto"
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        tabIndex={-1}
        aria-hidden="true"
        onLoadedData={() => {
          if (statusRef.current !== "unavailable") setStatus("ready");
        }}
        onError={markUnavailable}
        onTimeUpdate={checkTime}
        onEnded={finish}
        onWaiting={() => phaseRef.current === "playing" && setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onPlay={refuseReplay}
        onContextMenu={(event) => event.preventDefault()}
      />

      {/* Closed cover for the fallback scene. Lifts away on opening. */}
      <AnimatePresence>
        {usingFallback && phase === "idle" && (
          <motion.div
            key="cover"
            className="absolute inset-0 bg-jade-deep"
            style={{ backgroundImage: "url(/images/lattice.svg)", backgroundSize: "56px 56px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.3, ease: [0.4, 0, 0.2, 1] } }}
            aria-hidden="true"
          >
            <div className="absolute inset-4 border border-gold-soft/70" />
            <div className="absolute inset-[22px] border border-gold-soft/30" />
            <div className="absolute left-1/2 top-1/2 w-[58%] max-w-[250px] -translate-x-1/2 -translate-y-1/2">
              <Monogram className="breathe w-full" initials={[couple.bride.shortName[0], couple.groom.shortName[0]]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Names, placed in the clear space the opening leaves in the upper middle. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 z-20 -translate-y-1/2 px-[20%] text-center text-ink"
        style={{ top: `${intro.namesTopPercent}%` }}
        initial="hidden"
        animate={showNames ? "show" : "hidden"}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.28 } } }}
      >
        {[
          <span key="b" className="block font-script text-[min(15vw,4.5rem)] leading-[1.05]">{couple.bride.shortName}</span>,
          <span key="a" className="my-1 block font-display text-[min(5.5vw,1.6rem)] leading-none text-gold">&amp;</span>,
          <span key="g" className="block font-script text-[min(15vw,4.5rem)] leading-[1.05]">{couple.groom.shortName}</span>,
          intro.showDateOnOpeningScene ? (
            <span key="d" className="mt-4 block font-display text-[min(4.4vw,1.3rem)] tracking-[0.14em]">{longDate(wedding.startsAt)}</span>
          ) : null,
        ]
          .filter(Boolean)
          .map((node, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {node}
            </motion.div>
          ))}
      </motion.div>

      {/* The whole scene is the button. It exists only while the invitation is closed. */}
      {phase === "idle" && (
        <button type="button" onClick={open} className="absolute inset-0 z-30 block w-full cursor-pointer focus-visible:outline-offset-[-6px]">
          <motion.span
            className={`absolute inset-x-0 bottom-[13%] block text-center font-display text-[1.05rem] tracking-[0.3em] ${
              lightLabel ? "text-marble [text-shadow:0_1px_10px_rgb(0_0_0/0.35)]" : "text-ink"
            }`}
            initial={{ opacity: 0, y: 6 }}
            animate={showTapLabel ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            {intro.tapLabel}
          </motion.span>
        </button>
      )}

      {buffering && phase === "playing" && (
        <p className="absolute inset-x-0 bottom-[13%] z-30 text-center font-body text-base italic text-marble [text-shadow:0_1px_10px_rgb(0_0_0/0.35)]" role="status">
          Opening…
        </p>
      )}

      <AnimatePresence>
        {phase === "done" && (
          <motion.button
            type="button"
            onClick={scrollOn}
            aria-label="Scroll to the invitation"
            className="absolute bottom-[14px] left-1/2 z-30 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-gold bg-niche text-jade-deep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <ChevronDown className="nudge h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
