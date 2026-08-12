# Re-skin DSM Sites with the EveryDriver design system

Adopt the visual language from the EveryDriver v6 project across all of DSM Sites (instructor mini-site + search page), reusing its actual code rather than approximating it.

## What the EveryDriver design looks like

- Fonts: Sora (600/700/800) for headings, Manrope (400-800) for body, from Google Fonts.
- Palette: navy `#0C2340` text, deep blue `#1A4A6E` primary, teal `#2D8A9E` accent, soft blue surfaces `#F3F8FF` / `#EAF3FB`, borders `#E8EDF2`, muted text `#5A6B82`.
- Cards: white, generous radius, soft blue-tinted shadows; icon chips in pale tinted circles; pill buttons in deep blue with teal secondary actions.
- Section rhythm: max-width ~1200px wrapper, 24px side padding, eyebrow label + Sora heading + muted subtext.

## What changes in DSM Sites

1. Global styles: replace the current Poppins / `#F8F9FB` / `#1877D6` look with the EveryDriver token set and font stack, copied from that project's `styles.css`.
2. Instructor mini-site keeps the same 8 sections and data flow, restyled:
   - Sticky nav: 80px tall, white with `#EEF2F7` bottom border, Sora wordmark beside the instructor avatar, deep-blue pill "Book now".
   - Hero: same full-height image treatment, Sora display heading, navy-tinted gradient overlay, primary deep-blue CTA plus outlined secondary.
   - Stats, About, Courses, Reviews, Enquiry, Footer: EveryDriver card, chip, badge and typography styling; footer uses their navy `#0C2340` block.
3. Course cards restyled along the lines of their `IOSCourseCard` (icon chip, price emphasis, feature rows, pill CTA) with our simpler data (name, hours, price, start date, transmission).
4. Search page (`/`) restyled with the EveryDriver search + result-card treatment.
5. Copy `AddressAutocomplete.tsx` across so the enquiry form's pickup address gets Google Places autocomplete and auto-extracts the postcode (the spec asked for this "if available"). That file embeds their Google Maps key; if you'd rather not reuse it, we keep the plain input.
6. `brand_colour` still tints each mini-site, now defaulting to `#1A4A6E` instead of `#1877D6`.

## Not included

- No new Supabase tables or schema changes; existing queries and the `enquiries` insert stay as they are.
- No EveryDriver nav mega-menu, marketing pages, portal or admin code — DSM Sites stays self-contained with no shared nav.
- Their image assets are project-scoped pointers, so imagery still comes from instructor records.

## Technical notes

- Copy the `styles.css` tokens and the Sora/Manrope Google Fonts `<link>` entries into `__root.tsx`, replacing the Poppins link.
- Add `src/lib/theme.ts` with the palette/shadow constants so inline styles stay consistent.
- Files touched: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/$slug.tsx`, `src/components/site/InstructorSite.tsx`, `src/components/site/EnquiryForm.tsx`, plus new `src/components/AddressAutocomplete.tsx` and `src/lib/theme.ts`.

## Still outstanding

The Supabase anon key supplied earlier is rejected by that project (`Invalid API key`), so no live instructor data loads yet. The re-skin works regardless, but a current anon/publishable key is needed before the sites show real content.