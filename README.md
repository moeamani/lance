# Lance · لنس

A bilingual (English / Persian) freelancing platform, designed and built from scratch: find work from
every job site in one list, hire with a fair price, hand routine work to agents, learn a skill, and
show your work.

- **Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion (`motion/react`) · React Router 7 · Hugeicons
- **Languages:** English (Inter) and Persian (Vazirmatn), each with its own native copy, not a translation. Persian is RTL with Persian digits, Toman and Jalali dates. URLs are prefixed `/en` or `/fa`.
- **Themes:** night (default) and day, switched without transition flashes.

```bash
npm install
npm run dev        # http://localhost:5173 → redirects to /en or /fa
npm run build      # typecheck + production build
```

All content is demo data in `src/data/`. Nothing is sent anywhere.

## The product

| Area | Route | What it does |
|---|---|---|
| Home | `/` | The Figma landing: LED-curtain hero, top services (each opens a pre-filled project), true numbers, Job Radar preview, how it works for lancers and employers, why Lance, the ecosystem (with a live Merlin estimate), talent from the Hall, money safety, fees, FAQ. |
| Job Radar | `/work`, `/work/:id` | The Figma Discovery layout. Jobs from Lance plus Ponisha, Karlancer, Jobinja, LinkedIn, Upwork and Remote OK, deduplicated and ranked by fit; filters kept in the URL; bookmarks and a Saved tab. The job page has the Figma info-row sidebar. |
| Hire | `/hire`, `/hire/new`, `/hire/offers/:slug` | Post a project in four steps, with Merlin's price check at step III. Fixed offers, including the **Agentic PMO** (Squire, Steward, Castellan tiers). |
| The Round Table | `/agents`, `/agents/:slug` | Seven agents, each a medieval character with one job. Every run shows its plan, its steps, and stops for your review. |
| Merlin | `/merlin` | The Figma Merlin page: one estimate card that updates as you choose, the reasons behind the range, saved estimates in a history list, and “Post this project”. |
| Learn | `/learn`, `/learn/:slug`, `/learn/teach` | Free paths for starters, paid courses, and a four-step flow to publish your own course. |
| Showcase | `/showcase`, `/showcase/:slug` | Everyone's work, plus the Hall: pieces selected by the Lance team. |
| Lance Plus | `/plus`, `/plus/cv`, `/plus/scrum` | CV tailored to a job description (the Smith) and a scrum board generated from a brief (the Steward). |
| Start | `/start`, `/sign-in` | Onboarding that branches by intent, one question at a time. Sign in sends a 4-digit code (any four digits in the demo) and returns you to where you were. |
| Dashboard | `/dashboard` | The Figma workspace: new project, current projects, Plus, transactions, wallet with escrow, this month's income, your projects as lancer or employer, this week's tasks, profile completion. Demo data. |
| Brand | `/brand` (footer) | The brand book: concept, mark, colour, type, light, knights, voice, motion. |
| Journeys & docs | `/docs` (footer) | Links to the atlas below. |

## Brand

The screens follow the Figma web designs (09 · Desktop Flows and 10 · Merlin Desktop): the
segmented nav pill, `#1F1F1F` cards inside `#141414` panels, one pink word in each headline, round
icon chips, filled inputs, the filter and info-row sidebars, option cards and day tiles. Where the
Figma flow had a gap, the site keeps the UX fix (steps in Post a project, live Merlin estimates,
instant filters, a return path after sign-in).

The brand comes from the Lance brand file in Figma (Brand — Logos and Brand — Guidelines): the
«لنس» and "lance" logos, the lance-tip mark (a lance and a mouse pointer in one shape), the Lancer
knight, Merlin, pink `#FF7FE3` on `#0D0D0D` with sky, mint, sun and ember as secondaries in a
60/30/10 ratio, and Peyda, SF Pro and IBM Plex Mono.

The site adds three things the file leaves open:

- **A real LED wall.** The file's flat dot field becomes a canvas LED matrix with lit pixels and bloom: the slanted LED curtain of the Figma landing hero on Home, and the mark or a character on the Brand page (`src/brand/Stage.tsx`).
- **Six agent characters** beside Merlin, drawn in the file's flat, angular, one-colour style: four knights told apart by their helm and two hooded figures (`src/brand/Knights.tsx`).
- **A day theme.** Pink stays a fill with black type; pink text becomes deep magenta `#A0127C`. The hero stage stays dark.

