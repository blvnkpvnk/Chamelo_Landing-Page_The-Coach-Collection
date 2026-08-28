# The Coach Collection — build notes & handoff

One Checkout Champ–compatible landing page merging the **Vantage** (acetate aviator)
and **Ace** (tennis shield) reservation pages under Patrick Mouratoglou's Coach
Collection. Plain HTML/CSS/JS, no build step, self-contained relative paths.

**Entry point:** `coach-collection.html`
**Assets:** `fonts/` (self-hosted TT Norms Pro), `images/{logo,product,lifestyle,icons}`,
`css/custom/style.css`, `js/custom/custom.js`. Everything is referenced with relative
paths so Checkout Champ can serve the folder as-is.

All copy, specs, prices and Patrick's credentials are transcribed from the two supplied
page screenshots. Nothing was invented — anything not present in the references is an
inline `<!-- TODO: CONFIRM … -->` (see list at the bottom).

## Page structure (8 sections, per brief)
1. Shared hero — combined Coach Collection intro (new copy, flagged), animated Eclipse lens, `$20` above the fold, CTA to picker.
2. Product picker — Vantage + Ace cards, per-product pitch/spec/CTA, plus a compare table ("which is right for me").
3. Eclipse™ instant tint — shared problem framing, side-by-side sun/shade, interactive 4-level slider (54%→17% VLT), how-it-works.
4. Deep dives — Ace tennis lens + 4-feature grid; Vantage open-ear audio + materials list.
5. Created with Patrick — merged bio, both quotes, credentials listed once.
6. Reservation — Vantage/Ace selector, deposit/price/due-today, logistics band. **Checkout Champ form is a TODO placeholder (not fabricated).**
7. FAQ — merged & de-duplicated, product-specific groups.
8. Final CTA + persistent sticky reserve bar with product switch.

## Motion
- Hero lens auto-cycles light↔dark; interactive Eclipse tint slider.
- **Scroll-reveal**: sections/cards fade-and-rise as they enter the viewport
  (self-contained inline script, position-based on scroll/wheel/touch so it
  works in preview iframes/embeds where IntersectionObserver may not fire),
  staggered per group. Fail-safe: content is force-revealed if anything in view
  stays hidden after load or first interaction, so it can never be left blank.
  Disabled — content shown immediately — for `prefers-reduced-motion`, no-JS,
  and print.

## Base-template bug fixed (Rule #4)
The Ace 4-feature grid uses four **distinct** captions (Sweat sheds / Fog stays out /
Nothing slips / No waiting), each with its own body copy — not a repeated generic line.

## Checklist self-report (`Landing_Page_Checklist.xlsx`)
**Met:** headline states the 0.1s benefit; subhead explains the tech; primary CTA in
header (always visible) + reserve buttons at multiple scroll points; `$20` reservation
price above the fold; hero shows the lens *changing* via CSS animation (not a static
photo) + interactive slider in ≥2 placements; side-by-side + slider comparison of
states; simple tech explanation; speed claim with visual cue; clear model
differentiation + compare table; consistent `$20` pricing across both; Patrick featured
credibly with credentials; sticky/persistent CTA on scroll (esp. mobile); lazy-loaded &
web-optimized imagery; visual hierarchy hero→demo→proof→offer→FAQ→final CTA; genuine
scarcity language only; descriptive `alt` on every product/lifestyle image; tint demo
conveys state with **text + numeric VLT**, not colour alone; responsive mobile/tablet/
desktop; TT Norms Pro + blue accent = smart-eyewear identity; reduced-motion honored;
skip link + focus styles.

**Open TODO (need brand input or missing asset):** real hero product-change **video**
(animated CSS lens is the working stand-in); **Checkout Champ form + pixel/tracking**
(no reference snippet supplied — placeholder left per Rule #2); final MSRP; launch date;
deposit refund policy; number of first-release slots; RX availability; battery/charging
spec; confirmation that store-standard shipping/warranty/returns apply to reservations;
the "1,800× faster than photochromic" claim (checklist only).

**Not applicable to this page / handled in the funnel:** customer reviews, press badges,
UGC gallery (no assets supplied — not fabricated); upsell/bundle (post-add-to-cart in
Checkout Champ); analytics, A/B test plan, cross-browser sign-off, legal review (launch
QA steps).

## Every `TODO: CONFIRM` left in the code
1. `<head>` — Checkout Champ tracking/pixel snippet (not invented).
2. Hero — final combined hero headline/tagline (new copy) needs brand sign-off.
3. Hero — real looping product-change **video** asset (Vantage page had one; not supplied).
4. Eclipse — "1,800× faster than photochromic" (in checklist only, not on product pages).
5. Reserve — final retail **MSRP** (source shows `$0` placeholder).
6. Reserve — **Checkout Champ `<form>` / action URL / hidden fields** (no reference snippet).
7. Reserve — deposit **refund policy** (source defers: "[CONFIRMED REFUND OR NON-REFUND POLICY]").
8. Reserve — **number of first-release slots** (source shows "[NUMBER OF SLOTS]").
9. Reserve — whether store-standard shipping/warranty/returns apply to first-release units.
10. FAQ — deposit refundability.
11. FAQ — what happens if final purchase isn't completed.
12. FAQ — launch date.
13. FAQ — charging method & battery life.
14. FAQ — prescription / RX availability.
15. FAQ — 1-year warranty / 30-day guarantee applicability to reservations.
16. `</body>` — Checkout Champ conversion tracking scripts.

## Image sourcing note
The supplied filenames labeled the frames the opposite of what the photos show, so images
were captioned by what's actually pictured: **Coach-Glasses** files show the **Vantage
aviator**; **Sports-Glasses** files show the **Ace shield**.

## Phase 2 (not started)
Lottie tint-slider animation is a later progressive-enhancement pass over the current
slider markup — do not start until the Lottie JSON is supplied.
