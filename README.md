# لنس · Lance

A coded, clickable build of the **Lance** freelance-marketplace mobile app (Figma page `08 · Lance — Mobile Flows`), with a reusable component library and fixes for the UX issues found in the design file.

- **Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion (`motion/react`, formerly Framer Motion) · React Router 7 · Hugeicons
- **Locale:** Persian, RTL, Persian digits, Toman and the Jalali calendar throughout
- **State:** a small context store persisted to `localStorage`. Mock data lives in `src/data/`, so swapping in an API only touches that layer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

Useful entry points: `/` (landing) · `/auth/signup` · `/app` (dashboard; switch the لنسر/کارفرما role at the top) · `/design-system` (living style guide).

> Demo affordances: any OTP except `0000` is accepted (`0000` shows the error state). A valid SHEBA for the verification flow is `IR750560611828001234567801` (Bank Saman), and a valid national ID is `0013542419`.

---

## Figma → code map

| Figma section | Route(s) | Notes |
|---|---|---|
| 01 · Public / Landing (+10 category landings) | `/`, `/services/:slug` | One component; the hero adapts to the category |
| 02 · Public / Blog | `/blog`, `/blog/:id` | Shared-element cover transition |
| 03 · Onboarding / Sign Up & Login | `/auth/signup`, `/auth/login`, `/auth/login/password`, `/auth/password` | OTP is a bottom sheet |
| 04 · Onboarding / OTP & Role Selection | `/auth/role`, `/auth/welcome` | |
| 05 · Onboarding / Identity Verification | `/verify` | 4 frames → one 3-step flow |
| 06/07 · Projects / Create | `/projects/new`, `/projects/new/done` | 1 long form → 4 steps + review |
| 08 · Discovery | `/app/discover`, `/app/discover/:id`, `/app/lancer/:id` | Filter + sort sheets, proposal sheet |
| 09/10 · Workspace (Freelancer / Employer) | `/app`, `/app/projects`, `/app/projects/:id`, `/app/projects/:id/requests`, `/app/wallet`, `/app/payment/:status`, `/app/notifications`, `/app/plus`, `/app/templates` | The role toggle switches between the two dashboards |
| 11/12 · Messaging | `/app/messages`, `/app/messages/:id` | Replies, attachments, quick replies, in-chat search |
| 13/14 · Profile & Settings | `/app/profile`, `/app/profile/edit`, `/app/profile/skills`, `/app/settings/*` | |

About 200 Figma frames collapse into **35 routes**, because empty, edit, modal and success frames are now **states** of one screen rather than separate artboards.

## Structure

```
src/
  components/
    ui/          # design-system primitives (Button, Field, OtpInput, Sheet, Toast, SegmentedControl, Slider, …)
    layout/      # AppHeader, BottomNav, Screen, route shells + page transitions
    domain/      # ProjectCard, LancerCard, BookmarkButton
  screens/       # one folder per Figma section
  lib/           # format.ts (fa-IR numbers/Toman/Jalali), validate.ts (mobile/کد ملی/شبا/password), motion.ts
  data/          # catalog + mock data (realistic copy, no lorem ipsum)
  store/         # AppStore (role, auth, bookmarks, tasks, chat)
```

Design tokens in `src/index.css` mirror the Figma variables one to one (`Color/Primary/500` → `--color-primary`, `Cards/Primary` → `--color-surface` …), so handoff stays lossless.

---

## Research summary

| Finding | Applied as |
|---|---|
| Persian UIs should use one numeral system: Extended Arabic-Indic digits (۰–۹), never mixed. A single "Arabic" setting is wrong for Persian.<sup>[1][2]</sup> | `formatNumber` / `formatToman` / `toFaDigits` everywhere. Inputs accept Persian or Latin digits (`toEnDigits` before validating). |
| Only mirror icons that imply direction (back/forward, send). Don't mirror clocks, cameras or phone numbers.<sup>[1][3]</sup> | `<Icon directional>` opt-in. Phone, SHEBA and OTP fields are LTR islands inside RTL. |
| Marketplaces build trust by making escrow explicit: funds are held per milestone and released on approval.<sup>[4][5]</sup> | `StepTimeline` (پرداخت کارفرما → در ضمانت لنس → آزادسازی) on the landing page, project financials and the accept-proposal dialog. Proposal sheet shows net payout after fees. |
| Winning proposals open with specifics from the brief and propose a small first milestone.<sup>[6]</sup> | Inline coaching hint in the proposal sheet, a blog article, and a 20-character minimum on the cover note. |
| An Upwork App Store review reports the contracts/milestones page breaking on phone screens (one anecdote, not a study).<sup>[7]</sup> | Contract data is laid out mobile-first (tabs, cards, a 4-column table that fits 360px). |

