# Lance — information architecture

Built with the `information-architecture` skill (six layers: mental models, sitemap, URLs,
navigation, taxonomy, labels) and its document template.

**Site:** Lance (lance.ir) · **Phase:** new build · **Date:** 2026-11-14 · **Status:** draft for review

> **Validation gap (stated, not guessed).** No card sort or tree test has been run. The labels
> below come from the brief, the conventions of Persian and international marketplaces (Jakob's
> law) and the skill's labeling rules. Before launch: a 15-person closed card sort per language and
> a tree test on the five top tasks.

---

## 1. Audience and intent

| Audience | Top tasks on Lance |
|---|---|
| **Starter** — has a skill, no clients yet | Learn a skill path · build a portfolio · get a first job |
| **Freelancer** — working, wants steadier income | See every relevant job in one place · write proposals faster · get paid safely |
| **Employer** — founder or small team | Post a project at a fair price · hire a person, an offer, or an agent-run PMO · track delivery |
| **Teacher** — knows something well | Sell a course · grow an audience through the Showcase |
| **Agent user** — anyone with routine work | Give a brief to an agent, review its work, ship it |

### Top tasks (each ≤ 3 clicks from home)

1. Find jobs that fit me, from Lance and other sites → **Work**
2. Price and post a project → **Hire → Post a project** (Merlin prices it)
3. Hand work to an agent → **Agents → pick a knight → brief**
4. Start learning from zero → **Learn → Paths**
5. Show my work / see great work → **Showcase**
6. Tailor my CV to a job description → **Plus → CV tailor**
7. Turn a brief into a sprint plan → **Plus → Auto-scrum**, or buy the **Agentic PMO** offer

### Mental model

Users sort this domain **by intent** ("I want work" / "I want to hire" / "I want to learn"), not by
content type. So the primary navigation is five intents, and agents appear both as their own section
*and* inside the intent they serve (the Scout inside Work, Merlin inside Hire, the Smith inside Plus).

---

## 2. Sitemap

Dominant pattern: **hub-and-spoke** (five intent hubs), with a faceted Work listing.

```
Home (/[lang])
├── Work (/work)                         Job Radar: every source in one list
│   └── Job (/work/[job-id])             source, fit, apply on source / draft with the Herald
├── Hire (/hire)                         three ways to hire
│   ├── Post a project (/hire/new)       4 steps; Merlin prices step III
│   └── Offer (/hire/offers/[slug])      fixed-price packages, incl. Agentic PMO
├── Agents (/agents)                     the Round Table
│   └── Agent (/agents/[slug])           what it does, a live run, limits
│       └── Merlin (/agents/merlin)      character, limits, estimator
├── Learn (/learn)                       paths · courses · guides
│   ├── Course or path (/learn/[slug])
│   └── Teach (/learn/teach)             sell a course, 4 steps
├── Showcase (/showcase)                 the Hall (curated) + everyone's work
│   └── Work piece (/showcase/[slug])
└── Utility: Plus · language · theme · Sign in · Start · Dashboard
```

### Pages outside primary nav

| Page | URL | Reached from |
|---|---|---|
| Lance Plus | `/plus` | header utility, Work and Hire upsell slots |
| CV tailor | `/plus/cv` | Plus, job detail ("tailor my CV to this") |
| Auto-scrum | `/plus/scrum` | Plus, Agentic PMO offer, Steward agent |
| Start (onboarding) | `/start` | primary header CTA, every empty state |
| Brand | `/brand` | footer |
| Journeys & user docs | `/docs` | footer |
| Merlin price check | `/merlin` | home ecosystem tile, Post a project step III, footer |
| Sign in | `/sign-in` | header utility; “Send a proposal” (returns to the job via `?next=`) |
| Dashboard | `/dashboard` | after sign-in; footer |
| 404 | any unmatched | — |

---

## 3. URL structure

- Language is the first segment: `/en/...` and `/fa/...`. `/` redirects by `Accept-Language`
  (Persian → `/fa`), then remembers the choice.
