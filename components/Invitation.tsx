"use client";

import { useCallback, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Countdown } from "./Countdown";
import { Events } from "./Events";
import { Footer } from "./Footer";
import { Gifts } from "./Gifts";
import { HeroIntro } from "./HeroIntro";
import { Rsvp } from "./Rsvp";
import { SaveTheDate } from "./SaveTheDate";
import { Venue } from "./Venue";
import { Welcome } from "./Welcome";

const FIRST_SECTION = "save-the-date";

/**
 * The whole invitation: the opening scene, then one continuous page that
 * scrolls like any website. The sections below the cover only exist once the
 * invitation has been opened, so there is nothing to scroll to before then.
 */
export function Invitation() {
  const [opened, setOpened] = useState(false);
  const onOpened = useCallback(() => setOpened(true), []);

  return (
    // reducedMotion="user": people who ask their phone for less motion get
    // fades only, with no sliding or scaling.
    <MotionConfig reducedMotion="user">
      <main className="sheet">
        <HeroIntro onOpened={onOpened} nextSectionId={FIRST_SECTION} />
        {opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <SaveTheDate id={FIRST_SECTION} />
            <Welcome />
            <Countdown />
            <Venue />
            <Events />
            <Gifts />
            <Rsvp />
            <Footer />
          </motion.div>
        )}
      </main>
    </MotionConfig>
  );
}
