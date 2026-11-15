# Lance: design plan

The brand comes from the Lance brand file in Figma (pages 03 · Brand — Logos and
04 · Brand — Guidelines). The site applies it, and adds only what the file leaves open: a real LED
matrix in place of the dot field, five agent characters drawn in the file's style, and a day theme.
Written with the `frontend-design` and `awwwards` skills, the Laws of UX, and Rauno Freiberg's Web
Interface Guidelines.

## Subject, audience, job

- **Subject:** a bilingual (English / Persian) freelancing platform. People find work, hire, learn,
  show their work, and hand routine work to AI agents.
- **Audience, in priority order:** starters with a skill and no clients yet; working freelancers;
  small businesses and founders who hire; people who teach.
- **The page's job:** get each visitor onto *their* path in one decision (Hick's law: five sections,
  not fifteen), then keep every task one step at a time.

## The brand (from the guidelines)

- **Story.** Freelancing is a way of working on your own terms. Lance borrows the free lances of
  old: knights who served no single lord and moved with nothing but their skill.
- **Values.** Trustworthy, transparent, professional.
- **Logo.** «لنس» for Persian and the mark + "lance" for Latin. The mark is a lance tip that is also
  a mouse pointer. One colour: pink on dark, black on pink or light grounds, pink on deep magenta.
  Never other colours, rotation, stretching, glows or shadows. Minimum 82 px on screen, 3 cm in print.
- **Personality.** The Lancer, a knight on horseback, flat and pink.
- **Merlin.** A wizard's head in the same construction. On the site he is the pricing engine.
- **Colour.** Pink `#FF7FE3` on black `#0D0D0D`. Secondaries: sky `#7FBDFF`, mint `#7FFFBF`,
  sun `#FFE57F`, ember `#FF2929`. Neutrals `#141414`, `#1F1F1F`, `#303030`, `#CCCCCC`.
  Ratio 60 black / 30 white / 10 pink.
- **Type.** Peyda (Persian), SF Pro (Latin), IBM Plex Mono.
- **Stage.** Event sheets show an LED wall behind a dark stage, with thin pink beams; posters set
  "i'm a lancer" / «منم یه لنسرم!» big and bold on pink or black.
- **Pattern.** Two hooked strokes that make a four-point spark.

## Screens follow the Figma web designs

Layouts and components come from 09 · Lance — Desktop Flows and 10 · Merlin — Desktop:
Landing (03) for Home, Discovery for Work, Project single page for the job page, Make Project for
Post a project, Dashboard for the workspace, Lance Plus page for Plus, and the Merlin pages. UX
checks kept where they improve the Figma flow: Post a project stays four short steps; Merlin's
estimate updates live instead of on submit; Work filters apply instantly (the Figma "apply" button
scrolls to the results); sign-in returns you to the page that asked for it; numbers on Home are
true ones (7 sites, 7 agents, free posting) rather than invented counts; no testimonials until real
users write them.

## How the site applies it

| Brand element | On the site |
|---|---|
| Logo and mark | Original vectors in `src/brand/Logo.tsx`; `--logo` is pink at night, black by day |
| The Lancer | The brand book; the Home hero uses the LED curtain from the Figma landing (`LedCurtain` in `src/brand/Stage.tsx`) |
| Merlin | Original vector; the pricing agent |
| Agents | Merlin plus six characters drawn in the same flat, angular, one-colour way: four knights told apart by their helm and two hooded figures (`src/brand/Knights.tsx`) |
| Colour | Tokens in `src/index.css`; secondaries mark the five areas (Work sky, Hire pink, Agents mint, Learn sun, Showcase ember) |
| Type | Inter for English (the brief fixes Inter; it is the open cousin of SF Pro), Peyda (licensed web fonts, nine weights, kept out of the public repo; see `public/fonts/peyda/README.md`) with Vazirmatn as the fallback, IBM Plex Mono for labels and numbers |
| LED | `LedWall` canvas: lit pixels with bloom inside the figure, dim pixels elsewhere, one slow scan. Replaces the flat dot field |
| Beams | `Beams`: four thin angled lines, behind headlines only |
| Tiles | `.tile`: a brand colour fading into black, as on the logo sheet |
| Posters | Oath cards: solid pink or sun with black type and figure |

**Day theme (site addition).** The ground turns light, pink stays a fill with black type, and pink
text becomes deep magenta `#A0127C` (7.3:1 on white). The hero stage stays dark in both themes.

**Space.** 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Within a group 8–12, between
groups 24–32, between sections 96–128 (Law of Proximity). Content max 1200px.

**Motion.** Interactions ≤ 200ms, `cubic-bezier(.16,1,.3,1)`. One moving thing per screen (the LED
scan). Loops pause off-screen and under `prefers-reduced-motion`.

## Contrast

| Pair | Ratio |
|---|---|
| Pink on `#0D0D0D` | 8.7:1 |
| Black on pink (buttons) | 8.7:1 |
| `#8F8F8F` subtle text on `#141414` | 5.7:1 |
| Deep magenta `#A0127C` on white (day) | 7.3:1 |
| Ember `#FF2929` on `#0D0D0D` | 5.2:1 |

## Principles

1. One decision per screen. If a form has more than five fields, it becomes steps.
2. Light means something: the LED pip is "live" or "current", the strip on a panel is "act here".
3. Agents never act silently: every agent run shows its plan, its steps, and asks before anything
   leaves your account.
4. Money is always explained. Merlin shows the range *and* the reasons.
