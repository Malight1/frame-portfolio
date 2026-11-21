---
name: Ireti Cole, director and photographer
description: A videographer and photographer portfolio shot through an anamorphic lens.
colors:
  flare: "#7cc4ff"
  flare-hover: "#a6d7ff"
  flare-core: "#cfeaff"
  flare-deep: "#3f8fd6"
  ground: "#07080a"
  ground-raised: "#0d0f12"
  ground-focus: "#14171b"
  letterbox-black: "#000000"
  warm-white: "#eceae6"
  ash: "#a9adb3"
  smoke: "#7a7f86"
  dimmed-title: "#3b4047"
  hairline: "rgba(236, 234, 230, 0.12)"
  hairline-strong: "rgba(236, 234, 230, 0.22)"
  error-coral: "#ff9a8a"
typography:
  display-hero:
    fontFamily: "Panchang, Arial Black, sans-serif"
    fontSize: "clamp(2.4rem, 8.2vw, 7.4rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Panchang, Arial Black, sans-serif"
    fontSize: "clamp(2.6rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Panchang, Arial Black, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Panchang, Arial Black, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "General Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.3rem, 2.3vw, 2.1rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "General Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "General Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  label:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.04em"
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 3vw, 44px)"
  header: "72px"
  header-mobile: "60px"
  grid-gap: "24px"
  section: "clamp(96px, 15vh, 180px)"
  section-tight: "clamp(64px, 10vh, 120px)"
components:
  button-flare:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.ground}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "46px"
  button-flare-hover:
    backgroundColor: "{colors.flare-hover}"
  button-flare-lg:
    backgroundColor: "{colors.flare}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "0 30px"
    height: "60px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.warm-white}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "46px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  filter-chip-pressed:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.ground}"
  input-field:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    height: "50px"
  input-field-focus:
    backgroundColor: "{colors.ground-focus}"
  header:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    height: "{spacing.header}"
    padding: "0 {spacing.gutter}"
---

# Design System: Ireti Cole, director and photographer

## Overview

**Creative North Star: "Shot Through an Anamorphic Lens"**

The whole site behaves like footage captured on a widescreen anamorphic lens. The ground is a cool near-black, footage sits in 2.39 frames edged by black letterbox bars, a single flare blue appears as horizontal streaks and as the one action, fine grain drifts over everything, and display type arrives horizontally stretched before settling to true width. The interface recedes; footage and photographs carry the page, and the optics are the only ornament.

Density is low and cinematic: huge uppercase extended titles, generous section padding, and long horizontal hairlines that read as the edges of a frame. Everything is square-cornered. Depth comes from light (streaks, glow, grain) rather than from stacked cards or shadows. Motion is the language of a lens and an edit: a slit opening into a frame, a squeeze relaxing, a streak wiping between pages.

This world replaces the earlier light "darkroom" direction, which was rejected. It also refuses the stock dark reel-plus-grid with a centred logo: the name sits bottom-left over the reel, and selected work is a list of titles rather than a thumbnail grid.

**Key Characteristics:**
- Cool near-black ground, warm-white type, one flare-blue accent.
- Letterboxed 2.39 frames with glowing flare hairlines on their edges.
- Panchang 800 uppercase display, General Sans for reading, Geist Mono for spec labels.
- Sharp corners and hairline rules everywhere; no radius.
- Fixed film grain at 4% over every page.
- The de-squeeze: display type enters at 2.4x width, blurred, and settles to 1x.
- Page transitions are a flare streak that wipes the frame.

## Colors

A near-monochrome cool night with one cold point of light.

### Primary
- **Anamorphic Flare Blue** (`flare`): the single accent. Used for the primary action ("Book a shoot", "Send enquiry"), focus outlines, text selection, the active nav underline, the input focus border, the project play button's hover ring and the confirmation panel outline. As light, it is the colour of every streak and letterbox hairline.
- **Flare Hover** (`flare-hover`): the primary button's hover fill only.
- **Flare Core** (`flare-core`): the hot white-blue centre of a streak gradient. Never a fill or text colour.
- **Deep Flare** (`flare-deep`): defined in the root token set for the darker end of the flare; reserved, not a surface colour.

### Neutral
- **Lens-Cap Ground** (`ground`): the page, the header's solid state (at 82% with blur), the menu overlay, text on flare buttons.
- **Raised Ground** (`ground-raised`): input backgrounds and image placeholders while media loads.
- **Focus Ground** (`ground-focus`): input background on focus.
- **Letterbox Black** (`letterbox-black`): pure black behind all framed footage, the letterbox bars, the full-screen viewers. It is deliberately darker than the ground so frames read as a projection inside the page.
- **Warm White** (`warm-white`): headlines, body text, the pressed filter fill.
- **Ash** (`ash`): secondary copy, nav links at rest, captions (8.6:1 on ground).
- **Smoke** (`smoke`): mono labels, placeholders, footer text (4.9:1 on ground).
- **Dimmed Title** (`dimmed-title`): the colour non-hovered titles in the selected-work list drop to while one row is hovered; inactive discipline names use a near-identical value.
- **Hairline / Strong Hairline** (`hairline`, `hairline-strong`): list rules, section dividers, footer rule (12%); ghost button, filter and input strokes (22%).
- **Error Coral** (`error-coral`): form validation text and invalid field borders only.

