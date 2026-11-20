/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EVERYTHING GUESTS READ LIVES IN THIS FILE.
 *  Change names, dates, times, venue and wording here; no component needs
 *  to be touched.
 *
 *  Lines marked  ▸ PLACEHOLDER  were not in the supplied wedding details.
 *  Please confirm or edit them before sharing the link.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type WeddingEvent = {
  id: string;
  title: string;
  /** ISO date, e.g. "2027-01-22" */
  date: string;
  /** Shown as written. null shows `copy.events.timePending` instead. */
  time: string | null;
  /** Shown under the title. null hides the line. */
  place: string | null;
  icon: "mehndi" | "wedding";
};

export const weddingDetails = {
  couple: {
    bride: {
      fullName: "Shifa Irfan",
      // ▸ PLACEHOLDER: short name used on the opening scene and monogram.
      shortName: "Shifa",
      parents: "Daughter of Mr and Mrs. Irfan Ahmed Siddiqui",
    },
    groom: {
      // Supplied as "Muhammad Waheed faraz"; capitalised to match "Mr and Mrs Faraz".
      fullName: "Muhammad Waheed Faraz",
      // ▸ PLACEHOLDER: short name used on the opening scene and monogram.
      shortName: "Waheed",
      parents: "Son of Mr and Mrs Faraz",
    },
  },

  wedding: {
    /** Wedding day and start time, with the Pakistan UTC offset. Drives the countdown. */
    startsAt: "2027-01-23T19:00:00+05:00",
    /** How the time is written for guests. */
    timeLabel: "7:00 pm onwards",
    timeZone: "Asia/Karachi",
    // ▸ PLACEHOLDER: no end time was supplied. Only used for the length of
    //   the calendar entry guests save.
    calendarDurationHours: 4,
  },

  venue: {
    name: "Encore by Zafar Group",
    addressLines: ["Pine Ave, Wocland Villas", "Lahore, 54000"],
    mapsUrl: "https://share.google/7vsnbLqVEpunnFUej",
  },

  events: [
    {
      id: "nikaah-mehndi",
      title: "Nikaah & Mehndi",
      date: "2027-01-22",
      time: null, // ▸ PLACEHOLDER: no time supplied, e.g. "6:00 pm onwards"
      place: null, // ▸ PLACEHOLDER: no venue supplied for this event
      icon: "mehndi",
    },
    {
      id: "wedding",
      title: "The Wedding",
      date: "2027-01-23",
      time: "7:00 pm onwards",
      place: "Encore by Zafar Group, Lahore",
      icon: "wedding",
    },
  ] as WeddingEvent[],

  /** Opening scene. The video itself is public/videos/1.mp4 (see README). */
  intro: {
    videoSrc: "/videos/1.mp4",
    /** Optional still shown while the video loads, e.g. "/images/poster.jpg". */
    posterSrc: null as string | null,
    tapLabel: "Tap to open",
    /** Seconds after the page loads before "Tap to open" fades in. */
    tapLabelDelaySeconds: 3,
    /** Second of the video at which the names start to fade in. */
    namesAppearAtSeconds: 3,
    /** Second of the video at which it freezes. */
    pauseAtSeconds: 7,
    /**
     * The date stays hidden on the opening scene so the scratch card further
     * down is a real reveal. Set to true to print it under the names.
     */
    showDateOnOpeningScene: false,
    /** Where the names sit over the video, as % from the top of the screen. */
    namesTopPercent: 33,
  },

  copy: {
    saveTheDate: {
      heading: "Save the date",
      foilText: ["Scratch to reveal", "the wedding date"],
      afterReveal: "We would love to have you with us.",
    },
    welcome: {
      opening: "Together with their families",
      closing: "invite you to celebrate their wedding",
    },
    countdown: {
      heading: "Until we celebrate",
      finished: "The celebrations have begun.",
    },
    venue: {
      heading: "Where we celebrate",
      mapsButton: "Open in Maps",
      calendarButton: "Add to calendar",
    },
    events: {
      heading: "The celebrations",
      timePending: "Time to be announced",
    },
    gifts: {
      // ▸ PLACEHOLDER: no gift wording was supplied. Edit, or set enabled to false.
      enabled: true,
      heading: "Gifts",
      body: "Your presence and your prayers are all we ask for.",
    },
    rsvp: {
      heading: "Will you join us?",
      intro: "Please let the families know so they can welcome you properly.",
      accept: "Joyfully accept",
      decline: "Regretfully decline",
      submit: "Send reply",
      sent: "Reply sent",
      successAccept: "Thank you. Your reply has reached the families, and we look forward to celebrating with you.",
      successDecline: "Thank you for letting us know. You will be missed.",
      notConnected:
        "Online replies are not being collected yet. Please reply to the family directly.",
      failed: "Your reply was not sent. Check your connection and send it again.",
    },
    footer: {
      line: "With love and gratitude",
    },
  },

  /** Browser tab title and link preview text. */
  meta: {
    title: "Shifa & Waheed | Wedding invitation",
    description: "You are invited to the wedding of Shifa Irfan and Muhammad Waheed Faraz.",
  },
};

export type WeddingDetails = typeof weddingDetails;