English uses Inter (the brief fixes it; it stands in for SF Pro). Persian uses Peyda, loaded
from `public/fonts/peyda/`. Peyda is proprietary (Fontiran), so its files are not in this public
repository: put the licensed `woff2` files and your filled-in `FontLicense.txt` there (see the
README in that folder). Without them, Persian falls back to Vazirmatn. Details: [`docs/design-plan.md`](docs/design-plan.md) and the
Brand page (`/brand`, linked from the footer). Information architecture:
[`docs/information-architecture.md`](docs/information-architecture.md).

## The atlas: journeys and user documents

Drawn with the **diagram-design** skill, skinned to the Lance brand palette (pink on black), generated by
[`scripts/atlas/build.py`](scripts/atlas/build.py) into `public/atlas/` (served at `/atlas/index.html`):

| File | Type |
|---|---|
| `personas.html` | Five proto-personas on a quadrant, with jobs to be done |
| `sitemap.html` | The five intent hubs, the pages outside the nav, and the full URL table |
| `journey-starter.html` · `journey-freelancer.html` · `journey-employer.html` · `journey-agents.html` · `journey-teacher.html` | User journey maps: five stages, sentiment curve, trough, pain points, and the opportunity each one suggests |
| `blueprint-pmo.html` | Service blueprint of the Agentic PMO |
| `state-project.html` | Project and escrow lifecycle |

```bash
python3 scripts/atlas/build.py
cd .claude/skills/diagram-design
python3 scripts/self_check.py ../../../public/atlas/journey-starter.html
python3 scripts/verify_geometry.py ../../../public/atlas/journey-starter.html
```

Every diagram page passes both checks. The personas are proto-personas from the brief, not interview data, and the sitemap has not been card-sorted yet; both are flagged on the pages.

## Skills used

Installed under `.claude/skills/`, each with its licence:

| Skill | Source |
|---|---|
| diagram-design | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) (MIT). Its style guide now carries a Lance profile. |
| awwwards | [tponscr-debug/claude-skill-awwwards](https://github.com/tponscr-debug/claude-skill-awwwards) (MIT) |
| frontend-design | [anthropics/skills](https://github.com/anthropics/skills) (Apache 2.0) |
| information-architecture | [rampstackco/claude-skills](https://github.com/rampstackco/claude-skills) (MIT) |
| user-persona, jobs-to-be-done, journey-map, onboarding-design, form-design, navigation-patterns, localization-design, law-of-proximity, critique-visual-hierarchy, critique-information-density | [Owl-Listener/designer-skills](https://github.com/Owl-Listener/designer-skills) (MIT) |

## Research

- [Laws of UX](https://lawsofux.com/): Hick's law (five sections in the nav pill), goal-gradient (the lit step rail), proximity (the spacing scale), and the Doherty threshold (agent runs show each step at once).
- [Web Interface Guidelines](https://interfaces.rauno.me/) by Rauno Freiberg: interactions within 200ms, box-shadow focus rings, no hover effects on touch, no font-weight change on hover, theme switching without transitions, an SVG favicon that follows `prefers-color-scheme`.
- [interfaces.dev](https://interfaces.dev/): craft details for motion and feedback.
- [Origin Kit](https://www.originkit.dev/): LED and glow treatments, reinterpreted as the light rails and pips.

## Structure

```
src/
  brand/     Logo (original vectors), Knights (Lancer, Merlin + six agents), Stage (LED curtain, LED wall, beams, spark)
  ui/        core (Button, Field, Panel, Tag, …), steps, cards (GuideCard, OathCard), overlay (Sheet, Toast), tabs, AgentRun, covers
  layout/    Shell: header, language switch, theme, footer, page transitions
  pages/     one file per area
  i18n/      locale.tsx: t(), number, money, range, date helpers for EN/FA
  lib/       merlin.ts (price estimate with reasons), format.ts, validate.ts
  data/      agents, jobs, offers, courses, showcase pieces
scripts/atlas/build.py   diagram generator
public/atlas/            generated diagrams
docs/                    design plan and information architecture
```