### Named Rules
**The One Light Source Rule.** Flare blue is the only hue in the interface. It appears as light (streaks, hairline glows) or as the single primary action per view. No second accent, no tinted surfaces, no blue body text.

**The Projection Rule.** Footage always sits on letterbox black, never on the ground colour, so every frame reads as a screen inside the dark room.

## Typography

**Display Font:** Panchang 800 (with Arial Black, sans-serif)
**Body Font:** General Sans 400/500/600 (with Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** Geist Mono 400 (with ui-monospace, Menlo, monospace)

**Character:** Panchang is an extended, heavy uppercase face: it is the de-squeezed voice, already wide, as if the lens just let it go. General Sans reads quietly underneath. Geist Mono sets metadata like the spec label on a film can.

### Hierarchy
- **Display Hero** (800, `display-hero`, line-height 0.86, uppercase, no wrap on desktop): the name over the home reel only.
- **Display** (800, `display`, 0.92, uppercase): page titles (Work, Photography, About, Book a shoot), the closing call and the next-film title (each page tunes the clamp between 1.7rem and 8vw but keeps the 6rem to 7rem ceiling).
- **Headline** (800, `headline`, 0.92, uppercase): section titles.
- **Title** (800, `title`, 0.92, uppercase): discipline names, card titles, step titles, the form confirmation.
- **Fitted Titles**: selected-work titles on the home page are sized by script so each fills the full measure (30px to 150px), edge to edge.
- **Lede** (500, `lede`, 1.25, max 30ch, balanced): statements and introductions.
- **Body** (400, 17px, 1.6): reading copy, 34ch to 46ch measures.
- **Label** (Geist Mono 400, 12px, 0.04em, uppercase, tabular numerals, smoke): metadata such as kind, ratio, year, credits roles and reel length.

### Named Rules
**The De-Squeeze Rule.** Display headings enter horizontally stretched (scaleX 2.4, blurred 10px, transparent) and settle to true width over 1.6s on an expo-out curve, line by line, from the left edge. Body text never de-squeezes; it fades up 24px.

**The Spec Label Rule.** Mono labels are metadata set beside or below the thing they describe, like credits on a spec sheet. They are never decorative headings above a title.

## Layout

A 12-column grid with a 24px gap sits inside a fluid gutter (`gutter`, 16px to 44px). Sections breathe with tall vertical padding (`section`, tightened to `section-tight` where sections follow each other closely). The header is fixed at 72px (60px under 760px), transparent over the hero, turning solid with a blur after 40px of scroll and hiding on downward scroll.

Composition is asymmetric: statements take 8 columns with a 4-column side note; about, contact and services split 5/6 with an empty column between. The work grid staggers in a four-card cycle (7 then 5 columns, 5 then 6) with 8vh to 14vh vertical offsets; the photo teaser staggers 4/5/3 columns at different heights. The photography page is a three-column masonry.

Frames use cinema ratios: 2.39 for the hero, project film, previews and first still; a 4.8 "slit" strip under page heads (2.39 on phones); 1.85 for the disciplines screen. Breakpoints are 860px (nav collapses to a full-screen menu, grids go single column) and 760px (hero, teaser, stills and footer stack). Smooth scrolling runs through Lenis (lerp 0.09).

## Elevation & Depth

The system is flat. Depth comes from light and projection, not lifted surfaces: black letterboxed frames inside a slightly lighter ground, flare streaks with soft blue glows, and the grain layer floating above everything. The only true shadow is the soft dark drop under the floating preview that follows the pointer.

### Shadow Vocabulary
- **Letterbox bars** (`box-shadow: 0 -14px 0 #000, 0 14px 0 #000`): the black bars above and below every framed piece of footage.
- **Letterbox hairline glow** (`box-shadow: 0 0 14px 1px rgba(124,196,255,.35)` on a 1px flare gradient line, 70% opacity, 100% on hover): top and bottom edges of framed footage.
- **Transition streak** (`box-shadow: 0 0 24px 4px rgba(124,196,255,.55)`): the 2px page-wipe streak.
- **Closing streak** (`box-shadow: 0 0 60px 10px rgba(124,196,255,.25)`): the horizon line behind the closing call, brightening with scroll.
- **Preview drop** (`box-shadow: 0 30px 80px -20px rgba(0,0,0,.8)`): the floating 2.39 preview only.
- **Header seam** (`box-shadow: 0 1px 0` hairline): the solid header's bottom edge.

### Named Rules
**The Light, Not Lift Rule.** Elements gain presence by glowing (a brighter hairline, a stronger streak) rather than by rising on a shadow. Cards never lift on hover; their media scales 1.03 to 1.04 inside a clipped frame.

**The Grain Rule.** One fixed fractal-noise layer at 4% opacity, shifting in six steps per second, covers every page above content and below overlays. It stops under reduced motion.

## Shapes

Every corner is square (`rounded.none`): buttons, chips, inputs, frames, viewers. Strokes are 1px hairlines drawn as inset box-shadows on buttons and chips and as borders on inputs and list rules. Recurring silhouettes are horizontal: the 2.39 frame, the 4.8 slit, the 2px streak, and the media reveal that opens from a slit (clip-path inset 48% top and bottom to 0) over 1.5s on an expo in-out curve. Inline arrows are 16px stroked SVGs at 1.5px.

## Components

### Buttons
Sharp and direct; one bright intent.
- **Shape:** square corners (`rounded.none`), 46px tall, 60px for the large variant.
- **Flare (primary):** flare fill, ground text, 600 weight. Used for "Book a shoot" in the header and closing call, and "Send enquiry". One per view region.
- **Hover / Focus:** fill lifts to flare-hover over 0.3s; press nudges down 1px; focus is a 2px flare outline offset 3px.
- **Ghost:** transparent with a 22% hairline inset stroke that turns warm white on hover. Used for "Watch the reel".
- **Text link:** 500 weight with an underline that rests at 30% width and draws to full width on hover over 0.5s; often trails a 16px arrow.

### Chips
- **Style:** filter chips, 40px tall, 14px text, ash on transparent with a 22% hairline inset stroke; the count sits after the name in mono at 11px.
- **State:** hover brightens text and stroke; pressed inverts to a warm-white fill with ground text and no stroke.

### Cards / Containers
- **Corner Style:** square.
- **Background:** letterbox black behind media; no card surface.
- **Shadow Strategy:** letterbox bars and hairline glow (see Elevation).
- **Border:** none; info sits below the frame.
- **Internal Padding:** 16px above the info row (title and mono ratio, then type-for-client and mono year).
- **Behaviour:** a poster image at rest; the muted clip fades in and the media scales 1.04 over 1.2s on hover or focus.

### Inputs / Fields
- **Style:** raised-ground fill, 1px strong hairline border, square, 50px tall (textarea 150px); 14px 500 label above.
- **Focus:** border turns flare, fill moves to focus ground, no outline ring.
- **Error:** error-coral border and 14px message below.

### Navigation
- **Style:** wordmark in Panchang 800 at 15px on the left; links in General Sans 15px, ash at rest, warm white on hover; the current page gets a 1px flare underline; the flare "Book a shoot" button on the right.
- **Mobile:** under 860px links collapse behind a "Menu" text button that opens a full-screen ground overlay listing pages in Panchang uppercase at up to 3.4rem.

### Letterbox Frame (signature)
Every framed piece of footage or still: letterbox-black backing, 14px black bars above and below, a 1px flare gradient hairline with a soft glow on each edge that brightens on hover, and a slit-open reveal on first view.

### Anamorphic Hero (signature)
A WebGL2 canvas: a blue flare streak sweeps across, then opens vertically into a 2.39 letterbox (a taller 0.82 frame on phones) that plays the reel, ripples under the pointer with chromatic fringes, carries drifting oval bokeh and a pointer-following horizontal flare, and adds its own grain. Without WebGL or with reduced motion it falls back to the reel video in a plain 2.39 band. The name de-squeezes in over the bottom-left; the intro line and ghost reel button sit bottom-right.

### Flare Wipe (signature)
Internal navigation draws a 2px flare streak across the centre (0.45s), then a ground fill closes vertically over it (0.6s); the next page opens the fill and retracts the streak.

### Title List with Floating Preview
Selected work is a ruled list of fitted titles with mono metadata underneath. Hovering one dims the others to dimmed-title, and a 2.39 preview with a flare centre line follows the pointer. On touch devices the preview is replaced by an inline 2.39 thumbnail above each title.

## Do's and Don'ts

### Do:
- **Do** frame footage in cinema ratios (2.39, 1.85, the 4.8 slit) on letterbox black with the flare hairline edges.
- **Do** keep flare blue to light effects and one primary action per view; use the flare focus outline (2px, 3px offset) on every interactive element.
- **Do** set display headings in Panchang 800 uppercase at line-height 0.86 to 0.92 and de-squeeze them in from 2.4x.
- **Do** set metadata in Geist Mono 12px uppercase smoke, beside or below what it describes.
- **Do** reveal media from a horizontal slit and transition pages with the flare wipe; honour reduced motion by dropping to static.
- **Do** separate content with 1px hairlines rather than boxes.

### Don't:
- **Don't** round corners anywhere.
- **Don't** add a second accent hue, tint surfaces blue, or use gradient text; the flare gradient belongs to streaks and hairlines only.
- **Don't** lift cards or panels on shadows; glow a hairline or scale the media inside its frame instead.
- **Don't** fall back to the stock dark reel with a centred logo over a thumbnail grid.
- **Don't** place mono labels above headings as kickers or eyebrows.
- **Don't** reintroduce the rejected light darkroom palette.