- Lowercase, hyphenated English slugs in **both** locales, so a link shared between a Persian and an
  English speaker opens the same page in the reader's language.
- One pattern per content type: `/work/[job-id]`, `/hire/offers/[slug]`, `/agents/[slug]`,
  `/learn/[slug]`, `/showcase/[slug]`.
- Filters live in the query string (`/work?source=ponisha&skill=figma`), so the canonical URL stays
  stable and searches are shareable.

---

## 4. Navigation

**Primary (5):** Work · Hire · Agents · Learn · Showcase. Sticky header; active item gets an LED
underline (no weight change, so no layout shift). Mobile: a sheet opened from the header with the
same five items plus utilities; the five intents are also the segmented nav pill, each with its icon.

**Utility:** Plus, language switch (EN/فا), theme switch, Sign in, and one primary button, **Start**.
In RTL the whole bar mirrors (logical properties only).

**Secondary:** in-page segmented tabs (e.g. Learn: Paths / Courses / Guides). Breadcrumbs on detail
pages only (three levels max).

**Footer:** four groups: Work (Find work, Offers, Plus), Hire (Post a project, Agentic PMO,
Merlin), Learn (Paths, Teach), Lance (Brand, Journeys & docs, Sign in).

**Steps:** any task with more than five inputs is split into steps with a Roman-numeral indicator
(I–IV) that shows done / current / next, allows going back without losing input, and autosaves.

---

## 5. Content types

| Type | Purpose | Key fields | URL |
|---|---|---|---|
| Job | a listing from any source | title, source, original URL, budget, skills, posted, fit score | `/work/[id]` |
| Project brief | an employer's request | type, title, description, skills, budget (Merlin), deadline | `/hire/new` (draft) |
| Offer | fixed-price package | seller (person/agent-assisted), tiers I–III, delivery, scope | `/hire/offers/[slug]` |
| Agent | a knight that does a job | name, role, light colour, inputs, outputs, limits, price | `/agents/[slug]` |
| Course / path | learning content | level, lessons, price, teacher, outcomes | `/learn/[slug]` |
| Showcase piece | someone's work | maker, discipline, images, story, curated flag | `/showcase/[slug]` |
| Guide card | a 1-screen tutorial or onboarding step | title, line, vignette, action | inline |

---

## 6. Taxonomy

**Disciplines (controlled, 8):** Design · Development · Writing · Video · Marketing · Data · Business ·
Teaching. Used in Work, Hire, Learn and Showcase alike, so one filter vocabulary serves the whole site.

**Skills (open tags, governed):** e.g. Figma, React, copywriting. New skills are merged into the
nearest existing tag monthly; a skill needs 5 uses to appear in filters.

**Sources (Work only):** Lance, Ponisha, Karlancer, Jobinja, Jobvision, LinkedIn, Upwork,
Remote OK. Every external job shows its source and links out; Lance never re-hosts the posting.

**Level:** Starter · Mid · Senior (same three words for jobs, courses and Merlin).

---

## 7. Labels (EN and FA written separately, not translated)

| Concept | English | Persian | Why the Persian differs |
|---|---|---|---|
| Find work | Work | کاریابی | the everyday Persian word for job-hunting |
| Hire | Hire | استخدام | |
| Agents | Agents | دستیارها | "ایجنت" is jargon; دستیار is what people say |
| Learn | Learn | یادگیری | |
| Showcase | Showcase | ویترین | Persian shoppers say ویترین for a display window |
| Start (CTA) | Start | از اینجا شروع کن | a direct invitation reads warmer in Persian than a single verb |
| Price check | Ask Merlin | قیمت رو از مرلین بپرس | |
| Job Radar | Job Radar | رادار کار | |
| Offers | Offers | بسته‌های آماده | "offer" has no clean Persian noun; "ready packages" is what it is |
| The Round Table | The Round Table | میزگرد | |

---

## 8. Implementation notes

- Routes mirror this sitemap exactly (`src/App.tsx`).
- Every listing has an empty state that points to the next action.
- Search supports the IA; it never replaces a hub.
