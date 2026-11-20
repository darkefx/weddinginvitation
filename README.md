# Shifa & Waheed: wedding invitation website

A mobile-first wedding invitation built with Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion and Lucide icons. It scrolls like a normal website on a phone and sits as a phone-width sheet in the centre of tablets and desktops.

The visual design is original to this project: marble niches with pointed arches and inlay-style flowers, drawn as SVG in `components/art/`. No artwork is taken from any other site, and nothing is loaded from external servers.

## What guests see, in order

1. **Opening scene** with your video. It waits for a tap, plays once and freezes at 7 seconds.
2. **Save the date**: a gold foil card to scratch. When most of it is cleared the date appears and rose petals fall for about 3 seconds.
3. **The invitation**: both names with their parents.
4. **Countdown** to 23 January 2027, 7:00 pm Pakistan time.
5. **Venue** with "Open in Maps" and "Add to calendar" (Google Calendar, or an `.ics` file for Apple and Outlook).
6. **The celebrations**: Nikaah & Mehndi, and the Wedding.
7. **Gifts** (optional, see below).
8. **RSVP form**.

Dress code and "Our story" are left out, as requested.

## Run it on your computer

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, the same command Vercel runs
```

## Add your video

1. Name your file exactly `1.mp4`.
2. Put it in `public/videos/`, so the path is `public/videos/1.mp4`.
3. Commit and push. Vercel redeploys on its own.

The site loads it from `/videos/1.mp4`. Nothing in the code needs to change.

How the opening behaves:

| Moment | What happens |
| --- | --- |
| Page loads | The first frame of the video is shown. It does not play. |
| 3 seconds after loading | "Tap to open" fades in. |
| Guest taps the scene | The video plays from the start, with its own sound. |
| Video reaches 3 s | The names fade in, in the clear space in the upper middle. |
| Video reaches 7 s | The video pauses and stays on that frame. The rest of the page unlocks. |
| Tapping or scrolling afterwards | Nothing replays. Only refreshing the page resets it. |

Until the video is added, or if a guest's phone cannot play it, an illustrated cover is shown instead and the invitation still opens.

Tips for the file:

- Portrait (9:16), H.264 video with AAC audio. This plays on every phone.
- Keep it small, ideally under 8 MB, so it starts quickly on mobile data. GitHub's website refuses uploads over 25 MB.
- It should be at least 7 seconds long. If it is shorter, it stops on its last frame.
- To compress with ffmpeg: `ffmpeg -i input.mp4 -vf scale=720:-2 -c:v libx264 -crf 24 -preset slow -c:a aac -b:a 128k -movflags +faststart 1.mp4`

All timings and the height of the names are in `src/data/weddingDetails.ts` under `intro` (`tapLabelDelaySeconds`, `namesAppearAtSeconds`, `pauseAtSeconds`, `namesTopPercent`). If the names sit too high or too low against your curtains, change `namesTopPercent`.

Optional: to show a still image while the video loads, save a screenshot of its first frame as `public/images/poster.jpg` and set `posterSrc: "/images/poster.jpg"` in the same place.

## Change the wedding details

Everything guests read is in one file: **`src/data/weddingDetails.ts`**. Names, parents, date and time, venue, map link, events, every heading and message.

## Things that still need you

These were not in the details supplied. Each is marked `PLACEHOLDER` in `src/data/weddingDetails.ts`.

| Item | Current value | Where |
| --- | --- | --- |
| Short names on the opening scene and footer | "Shifa" and "Waheed" | `couple.bride.shortName`, `couple.groom.shortName` |
| Groom's name capitalisation | "Muhammad Waheed Faraz" (supplied as "faraz") | `couple.groom.fullName` |
| Nikaah & Mehndi time | Shows "Time to be announced" | `events[0].time` |
| Nikaah & Mehndi venue | Not shown | `events[0].place` |
| End time for the calendar entry | 4 hours after 7:00 pm | `wedding.calendarDurationHours` |
| Gifts wording | "Your presence and your prayers are all we ask for." | `copy.gifts` (set `enabled: false` to remove the section) |
| Date on the opening scene | Hidden, so the scratch card is a real reveal | `intro.showDateOnOpeningScene` |
| RSVP storage | Not connected | see the next section |
| Link preview image | Says "Shifa & Waheed" | replace `app/opengraph-image.png` (1200 × 630) if the names change |

## Connect the RSVP form

The form validates what guests type and sends it to `/api/rsvp`. That route forwards each reply to an address you choose. **Until you set one, the form tells guests that online replies are not being collected. It never shows a false "sent" message.**

A free way to collect replies in a Google Sheet:

1. Create a Google Sheet. Add these headings in row 1: `Time, Name, Phone, Attending, Guests, Events, Message`.
2. In the sheet, open **Extensions → Apps Script**, replace the code with this, and save:

   ```js
   function doPost(e) {
     var d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
       new Date(), d.name, d.phone, d.attending, d.guests, (d.events || []).join(", "), d.message,
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app**. Set "Execute as" to yourself and "Who has access" to "Anyone". Copy the web app URL.
4. In Vercel: **Project → Settings → Environment Variables**. Add `RSVP_WEBHOOK_URL` with that URL, then redeploy.

For local testing, copy `.env.example` to `.env.local` and paste the URL there.

Any other service that accepts a JSON POST works the same way (Formspree, Make, Zapier). The data sent is:

```json
{ "submittedAt": "…", "name": "…", "phone": "…", "attending": "yes", "guests": 2, "events": ["Nikaah & Mehndi", "The Wedding"], "message": "…" }
```

## Upload to GitHub

```bash
cd wedding-invitation
git init
git add .
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Or create an empty repository on github.com and drag the contents of this folder into "uploading an existing file". `node_modules` and `.next` are not in the ZIP and must not be uploaded.

## Deploy on Vercel

1. On vercel.com choose **Add New → Project** and import the GitHub repository.
2. Leave every setting as detected (Framework: Next.js). Press **Deploy**.
3. Add `RSVP_WEBHOOK_URL` when you are ready (see above).
4. Add `public/videos/1.mp4` to the repository whenever it is ready. Each push redeploys.

No paid service is needed.

## Project structure

```
wedding-invitation/
├─ app/
│  ├─ layout.tsx            fonts, page title, link preview data
│  ├─ page.tsx              renders the invitation
│  ├─ globals.css           colours, fonts, page background
│  ├─ fonts/                bundled font files
│  ├─ opengraph-image.png   picture shown when the link is shared
│  ├─ api/rsvp/route.ts     receives RSVP replies and forwards them
│  └─ calendar.ics/route.ts the calendar file guests can save
├─ components/
│  ├─ Invitation.tsx        puts the sections in order
│  ├─ HeroIntro.tsx         opening scene and all video behaviour
│  ├─ SaveTheDate.tsx       scratch card section
│  ├─ ScratchCard.tsx       the foil itself
│  ├─ PetalShower.tsx       falling rose petals
│  ├─ Welcome.tsx  Countdown.tsx  Venue.tsx  Events.tsx  Gifts.tsx  Rsvp.tsx  Footer.tsx
│  ├─ Reveal.tsx            line-by-line text appearance
│  └─ art/                  the illustrations (SVG)
├─ src/
│  ├─ data/weddingDetails.ts   ← all wedding information
│  └─ lib/dates.ts             date formatting and calendar links
└─ public/
   ├─ images/               background textures
   └─ videos/               put 1.mp4 here
```

## Motion and accessibility

- Text appears line by line as each part scrolls into view. The only larger moments are the opening and the petals.
- Phones set to "Reduce motion" get simple fades, no petals, and an instant opening.
- The scratch card has a keyboard "Reveal the wedding date" button, and every control can be reached and used without a mouse.

## Fonts

Marcellus, EB Garamond and Pinyon Script are bundled in `app/fonts/` under the SIL Open Font License 1.1, which allows use and redistribution in a project like this.
