# Lance — design plan

Written with the `frontend-design` and `awwwards` skills (two passes: plan, then review against
templated defaults), the Laws of UX, and Rauno Freiberg's Web Interface Guidelines.

## Subject, audience, job

- **Subject:** a bilingual (English / Persian) freelancing platform. People find work, hire, learn,
  show their work, and hand routine work to AI agents.
- **Audience, in priority order:** starters with a skill and no clients yet; working freelancers;
  small businesses and founders who hire; people who teach.
- **The page's job:** get each visitor onto *their* path in one decision (Hick's law: five doors,
  not fifteen), then keep every task one step at a time.

## Concept: the lit portico

"Freelance" comes from Walter Scott's *Ivanhoe* (1819): a *free lance* was a knight who served no
lord. Lance keeps that story literally:

- **Neoclassical structure.** A portico with five columns is the home page and the information
  architecture at once: Work, Hire, Agents, Learn, Showcase. Steps use Roman numerals. Portraits
  stand in arched niches. Composition is symmetric where the content is a choice, and left/start
  aligned where the content is reading.
- **LED light instead of decoration.** Light is the only ornament, and it always means something:
  a **light rail** on the top edge of a surface marks where action happens; **fluting** (vertical
  column grooves) carries a slow light sweep in the hero only; an LED "pip" marks the current
  step. The Figma dot grid is gone.
- **Knights are the agents.** Each agent is a medieval character in an arched niche whose visor or
  lantern carries its LED colour. Merlin, the wizard, is the pricing engine.

## Tokens

| Role | Night (default) | Day | Notes |
|---|---|---|---|
| Ground | Basalt `#111318` | Marble `#F1F2F4` | cool, never cream |
| Surface | `#181B21` | `#FBFBFC` | |
| Raised | `#20242C` | `#FFFFFF` | |
| Hairline | `#2B3039` | `#DADDE3` | 1px, structural only |
| Ink | `#EDEEF1` | `#14161B` | |
| Ink muted | `#A3A8B3` | `#565C68` | ≥ 4.5:1 on surface |
| **Cobalt LED** | `#5B7CFF` | `#2F55E6` | agents, Merlin, AI work |
| **Gilt** | `#E2B65C` | `#9A6B12` | people's craft, Plus, curation |

Two accents, each with one meaning: cobalt is machine light, gilt is human gold. Success
`#4FC48D` / danger `#F06A5B` only for state.

**Type.** English: Inter (variable). Display at 600 with -0.035em tracking, body 17px/1.55. Persian:
Vazirmatn (variable), display 700 at line-height 1.35, body 17px/1.9. One family per script; the
classical voice comes from proportion, numerals and structure, not a second typeface.

**Space.** 4px base: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Within a group 8–12, between
groups 24–32, between sections 96–128 (Law of Proximity). Content max 1200px, 12 columns, 24px
gutters, equal start/end edges.

**Radius.** Concentric: 24 outer, inner = outer − padding (24 − 12 = 12), pills for chips only.

**Motion.** Interactions ≤ 200ms, `cubic-bezier(.16,1,.3,1)`. One orchestrated moment per page
(the hero). Loops pause off-screen and under `prefers-reduced-motion`. Press scale 0.97.

## Review against templated defaults (pass two)

| Draft choice | Reads as | Revision |
|---|---|---|
| Near-black ground + one bright accent | default dark look | Two accents with fixed meanings, cool basalt, and a full day theme |
| Dot-matrix glow texture | Figma file / generic "tech" | Replaced by fluting + light rails tied to architecture |
| Stat strip under the hero ("40k projects · 92%…") | the strip-of-figures tell | Removed; numbers only inside sentences, and only real ones |
| Three equal feature cards per section | SaaS card kit | Bento with one dominant tile per section; varied widths |
| ALL-CAPS eyebrow over every heading | template chrome | No eyebrows; Roman numerals only where content is a sequence |
| Testimonials carousel | polished-quotes tell | None until real users write them |
| Persian as a translation of English | flat, foreign voice | Persian copy written natively; tone notes per string |

## Principles

1. One decision per screen. If a form has more than five fields, it becomes steps.
2. Light means action. A light rail never decorates a static block.
3. Agents never act silently: every agent run shows its plan, its steps, and asks before anything
   leaves your account.
4. Money is always explained. Merlin shows the range *and* the reasons.