1. Material Design — Bidirectionality: https://m2.material.io/go/design-bidirectionality
2. Workday Canvas — RTL and Bidi: https://design.workday.com/globalization/rtl-and-bidi
3. Wikimedia Codex — Bidirectionality: https://doc.wikimedia.org/codex/v1.18.0/style-guide/bidirectionality.html
4. Contra — freelance marketplace escrow: https://contra.com/p/ANBEbBAE-revolutionizing-contractor-hiring-with-a-freelance-marketplace
5. Freelancer.com vs Upwork (milestone funding): https://flexiple.com/compare/freelancer-vs-upwork
6. GigRadar — winning proposals (vendor content, treat as directional): https://gigradar.io/blog/5-real-upwork-jobs-winning-proposals
7. Upwork iOS app reviews: https://apps.apple.com/pk/app/id1446736499

---

## What was improved (and why)

### Bugs in the Figma file, fixed in code
1. **Clipped, overlapping carousels** (`Dashboard — Expanded`). The "related projects" row places two 353px cards in a 321px container, and the "current projects" and "tasks" rows cut cards mid-word. Replaced with a scroll-snap `Carousel` (fixed card width, visible peek, page dots).
2. **Mixed currency.** The wallet card shows "۲۵,۰۰۰,۰۰۰ **ریال**" next to "۲۴,۰۰۰,۰۰۰ **تومان**". All money now goes through `formatToman`.
3. **Mixed fonts.** Newer frames use **Inter**, the typography page says **Peyda**, and the text-style variables say **IRANYekanFN**. Code uses one stack: `Peyda → Vazirmatn` (Vazirmatn is the OFL fallback; drop licensed Peyda files into `public/fonts`).
4. **Placeholder copy shipped in final frames**: lorem ipsum, «فیچر اول…چهارم», «سوال سوم/چهارم», «زیرمتن برای سئو», six identical skill chips, and a duplicated landing section title. All replaced with real copy.
5. **Wrong hex labels on the Colors page.** Every color card shows template values (for example "Green · #637381"). The tokens here come from the actual variables.
6. **Hardcoded year.** The footer said ۱۴۰۴; it is now computed from the Jalali calendar.

### UX and accessibility
- **Disabled CTA contrast.** The Figma disabled pink (sampled from the frame) is about 2.4:1 and reads as "loading". It's now a neutral surface with a label explaining why it's disabled ("یکی از گزینه‌ها رو انتخاب کن").
- **Danger red.** `Intent/Danger/500` (#ff2829) is 4.39:1 on cards and fails AA for small text, so error text uses `Danger/450` (#ff4242, 4.8:1). Placeholder grey `#8f8f8f` is 5.1:1.
- **Icon-only 👍/👎 on freelancer requests** read as like/dislike and had no accessible name. They are now labelled «رد» / «پذیرش», reject has undo, and accept explains escrow before charging.
- **Bottom navigation** now has text labels and an animated active pill. It shows only on the four tab roots (as in Figma), so detail screens own their CTA.
- **OTP**: SMS autofill (`autocomplete="one-time-code"`), paste-to-fill, Persian-keyboard digits, auto-submit, a shake on error, a resend countdown and a masked number.
- **Password**: a live rule checklist and strength meter instead of four static coloured sentences that contradicted each other.
- **Real validation**: mobile (09…), کد ملی (mod-11 checksum), SHEBA (ISO 13616 mod-97) with live bank detection.
- **Create project**: one 2,000px form → 4 steps with progress, inline errors, an autosaved draft, a review step, a dynamic "what this budget buys" hint, day presets and a stepper.
- **Discovery**: free-text search, removable active-filter chips, a live "show N results" count, sort sheet, empty states, and bookmark with undo.
- **Workspace**: tasks toggle, add and delete (with undo), progress recomputed from tasks, a 21-day calendar strip, an escrow timeline, and a confirm dialog before ending a project.
- **Notifications**: grouped by day, unread dot plus weight instead of a coloured edge bar, and «مهم» only when true.
- **Settings / Personal info**: 7 frames → one list with inline edit and save. Logout asks for confirmation.
- Every icon-only button has an `aria-label`. Tabs are a real `tablist` with arrow keys (RTL-aware). Sheets and dialogs trap and restore focus and close on Esc. Focus rings are visible. Motion respects `prefers-reduced-motion` (`MotionConfig reducedMotion="user"`).

### Performance
- The Figma dot-grid texture is about 3,000 individual ellipses per frame; it's one CSS `radial-gradient` here (`.bg-dots`).
- Route-level code splitting plus vendor chunks: app code is about 23 KB gzip, each screen is 2–7 KB, and framework chunks are cached separately.

## Suggested follow-ups in Figma
- Collapse state frames (Empty / Edit / Modal) into component variants so the file matches the code.
- Fix the Colors page labels and bind the text styles to one family.
- Add a disabled-button token and replace `Danger/500` for text with `Danger/450`.
- Replace the remaining lorem ipsum on the Desktop [Beta] pages.
