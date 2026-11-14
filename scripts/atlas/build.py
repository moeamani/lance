"""
Lance atlas — journeys and user documents, drawn with the diagram-design skill.

Each page follows the skill's full-editorial layout (header, framed diagram, varied-width summary
cards, footer) and reuses the geometry of the skill's shipped examples (journey, tree, service
blueprint, state machine, quadrant). Colours and type come from the Lance profile in
.claude/skills/diagram-design/references/style-guide.md.

Run:  python3 scripts/atlas/build.py      → writes public/atlas/*.html
Then: python3 .claude/skills/diagram-design/scripts/self_check.py public/atlas/<file>.html
      python3 .claude/skills/diagram-design/scripts/verify_geometry.py public/atlas/<file>.html
"""
from __future__ import annotations

import html
import os
from dataclasses import dataclass, field

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'public', 'atlas')

# ── Lance profile (light skin) ────────────────────────────────────────────────
PAPER, PAPER2 = '#f1f2f4', '#e7e9ed'
INK, MUTED, SOFT = '#14161b', '#4a5060', '#565c68'
ACCENT, LINK = '#2f55e6', '#7d5810'
RULE = 'rgba(20,22,27,0.12)'
HAIR = 'rgba(20,22,27,0.10)'
ACCENT_TINT = 'rgba(47,85,230,0.08)'
ACCENT_HALF = 'rgba(47,85,230,0.50)'
INK05 = 'rgba(20,22,27,0.05)'
INK06 = 'rgba(20,22,27,0.06)'
SANS = "'Inter', system-ui, sans-serif"
MONO = "'Geist Mono', ui-monospace, monospace"
FONTS = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,650;1,400&family=Geist+Mono:wght@400;500&family=Vazirmatn:wght@400;600&display=swap'

e = html.escape


def fits(text: str, size: float, box: float, mono: bool = False, track: float = 0.0, pad: float = 8) -> None:
    """Skill width budget: 0.60em sans / 0.62em mono per character (+ tracking)."""
    per = (0.62 if mono else 0.60) + track
    need = len(text) * size * per + pad
    if need > box:
        raise SystemExit(f'Label too wide for its box ({need:.0f} > {box}): {text!r}')


def t(x, y, s, size=12, fill=INK, family=SANS, anchor='middle', weight=None, track=None, italic=False):
    w = f' font-weight="{weight}"' if weight else ''
    ls = f' letter-spacing="{track}em"' if track else ''
    it = ' font-style="italic"' if italic else ''
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="{family}" text-anchor="{anchor}"{w}{ls}{it}>{e(s)}</text>'


# ── Page shell (full editorial variant) ───────────────────────────────────────
@dataclass
class Card:
    title: str
    body: str
    dot: str = 'ink'  # ink | muted | coral
    eyebrow: str = ''


def page(slug: str, eyebrow: str, h1: str, sub_en: str, sub_fa: str, svgs: list[tuple[int, str]], cards: list[Card], foot: str, extra_html: str = '') -> str:
    blocks = ''.join(f'<div class="diagram-container"><svg viewBox="0 0 {w} {svg_h(svg)}" style="min-width:{w}px" {svg}</div>' for w, svg in svgs)
    card_html = ''.join(
        f'<div class="card">{f"<p class=eyebrow>{e(c.eyebrow)}</p>" if c.eyebrow else ""}<div class="card-header"><span class="card-dot {c.dot}"></span><h3>{e(c.title)}</h3></div><p>{c.body}</p></div>'
        for c in cards
    )
    cols = {1: '1fr', 2: '1.15fr 0.85fr', 3: '1.1fr 1fr 0.9fr', 4: '1.1fr 1fr 1fr 0.9fr'}[max(1, min(4, len(cards)))]
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{e(h1)} · Lance atlas</title>
  <link href="{FONTS}" rel="stylesheet">
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{ --paper:{PAPER}; --paper-2:{PAPER2}; --ink:{INK}; --muted:{MUTED}; --soft:{SOFT}; --rule:{RULE}; --accent:{ACCENT}; }}
    body {{ font-family: {SANS}; background: var(--paper); min-height: 100vh; padding: 3rem 2rem; color: var(--ink); -webkit-font-smoothing: antialiased; }}
    .container {{ max-width: 1280px; margin: 0 auto; }}
    .header {{ margin-bottom: 2.5rem; }}
    .eyebrow-top {{ font-family: {MONO}; font-size: 0.66rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem; }}
    .eyebrow-top a {{ color: inherit; }}
    h1 {{ font-size: clamp(1.75rem, 3vw + 1rem, 2.5rem); font-weight: 650; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.75rem; }}
    .subtitle {{ font-size: 1rem; line-height: 1.55; color: var(--muted); max-width: 64ch; }}
    .subtitle-fa {{ font-family: 'Vazirmatn', sans-serif; direction: rtl; text-align: right; font-size: 1rem; line-height: 1.9; color: var(--muted); max-width: 64ch; margin-top: 0.5rem; margin-left: auto; }}
    .diagram-container {{ background: var(--paper-2); border-radius: 8px; border: 1px solid var(--rule); padding: 1.5rem; overflow-x: auto; margin-bottom: 1rem; }}
    svg {{ width: 100%; display: block; }}
    .cards {{ display: grid; grid-template-columns: {cols}; gap: 1rem; margin-top: 1.5rem; }}
    @media (max-width: 900px) {{ .cards {{ grid-template-columns: 1fr; }} }}
    .card {{ background: #fff; border-radius: 6px; border: 1px solid var(--rule); padding: 1.25rem; }}
    .card .eyebrow {{ font-family: {MONO}; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem; }}
    .card-header {{ display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.875rem; padding-bottom: 0.875rem; border-bottom: 1px solid rgba(20,22,27,0.08); }}
    .card-dot {{ width: 7px; height: 7px; border-radius: 50%; flex: none; }}
    .card-dot.coral {{ background: var(--accent); }} .card-dot.ink {{ background: var(--ink); }} .card-dot.muted {{ background: var(--muted); }}
    .card h3 {{ font-size: 0.9rem; font-weight: 600; }}
    .card p, .card li {{ color: var(--muted); font-size: 0.85rem; line-height: 1.6; }}
    .card ul {{ padding-left: 1rem; }}
    .card b {{ color: var(--ink); font-weight: 600; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 1.5rem; background: #fff; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; }}
    th, td {{ text-align: left; padding: 0.6rem 0.9rem; border-bottom: 1px solid rgba(20,22,27,0.08); vertical-align: top; }}
    th {{ font-family: {MONO}; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 500; }}
    td code {{ font-family: {MONO}; font-size: 0.78rem; color: var(--soft); }}
    .footer {{ margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(20,22,27,0.10); font-family: {MONO}; font-size: 0.72rem; letter-spacing: 0.06em; color: var(--soft); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }}
    .footer a {{ color: inherit; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="eyebrow-top"><a href="index.html">Lance atlas</a> · {e(eyebrow)}</p>
      <h1>{e(h1)}</h1>
      <p class="subtitle">{sub_en}</p>
      <p class="subtitle-fa" lang="fa">{e(sub_fa)}</p>
    </div>
    {blocks}
    {extra_html}
    <div class="cards">{card_html}</div>
    <div class="footer"><span>{e(foot)}</span><span>diagram-design · Lance profile (pending your verification)</span></div>
  </div>
</body>
</html>
'''


def svg_h(svg: str) -> int:
    return int(svg.split('data-h="', 1)[1].split('"', 1)[0])


def svg_open(slug: str, h: int, title: str, desc: str) -> str:
    # The page() helper prepends `<svg viewBox=... style=...`; we add the rest here.
    return (
        f'data-h="{h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="{slug}-title {slug}-desc">'
        f'<title id="{slug}-title">{e(title)}</title><desc id="{slug}-desc">{e(desc)}</desc>'
        f'<defs><marker id="{slug}-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{MUTED}"/></marker>'
        f'<marker id="{slug}-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{ACCENT}"/></marker>'
        f'<marker id="{slug}-arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="{LINK}"/></marker></defs>'
        f'<rect width="100%" height="100%" fill="{PAPER}"/>'
    )


def legend(y: int, x0: int, x1: int, items: list[str]) -> str:
    out = [f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{HAIR}" stroke-width="0.8"/>', t(x0, y + 16, 'LEGEND', 8, MUTED, MONO, 'start', track=0.18)]
    out += items
    return ''.join(out)


# ── Journey (type-journey.md geometry) ────────────────────────────────────────
LEVEL_Y = {'HIGH': 100, 'MED-HIGH': 140, 'NEUTRAL': 180, 'MED-LOW': 220, 'LOW': 260}


@dataclass
class Journey:
    slug: str
    persona: str
    h1: str
    sub_en: str
    sub_fa: str
    stages: list[str]
    levels: list[str]
    actions: list[str]
    touch: list[str]
    helps: list[str]
    pains: list[str]
    cards: list[Card] = field(default_factory=list)


def journey_svg(j: Journey) -> str:
    assert len(j.stages) == 5 and len(j.levels) == 5 and len(j.pains) <= 2
    xs = [164 + i * 224 for i in range(5)]
    ys = [LEVEL_Y[l] for l in j.levels]
    trough = ys.index(max(ys))
    o = [svg_open(j.slug, 580, j.h1, f'User journey map for {j.persona} across five stages with a sentiment curve that dips at "{j.stages[trough]}".')]
    for i, (x, s) in enumerate(zip(xs, j.stages)):
        fits(s, 12, 200)
        o.append(t(x, 40, f'STAGE {i + 1}', 8, MUTED, MONO, track=0.14))
        o.append(t(x, 60, s, 12, INK, SANS, weight=600))
    used = [l for l in LEVEL_Y if l in j.levels]
    for l in used:
        y = LEVEL_Y[l]
        o.append(f'<line x1="64" y1="{y}" x2="1160" y2="{y}" stroke="{HAIR}" stroke-width="0.8"/>')
        o.append(t(56, y + 4, l, 8, MUTED, MONO, 'end', track=0.10))
    # sentiment curve: data curve (exempt from the orthogonal rule); trough's incoming segment is accent
    for i in range(4):
        c = ACCENT if i + 1 == trough else MUTED
        o.append(f'<polyline points="{xs[i]},{ys[i]} {xs[i + 1]},{ys[i + 1]}" fill="none" stroke="{c}" stroke-width="1.5" stroke-linejoin="round"/>')
    for i, (x, y) in enumerate(zip(xs, ys)):
        o.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{ACCENT if i == trough else MUTED}"/>')
    for y in (280, 376, 432):
        o.append(f'<line x1="64" y1="{y}" x2="1160" y2="{y}" stroke="{HAIR}" stroke-width="0.8"/>')
    o.append(t(56, 328, 'ACTIONS', 8, MUTED, MONO, 'end', track=0.14))
    o.append(t(56, 408, 'WHERE', 8, MUTED, MONO, 'end', track=0.14))
    o.append(t(56, 460, 'LANCE', 8, MUTED, MONO, 'end', track=0.14))
    for x, a, tp, h in zip(xs, j.actions, j.touch, j.helps):
        fits(a, 12, 200)
        fits(tp, 9, 200, mono=True)
        fits(h, 9, 200, mono=True)
        o.append(t(x, 300, a, 12))
        o.append(t(x, 412, tp, 9, MUTED, MONO))
        o.append(t(x, 464, h, 9, SOFT, MONO))
    for k, p in enumerate(j.pains):
        fits(p, 8, 184, mono=True, track=0.04)
        y = 312 + k * 20
        o.append(f'<rect x="{xs[trough] - 92}" y="{y}" width="184" height="16" rx="2" fill="{ACCENT_TINT}" stroke="{ACCENT_HALF}" stroke-width="0.8" stroke-dasharray="3,3"/>')
        o.append(t(xs[trough], y + 12, p, 8, ACCENT, MONO, track=0.04))
    o.append(
        legend(
            504,
            40,
            1160,
            [
                f'<line x1="40" y1="536" x2="56" y2="536" stroke="{MUTED}" stroke-width="1.5"/><circle cx="48" cy="536" r="3" fill="{MUTED}"/>',
                t(64, 540, 'Sentiment curve', 8.5, MUTED, SANS, 'start'),
                f'<line x1="220" y1="536" x2="236" y2="536" stroke="{ACCENT}" stroke-width="1.5"/><circle cx="228" cy="536" r="3" fill="{ACCENT}"/>',
                t(244, 540, 'Trough stage', 8.5, MUTED, SANS, 'start'),
                f'<rect x="384" y="532" width="16" height="8" rx="2" fill="{ACCENT_TINT}" stroke="{ACCENT_HALF}" stroke-width="0.8" stroke-dasharray="3,3"/>',
                t(408, 540, 'Pain marker', 8.5, MUTED, SANS, 'start'),
                t(560, 540, 'LANCE row: the feature or agent that carries this stage', 8.5, MUTED, SANS, 'start', italic=True),
            ],
        )
    )
    o.append('</svg>')
    return ''.join(o)


JOURNEYS = [
    Journey(
        'journey-starter',
        'a starter designer',
        'Starter: zero to first client',
        'Nazanin, 22, has studied UI design for a year and has never been paid for it. This map follows her first month on Lance, from landing on the portico to her first proposal.',
        'نازنین ۲۲ ساله‌ست، یه ساله طراحی رابط کاربری خونده و هنوز هیچ کار پولی نداشته. این نقشه ماه اولش در لنس رو دنبال می‌کنه؛ از ورود تا اولین پیشنهاد.',
        ['Discover', 'Learn', 'Make', 'Show', 'First job'],
        ['MED-HIGH', 'NEUTRAL', 'LOW', 'MED-HIGH', 'HIGH'],
        ['Picks “I’m just starting”', 'Starts the free UI path', 'Redesigns one real screen', 'Publishes to Showcase', 'Sends a first proposal'],
        ['/start', '/learn/first-client-ui', 'figma + lesson 4', '/showcase', '/work · herald draft'],
        ['onboarding cards', 'oath cards', 'guide cards', 'hall review queue', 'merlin price + herald'],
        ['NO FEEDBACK ON THE FIRST DRAFT', 'UNSURE WHAT GOOD LOOKS LIKE'],
        [
            Card('Make', 'The trough is the blank canvas: she builds alone and has no way to know if it is good. This is where starters quit, before they ever reach the Showcase.', 'coral', 'TROUGH'),
            Card('Opportunity', 'Add a <b>peer critique step</b> to the path: two short reviews from people one path ahead, before publishing. It also gives seasoned members a reason to come back.', 'ink'),
            Card('Measure', 'Share of path starters who publish a Showcase piece within 30 days, and share of those who send a proposal within 7 more.', 'muted'),
        ],
    ),
    Journey(
        'journey-freelancer',
        'a working freelancer',
        'Freelancer: from Job Radar to paid',
        'Kaveh, 31, is a front-end developer who checks five job sites every morning. This map follows one job from the Radar to the payout.',
        'کاوه ۳۱ ساله، برنامه‌نویس فرانت‌انده و هر صبح پنج سایت کاریابی رو چک می‌کنه. این نقشه یه کار رو از رادار تا دریافت پول دنبال می‌کنه.',
        ['Find', 'Tailor', 'Propose', 'Deliver', 'Get paid'],
        ['HIGH', 'NEUTRAL', 'MED-HIGH', 'MED-HIGH', 'LOW'],
        ['Opens one ranked list', 'Matches CV to the post', 'Edits the Herald’s draft', 'Ships the milestone', 'Waits for approval'],
        ['/work · 7 sources', '/plus/cv', 'herald run', 'files + chat', 'escrow · /hire/offers'],
        ['scout dedupes + ranks', 'smith tailors (plus)', 'herald drafts', 'sentinel checklist', 'escrow release'],
        ['CLIENT SILENT AFTER DELIVERY', 'NO DATE FOR THE PAYOUT'],
        [
            Card('Get paid', 'Everything before payment feels fast; the wait after delivery does not. Silence from the client is the moment trust in the platform is decided.', 'coral', 'TROUGH'),
            Card('Opportunity', 'Show a <b>release date</b> the moment work is delivered, and auto-release after 7 quiet days with the Sentinel’s checklist as evidence for both sides.', 'ink'),
            Card('Measure', 'Median hours from delivery to release; disputes opened per 100 milestones.', 'muted'),
        ],
    ),
    Journey(
        'journey-employer',
        'a small-business employer',
        'Employer: post to release',
        'Shirin, 38, runs two cafés and needs a booking site. She has never hired a freelancer. This map follows her first project.',
        'شیرین ۳۸ ساله، دو تا کافه داره و یه سایت رزرو لازم داره. تا حالا فریلنسر استخدام نکرده. این نقشه اولین پروژه‌ش رو دنبال می‌کنه.',
        ['Describe', 'Price', 'Choose', 'Fund', 'Approve'],
        ['NEUTRAL', 'MED-HIGH', 'LOW', 'NEUTRAL', 'HIGH'],
        ['Posts in four steps', 'Reads Merlin’s range', 'Compares proposals', 'Pays into escrow', 'Releases the payment'],
        ['/hire/new', 'step III · merlin', 'proposals inbox', 'checkout', 'sentinel report'],
        ['autosaved draft', 'range + reasons', 'side-by-side view', 'escrow hold', 'sentinel checklist'],
        ['18 PROPOSALS, NO WAY TO COMPARE', 'CAN’T TELL STARTER FROM SENIOR'],
        [
            Card('Choose', 'Merlin gives her confidence about money, then the proposals arrive and she is back to guessing. Comparison, not price, is her real problem.', 'coral', 'TROUGH'),
            Card('Opportunity', 'A <b>compare view</b>: price against Merlin’s range, level, delivery time and one relevant Showcase piece per proposal, in one table.', 'ink'),
            Card('Measure', 'Time from first proposal to hire; share of projects hired within 72 hours of posting.', 'muted'),
        ],
    ),
    Journey(
        'journey-agents',
        'a solo founder using agents',
        'Agent user: brief to shipped',
        'Kian, 27, is building a product alone. He uses the Round Table to write, plan and check work he cannot afford to hire for yet.',
        'کیان ۲۷ ساله، داره تنهایی یه محصول می‌سازه. از میزگرد استفاده می‌کنه تا کارهای نوشتن، برنامه‌ریزی و بررسی رو که هنوز پول استخدامش رو نداره انجام بده.',
        ['Pick a knight', 'Brief it', 'Watch the run', 'Review', 'Ship'],
        ['MED-HIGH', 'NEUTRAL', 'MED-HIGH', 'MED-LOW', 'HIGH'],
        ['Chooses the Scribe', 'Gives topic and tone', 'Sees each step live', 'Edits the draft', 'Publishes the post'],
        ['/agents', '/agents/scribe', 'agent run panel', 'review gate', 'his own blog'],
        ['one job per knight', 'inputs named up front', 'plan shown first', 'nothing sent alone', 'claims flagged'],
        ['DRAFT SOUNDS GENERIC', 'NO DIFF OF WHAT CHANGED'],
        [
            Card('Review', 'The run feels trustworthy because it is visible; the output still needs heavy editing, and he cannot see what the agent changed between versions.', 'coral', 'TROUGH'),
            Card('Opportunity', 'Feed the agent <b>three samples of his own writing</b> as a voice reference, and show edits as a diff between runs.', 'ink'),
            Card('Measure', 'Share of agent drafts shipped with under 20% of words changed; repeat runs per user per week.', 'muted'),
        ],
    ),
    Journey(
        'journey-teacher',
        'a working designer who teaches',
        'Teacher: course to first sale',
        'Mina, 41, is a motion designer with 12 years of client work. She wants a second income from what she already knows.',
        'مینا ۴۱ ساله، طراح موشنه و ۱۲ سال سابقه‌ی کار با کارفرما داره. می‌خواد از چیزی که بلده یه درآمد دوم بسازه.',
        ['Outline', 'Record', 'Price', 'Review', 'First sale'],
        ['MED-HIGH', 'LOW', 'NEUTRAL', 'NEUTRAL', 'HIGH'],
        ['Writes the outcome', 'Films lesson one', 'Sets price and fee', 'Waits three days', 'Sees a buyer'],
        ['/learn/teach · step I', 'her own studio', 'step IV · 20% fee', 'review queue', 'showcase cross-link'],
        ['verb-first prompt', '8–15 min guidance', 'net shown per sale', 'checklist in email', 'hall feature'],
        ['RECORDING TAKES 3X LONGER', 'NO SCRIPT TEMPLATE'],
        [
            Card('Record', 'Planning is easy for an expert; recording is not. The gap between knowing and filming is where most course drafts stall.', 'coral', 'TROUGH'),
            Card('Opportunity', 'A <b>script template</b> per lesson and the Scribe turning her outline into talking points she can read from.', 'ink'),
            Card('Measure', 'Share of saved course drafts with a first lesson uploaded within 14 days.', 'muted'),
        ],
    ),
]


# ── Sitemap (type-tree.md geometry) ───────────────────────────────────────────
def node(x, y, w, h, name, sub='', tag='', kind='branch'):
    if kind == 'focal':
        fill, stroke, sw, tagc, tags = ACCENT_TINT, ACCENT, 1, ACCENT, ACCENT_HALF
    elif kind == 'leaf':
        fill, stroke, sw, tagc, tags = INK05, MUTED, 0.8, MUTED, 'rgba(74,80,96,0.50)'
    elif kind == 'optional':
        fill, stroke, sw, tagc, tags = 'rgba(20,22,27,0.02)', 'rgba(20,22,27,0.30)', 1, MUTED, 'rgba(74,80,96,0.50)'
    else:
        fill, stroke, sw, tagc, tags = '#ffffff', INK, 1, INK, 'rgba(20,22,27,0.40)'
    fits(name, 12, w)
    if sub:
        fits(sub, 9, w, mono=True)
    dash = ' stroke-dasharray="4,3"' if kind == 'optional' else ''
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{PAPER}"/>', f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{dash}/>']
    cx = x + w // 2
    if tag:
        tw = max(28, len(tag) * 5 + 12)
        o.append(f'<rect x="{x + 8}" y="{y + 8}" width="{tw}" height="12" rx="2" fill="transparent" stroke="{tags}" stroke-width="0.8"/>')
        o.append(t(x + 8 + tw / 2, y + 17, tag, 7, tagc, MONO, track=0.08))
        o.append(t(cx, y + h - 22 if sub else y + h - 14, name, 12, INK, SANS, weight=600))
        if sub:
            o.append(t(cx, y + h - 9, sub, 9, MUTED, MONO))
    else:
        o.append(t(cx, y + (h // 2) + (-2 if sub else 4), name, 12, INK, SANS, weight=600))
        if sub:
            o.append(t(cx, y + (h // 2) + 12, sub, 9, MUTED, MONO))
    return ''.join(o)


def p(d, accent=False, dashed=False):
    return f'<path d="{d}" fill="none" stroke="{ACCENT if accent else MUTED}" stroke-width="1"{" stroke-dasharray=\"5,4\"" if dashed else ""}/>'


def sitemap_svgs() -> list[tuple[int, str]]:
    # Overview: Home → five intents (6 nodes).
    a = [svg_open('sitemap', 440, 'Lance sitemap: five doors', 'Tree showing the Lance home page branching into its five primary sections: Work, Hire, Agents, Learn and Showcase, with the URLs of each.')]
    a.append(t(40, 108, 'TIER 0 · HOME', 8, MUTED, MONO, 'start', track=0.18))
    a.append(t(40, 228, 'TIER 1 · INTENTS', 8, MUTED, MONO, 'start', track=0.18))
    xs = [40, 280, 520, 760, 1000]  # 200 wide, 40 gap → ends at 1200
    cxs = [x + 100 for x in xs]
    a.append(p('M 620 128 L 620 172'))
    a.append(p(f'M {cxs[0]} 172 L {cxs[-1]} 172'))
    for cx in cxs:
        a.append(p(f'M {cx} 172 L {cx} 208'))
    a.append(node(520, 72, 200, 56, 'Home', '/en · /fa', 'ROOT', 'focal'))
    tier = [
        ('Work', '/work · /work/[id]'),
        ('Hire', '/hire · /new · /offers/[slug]'),
        ('Agents', '/agents · /agents/[slug]'),
        ('Learn', '/learn · /[slug] · /teach'),
        ('Showcase', '/showcase · /[slug]'),
    ]
    for x, (n, s) in zip(xs, tier):
        a.append(node(x, 208, 200, 64, n, s, 'HUB'))
    a.append(
        legend(
            340,
            40,
            1200,
            [
                f'<rect x="40" y="372" width="14" height="10" rx="2" fill="{ACCENT_TINT}" stroke="{ACCENT}" stroke-width="1"/>',
                t(60, 380, 'Home · focal', 8.5, MUTED, SANS, 'start'),
                f'<rect x="180" y="372" width="14" height="10" rx="2" fill="#ffffff" stroke="{INK}" stroke-width="1"/>',
                t(200, 380, 'Intent hub (primary nav)', 8.5, MUTED, SANS, 'start'),
                t(400, 380, 'Every top task is three clicks or fewer from Home.', 8.5, MUTED, SANS, 'start', italic=True),
            ],
        )
    )
    a.append('</svg>')

    # Outside the main nav (7 nodes).
    b = [svg_open('sitemap-utility', 460, 'Pages outside the main navigation', 'Tree showing the pages reached from the header, footer and upsell slots rather than the five primary sections: Plus with its CV tailor and Auto-scrum, Start, Brand and Docs.')]
    b.append(t(40, 108, 'ENTRY', 8, MUTED, MONO, 'start', track=0.18))
    b.append(t(40, 228, 'TIER 1', 8, MUTED, MONO, 'start', track=0.18))
    b.append(t(40, 348, 'TIER 2', 8, MUTED, MONO, 'start', track=0.18))
    xs2 = [160, 400, 640, 880]
    c2 = [x + 100 for x in xs2]
    b.append(p('M 620 128 L 620 172'))
    b.append(p(f'M {c2[0]} 172 L {c2[-1]} 172'))
    for cx in c2:
        b.append(p(f'M {cx} 172 L {cx} 208'))
    b.append(p(f'M {c2[0]} 272 L {c2[0]} 292 L 140 292 L 140 328'))
    b.append(p(f'M {c2[0]} 292 L 380 292 L 380 328'))
    b.append(node(500, 72, 240, 56, 'Header, footer, upsells', 'not in the primary nav', 'ENTRY', 'optional'))
    for x, (n, s, tag) in zip(xs2, [('Plus', '/plus', 'PAID'), ('Start', '/start · onboarding', 'CTA'), ('Brand', '/brand · footer', 'FOOT'), ('Journeys & docs', '/docs · footer', 'FOOT')]):
        b.append(node(x, 208, 200, 64, n, s, tag, 'focal' if n == 'Plus' else 'branch'))
    b.append(node(40, 328, 200, 52, 'CV tailor', '/plus/cv · the smith', '', 'leaf'))
    b.append(node(280, 328, 200, 52, 'Auto-scrum', '/plus/scrum · steward', '', 'leaf'))
    b.append(
        legend(
            404,
            40,
            1200,
            [
                f'<rect x="40" y="432" width="14" height="10" rx="2" fill="rgba(20,22,27,0.02)" stroke="rgba(20,22,27,0.30)" stroke-width="1" stroke-dasharray="4,3"/>',
                t(60, 440, 'Entry points (not a page)', 8.5, MUTED, SANS, 'start'),
                f'<rect x="240" y="432" width="14" height="10" rx="2" fill="{ACCENT_TINT}" stroke="{ACCENT}" stroke-width="1"/>',
                t(260, 440, 'Plus · focal', 8.5, MUTED, SANS, 'start'),
                f'<rect x="380" y="432" width="14" height="10" rx="2" fill="{INK05}" stroke="{MUTED}" stroke-width="0.8"/>',
                t(400, 440, 'Leaf page', 8.5, MUTED, SANS, 'start'),
            ],
        )
    )
    b.append('</svg>')
    return [(1240, ''.join(a)), (1240, ''.join(b))]


SITEMAP_TABLE = '''<table><thead><tr><th>Page</th><th>URL (prefixed /en or /fa)</th><th>Reached from</th></tr></thead><tbody>
<tr><td>Job Radar</td><td><code>/work</code></td><td>Primary nav, home portico, Scout</td></tr>
<tr><td>Job detail</td><td><code>/work/[id]</code></td><td>Radar list, home preview</td></tr>
<tr><td>Hire hub</td><td><code>/hire</code></td><td>Primary nav, portico</td></tr>
<tr><td>Post a project (4 steps)</td><td><code>/hire/new</code></td><td>Hire hub, footer, Start (hire path)</td></tr>
<tr><td>Offer (incl. Agentic PMO)</td><td><code>/hire/offers/[slug]</code></td><td>Hire hub, Auto-scrum, footer</td></tr>
<tr><td>The Round Table</td><td><code>/agents</code></td><td>Primary nav, portico, home</td></tr>
<tr><td>Agent (Merlin price check)</td><td><code>/agents/[slug]</code> · alias <code>/merlin</code></td><td>Round Table, footer, step III of posting</td></tr>
<tr><td>Learn hub</td><td><code>/learn</code></td><td>Primary nav, portico, Start (learn path)</td></tr>
<tr><td>Course or path</td><td><code>/learn/[slug]</code></td><td>Learn hub</td></tr>
<tr><td>Teach (4 steps)</td><td><code>/learn/teach</code></td><td>Learn hub, footer</td></tr>
<tr><td>Showcase and the Hall</td><td><code>/showcase</code>, <code>/showcase/[slug]</code></td><td>Primary nav, portico, home</td></tr>
<tr><td>Lance Plus</td><td><code>/plus</code>, <code>/plus/cv</code>, <code>/plus/scrum</code></td><td>Header (gilt), job detail, home band</td></tr>
<tr><td>Start, Sign in</td><td><code>/start</code>, <code>/sign-in</code></td><td>Header CTA, empty states</td></tr>
<tr><td>Brand, Journeys &amp; docs</td><td><code>/brand</code>, <code>/docs</code></td><td>Footer</td></tr>
</tbody></table>'''


# ── Service blueprint: Agentic PMO (type-service-blueprint.md geometry) ───────
def blueprint_svg() -> str:
    stages = [('brief', 'Brief'), ('plan', 'Plan'), ('sprint', 'Sprint'), ('review', 'Weekly review'), ('release', 'Release')]
    xs = [96 + i * 224 for i in range(5)]
    layers = {
        'customer': ('CUSTOMER', 128, 64, ['Shares brief and team', 'Approves the plan', 'Reads the 9:30 summary', 'Joins the PM call', 'Approves the release']),
        'frontstage': ('FRONTSTAGE', 200, 64, ['Intake in four steps', 'Backlog board', 'Summary in chat', 'Report and call', 'Release checklist']),
        'backstage': ('BACKSTAGE', 272, 64, ['Steward parses brief', 'Steward writes stories', 'Burndown risk check', 'PM edits agent output', 'Sentinel checks vs brief']),
        'support': ('SUPPORT', 344, 48, ['Merlin price check', 'PM roster', 'Chat and calendar', 'Call notes archive', 'Escrow ledger']),
    }
    sub = {('backstage', 2): 'steward · daily 09:00', ('backstage', 4): 'sentinel · per milestone'}
    o = [svg_open('blueprint-pmo', 520, 'Agentic PMO: what the client never sees', 'Service blueprint of the Agentic PMO offer across five stages, with client and frontstage actions above the line of visibility and the agents and project manager below it; the focal cell is the daily burndown risk check.')]
    o.append(f'<rect x="96" y="272" width="1104" height="120" fill="rgba(20,22,27,0.03)"/>')
    for i, (sid, name) in enumerate(stages):
        o.append(f'<rect x="{xs[i]}" y="24" width="208" height="48" fill="none" data-stage="{sid}"/>')
        o.append(t(xs[i] + 104, 40, f'STAGE {i + 1}', 8, MUTED, MONO, track=0.14))
        o.append(t(xs[i] + 104, 60, name, 12, INK, SANS, weight=600))
    o.append(f'<line x1="96" y1="196" x2="1200" y2="196" stroke="rgba(20,22,27,0.18)" stroke-width="1" data-role="interaction"/>')
    o.append(f'<line x1="96" y1="268" x2="1200" y2="268" stroke="rgba(20,22,27,0.55)" stroke-width="2" data-role="visibility"/>')
    o.append(f'<line x1="96" y1="340" x2="1200" y2="340" stroke="rgba(20,22,27,0.18)" stroke-width="1" data-role="internal-interaction"/>')
    for layer, (label, y, h, cells) in layers.items():
        o.append(f'<g data-layer="{layer}">')
        o.append(t(88, y + h // 2 + 3, label, 8, MUTED, MONO, 'end', track=0.12))
        for i, cell in enumerate(cells):
            fits(cell, 12, 208)
            focal = layer == 'backstage' and i == 2
            hidden = layer in ('backstage', 'support')
            fill = 'rgba(47,85,230,0.12)' if focal else (INK06 if hidden else '#ffffff')
            stroke = ACCENT if focal else (MUTED if hidden else INK)
            if not hidden:
                o.append(f'<rect x="{xs[i]}" y="{y}" width="208" height="{h}" rx="4" fill="#ffffff"/>')
            o.append(f'<rect x="{xs[i]}" y="{y}" width="208" height="{h}" rx="4" fill="{fill}" stroke="{stroke}" stroke-width="1" data-stage="{stages[i][0]}" data-name="{e(cell)}"{" data-focal=\"true\"" if focal else ""}/>')
            s = sub.get((layer, i))
            if s:
                o.append(t(xs[i] + 104, y + 28, cell, 12, ACCENT if focal else INK, SANS, weight=600 if focal else None))
                o.append(t(xs[i] + 104, y + 46, s, 8, MUTED, MONO))
            else:
                o.append(t(xs[i] + 104, y + h // 2 + 4, cell, 12, INK))
        o.append('</g>')
    o.append(
        legend(
            440,
            96,
            1200,
            [
                f'<line x1="96" y1="481" x2="124" y2="481" stroke="rgba(20,22,27,0.55)" stroke-width="2"/>',
                t(132, 486, 'Line of visibility', 8.5, MUTED, SANS, 'start'),
                f'<rect x="280" y="476" width="16" height="10" rx="2" fill="{INK06}" stroke="{MUTED}" stroke-width="1"/>',
                t(304, 486, 'Backstage: agents and the PM', 8.5, MUTED, SANS, 'start'),
                f'<rect x="480" y="476" width="16" height="10" rx="2" fill="rgba(47,85,230,0.12)" stroke="{ACCENT}" stroke-width="1"/>',
                t(504, 486, 'Focal cell · risk check', 8.5, MUTED, SANS, 'start'),
            ],
        )
    )
    o.append('</svg>')
    return ''.join(o)


# ── State machine: project and escrow lifecycle (type-state.md) ───────────────
def state_svg() -> str:
    slug = 'state-project'
    o = [svg_open(slug, 560, 'Project and escrow lifecycle', 'State machine of a Lance project from Posted through Matched, Funded, In progress and In review to Released, with revision, dispute, and refund paths.')]
    W, H, G = 128, 80, 54
    xs = [88 + i * (W + G) for i in range(6)]  # 88 … 998; last ends at 1126
    cx = [x + W // 2 for x in xs]
    cy = 200
    top, bot = cy - H // 2, cy + H // 2
    low_y = 340  # exception row
    low_mid = low_y + H // 2
    names = [('Posted', 'brief public'), ('Matched', 'freelancer chosen'), ('Funded', 'money in escrow'), ('In progress', 'tasks running'), ('In review', 'sentinel checks'), ('Released', 'paid out')]
    labels = ['CHOOSE', 'FUND', 'START', 'DELIVER', 'APPROVE']
    arrow = f'url(#{slug}-arrow)'
    arrow_a = f'url(#{slug}-arrow-accent)'
    disp_x, ref_x = xs[4], 600  # Disputed under In review; Refunded between Funded and In review

    # transitions first, so state boxes sit on top
    o.append(f'<line x1="46" y1="{cy}" x2="{xs[0]}" y2="{cy}" stroke="{MUTED}" stroke-width="1.2" marker-end="{arrow}"/>')
    for i in range(5):
        accent = i == 4
        o.append(f'<line x1="{xs[i] + W}" y1="{cy}" x2="{xs[i + 1]}" y2="{cy}" stroke="{ACCENT if accent else MUTED}" stroke-width="{1.4 if accent else 1.2}" marker-end="{arrow_a if accent else arrow}"/>')
    o.append(f'<line x1="{xs[5] + W}" y1="{cy}" x2="1166" y2="{cy}" stroke="{MUTED}" stroke-width="1.2" marker-end="{arrow}"/>')
    # revise: In review back to In progress, arched above
    a, b = cx[4] - 24, cx[3] + 24
    o.append(f'<path d="M {a} {top} C {a} 104, {b} 104, {b} {top}" fill="none" stroke="{MUTED}" stroke-width="1.2" stroke-dasharray="5,4" marker-end="{arrow}"/>')
    # dispute: In review down to Disputed
    o.append(f'<line x1="{cx[4]}" y1="{bot}" x2="{cx[4]}" y2="{low_y}" stroke="{MUTED}" stroke-width="1.2" marker-end="{arrow}"/>')
    # ruling pay: Disputed right, then up into Released (r=8 elbow)
    o.append(f'<path d="M {disp_x + W} {low_mid} L {cx[5] - 8} {low_mid} Q {cx[5]} {low_mid} {cx[5]} {low_mid - 8} L {cx[5]} {bot}" fill="none" stroke="{MUTED}" stroke-width="1.2" marker-end="{arrow}"/>')
    # ruling refund: Disputed left into Refunded
    o.append(f'<line x1="{disp_x}" y1="{low_mid}" x2="{ref_x + W}" y2="{low_mid}" stroke="{MUTED}" stroke-width="1.2" marker-end="{arrow}"/>')
    # cancel: Funded down, then right into Refunded (r=8 elbow)
    o.append(f'<path d="M {cx[2]} {bot} L {cx[2]} {low_mid - 8} Q {cx[2]} {low_mid} {cx[2] + 8} {low_mid} L {ref_x} {low_mid}" fill="none" stroke="{MUTED}" stroke-width="1.2" stroke-dasharray="5,4" marker-end="{arrow}"/>')

    # labels: masked, 6–10px off their stroke
    def lab(x, y, w, s, color=SOFT):
        fits(s, 8, w, mono=True, track=0.08, pad=6)
        return f'<rect x="{x - w / 2}" y="{y - 9}" width="{w}" height="12" rx="2" fill="{PAPER}"/>' + t(x, y, s, 8, color, MONO, track=0.08)

    for i, s in enumerate(labels):
        mid = xs[i] + W + G / 2
        o.append(lab(mid, cy - 10, G - 6, s))
    o.append(lab((a + b) / 2, 106, 52, 'REVISE'))
    o.append(lab(cx[4] + 34, 294, 52, 'DISPUTE'))
    o.append(lab(cx[5] + 40, 312, 64, 'RULE: PAY'))
    o.append(lab((disp_x + ref_x + W) / 2, low_mid - 10, 48, 'REFUND'))
    o.append(lab(cx[2] - 34, 312, 52, 'CANCEL'))

    def state(x, y, name, sub, kind='normal'):
        fill, stroke, tagc, tags = '#ffffff', INK, INK, 'rgba(20,22,27,0.40)'
        if kind == 'focal':
            fill, stroke, tagc, tags = ACCENT_TINT, ACCENT, ACCENT, ACCENT_HALF
        elif kind == 'muted':
            fill, stroke, tagc, tags = INK05, MUTED, MUTED, 'rgba(74,80,96,0.50)'
        fits(name, 13, W)
        fits(sub, 9, W, mono=True)
        return ''.join(
            [
                f'<rect x="{x}" y="{y}" width="{W}" height="{H}" rx="8" fill="{PAPER}"/>',
                f'<rect x="{x}" y="{y}" width="{W}" height="{H}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="1"/>',
                f'<rect x="{x + 8}" y="{y + 8}" width="40" height="12" rx="2" fill="transparent" stroke="{tags}" stroke-width="0.8"/>',
                t(x + 28, y + 17, 'STATE', 7, tagc, MONO, track=0.08),
                t(x + W / 2, y + 48, name, 13, INK, SANS, weight=600),
                t(x + W / 2, y + 64, sub, 9, MUTED, MONO),
            ]
        )

    o.append(f'<circle cx="40" cy="{cy}" r="6" fill="{INK}"/>')
    for i, (n, s) in enumerate(names):
        o.append(state(xs[i], top, n, s, 'focal' if n == 'Released' else 'normal'))
    o.append(state(disp_x, low_y, 'Disputed', 'lance arbitrates', 'muted'))
    o.append(state(ref_x, low_y, 'Refunded', 'money returned', 'muted'))
    o.append(f'<circle cx="1176" cy="{cy}" r="8" fill="none" stroke="{INK}" stroke-width="1"/><circle cx="1176" cy="{cy}" r="5" fill="{INK}"/>')
    o.append(
        legend(
            464,
            40,
            1200,
            [
                f'<rect x="40" y="496" width="14" height="10" rx="2" fill="{ACCENT_TINT}" stroke="{ACCENT}" stroke-width="1"/>',
                t(60, 504, 'Happy completion · focal', 8.5, MUTED, SANS, 'start'),
                f'<rect x="220" y="496" width="14" height="10" rx="2" fill="{INK05}" stroke="{MUTED}" stroke-width="1"/>',
                t(240, 504, 'Exception state', 8.5, MUTED, SANS, 'start'),
                f'<line x1="360" y1="501" x2="384" y2="501" stroke="{MUTED}" stroke-width="1.2" stroke-dasharray="5,4"/>',
                t(392, 504, 'Optional or return path', 8.5, MUTED, SANS, 'start'),
                t(560, 504, 'Money never moves without an event: escrow holds it from Funded to a release or a refund.', 8.5, MUTED, SANS, 'start', italic=True),
            ],
        )
    )
    o.append('</svg>')
    return ''.join(o)


# ── Personas: quadrant (type-quadrant.md) + persona cards ─────────────────────
def personas_svg() -> str:
    slug = 'personas'
    o = [svg_open(slug, 560, 'Who Lance is for', 'Quadrant positioning five Lance personas by experience and by whether they mainly earn or spend on the platform; the starter is the primary persona.')]
    cx, cy = 600, 240
    o.append(f'<line x1="200" y1="{cy}" x2="1000" y2="{cy}" stroke="{INK}" stroke-width="1" marker-end="url(#{slug}-arrow)"/>')
    o.append(f'<line x1="{cx}" y1="440" x2="{cx}" y2="56" stroke="{INK}" stroke-width="1" marker-end="url(#{slug}-arrow)"/>')
    o.append(t(1016, cy + 3, 'SEASONED', 9, INK, MONO, 'start', track=0.18))
    o.append(t(184, cy + 3, 'NEW', 9, INK, MONO, 'end', track=0.18))
    o.append(t(cx, 44, 'EARNING', 9, INK, MONO, track=0.18))
    o.append(t(cx, 460, 'SPENDING', 9, INK, MONO, track=0.18))
    pts = [
        ('Starter · Nazanin', 300, 120, True),
        ('Freelancer · Kaveh', 820, 132, False),
        ('Teacher · Mina', 900, 88, False),
        ('Agent user · Kian', 452, 312, False),
        ('Employer · Shirin', 712, 372, False),
    ]
    for name, x, y, focal in pts:
        c = ACCENT if focal else INK
        o.append(f'<circle cx="{x}" cy="{y}" r="{5 if focal else 4}" fill="{c}"/>')
        o.append(t(x + 12, y + 4, name, 11, c, SANS, 'start', weight=600 if focal else 500))
    o.append(
        legend(
            488,
            40,
            1200,
            [
                f'<circle cx="47" cy="524" r="5" fill="{ACCENT}"/>',
                t(60, 528, 'Primary persona: the design must satisfy her first', 8.5, MUTED, SANS, 'start'),
                f'<circle cx="367" cy="524" r="4" fill="{INK}"/>',
                t(380, 528, 'Secondary persona', 8.5, MUTED, SANS, 'start'),
                t(520, 528, 'Positions come from the brief and market conventions; validate with interviews before launch.', 8.5, MUTED, SANS, 'start', italic=True),
            ],
        )
    )
    o.append('</svg>')
    return ''.join(o)


PERSONA_CARDS = [
    Card(
        'Nazanin, 22 · Starter',
        '“I can design. I just don’t know how anyone gets their first client.”<br><br><b>Job to be done:</b> When I finish learning a skill, I want one real piece of work and one fair first job, so I can call myself a freelancer.<br><br><b>Frustrations:</b> no feedback, no portfolio, every job asks for experience.<br><br><b>Design implication:</b> free paths that end in a Showcase piece; Merlin so she doesn’t underprice.',
        'coral',
        'PRIMARY',
    ),
    Card(
        'Kaveh, 31 · Freelancer',
        '“I lose an hour every morning checking five job sites.”<br><br><b>Job to be done:</b> When good jobs appear anywhere, I want to see only the ones that fit, so I can spend my time on proposals that win.<br><br><b>Design implication:</b> Job Radar with dedupe and fit, Smith and Herald for the paperwork.',
        'ink',
    ),
    Card(
        'Shirin, 38 · Employer',
        '“I don’t know what a website should cost, or who to trust.”<br><br><b>Job to be done:</b> When I need something built, I want a fair price and a safe way to pay, so I can hire without being taken advantage of.<br><br><b>Design implication:</b> Merlin with reasons, escrow, the Agentic PMO if she can’t manage it herself.',
        'ink',
    ),
    Card(
        'Kian, 27 · Agent user · and Mina, 41 · Teacher',
        '<b>Kian:</b> When routine work piles up, I want an agent I can watch and correct, so I can ship without hiring yet.<br><br><b>Mina:</b> When I know a craft deeply, I want to package it into a course quickly, so I can earn while I sleep without becoming a full-time creator.',
        'muted',
    ),
]


# ── Index ─────────────────────────────────────────────────────────────────────
INDEX = [
    ('personas', 'User document', 'Who Lance is for', 'Five personas, their jobs-to-be-done, and the primary persona.'),
    ('sitemap', 'Information architecture', 'Sitemap', 'Five intent hubs, the pages behind them, and the pages outside the nav.'),
    ('journey-starter', 'User journey', 'Starter: zero to first client', 'Trough: making the first piece alone.'),
    ('journey-freelancer', 'User journey', 'Freelancer: from Job Radar to paid', 'Trough: waiting for approval after delivery.'),
    ('journey-employer', 'User journey', 'Employer: post to release', 'Trough: comparing proposals.'),
    ('journey-agents', 'User journey', 'Agent user: brief to shipped', 'Trough: reviewing a generic draft.'),
    ('journey-teacher', 'User journey', 'Teacher: course to first sale', 'Trough: recording the first lesson.'),
    ('blueprint-pmo', 'Service blueprint', 'Agentic PMO', 'What the client sees, and the agents and PM behind the line.'),
    ('state-project', 'State machine', 'Project and escrow lifecycle', 'Every state money and work can be in.'),
]


def index_html() -> str:
    rows = ''.join(f'<a class="item" href="{s}.html"><span class="kind">{e(k)}</span><span class="name">{e(n)}</span><span class="line">{e(l)}</span></a>' for s, k, n, l in INDEX)
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lance atlas: journeys and user documents</title>
<link href="{FONTS}" rel="stylesheet">
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:{SANS};background:{PAPER};color:{INK};padding:3rem 2rem;-webkit-font-smoothing:antialiased}}
.c{{max-width:1080px;margin:0 auto}}
.eb{{font-family:{MONO};font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:{MUTED};margin-bottom:.75rem}}
h1{{font-size:clamp(1.75rem,3vw + 1rem,2.5rem);font-weight:650;letter-spacing:-.03em;line-height:1.1}}
p.s{{color:{MUTED};max-width:64ch;margin-top:.75rem;line-height:1.55}}
p.fa{{font-family:'Vazirmatn',sans-serif;direction:rtl;text-align:right;color:{MUTED};line-height:1.9;margin-top:.5rem}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;margin-top:2.5rem}}
.item{{display:flex;flex-direction:column;gap:.35rem;background:#fff;border:1px solid {RULE};border-radius:6px;padding:1.25rem;color:inherit;text-decoration:none;transition:border-color .15s}}
.item:hover{{border-color:{MUTED}}}
.item:focus-visible{{outline:none;box-shadow:0 0 0 2px {PAPER},0 0 0 4px {ACCENT}}}
.kind{{font-family:{MONO};font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:{MUTED}}}
.name{{font-weight:600}}
.line{{font-size:.85rem;color:{MUTED};line-height:1.5}}
.note{{margin-top:2.5rem;padding:1rem 1.25rem;border:1px dashed {ACCENT_HALF};border-radius:6px;background:{ACCENT_TINT};font-size:.85rem;color:{INK};line-height:1.6}}
.f{{margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(20,22,27,.10);font-family:{MONO};font-size:.72rem;color:{SOFT}}}
</style></head>
<body><div class="c">
<p class="eb">Lance · Journeys and user documents</p>
<h1>The Lance atlas</h1>
<p class="s">How Lance is structured, who it serves, and how each of them moves through it. Drawn with the diagram-design skill in the Lance profile. The written IA (<code>docs/information-architecture.md</code>) and design plan (<code>docs/design-plan.md</code>) live in the repository.</p>
<p class="fa" lang="fa">لنس چطور چیده شده، برای کیه و هر کدوم از کاربرها چطور ازش عبور می‌کنن. با مهارت diagram-design و در پروفایل برند لنس کشیده شده.</p>
<div class="grid">{rows}</div>
<div class="note"><b>Pending your verification.</b> The diagram skin was onboarded from the site’s own tokens (method c of the skill). Two stated deviations from the skill’s defaults: cool marble paper instead of warm (the brand forbids cream), and Inter titles instead of Instrument Serif (the brief fixes Inter for English). Personas are proto-personas from the brief and market conventions, not interview data; validate them before launch.</div>
<p class="f">diagram-design · Lance profile</p>
</div></body></html>
'''


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    files = {}
    for j in JOURNEYS:
        files[j.slug] = page(j.slug, 'User journey', j.h1, e(j.sub_en), j.sub_fa, [(1200, journey_svg(j))], j.cards, f'{j.h1.lower()} · user journey map')
    files['sitemap'] = page(
        'sitemap',
        'Information architecture',
        'Sitemap: five doors',
        'Lance is organised by <b>intent</b>, not by content type: five hubs in the primary navigation, and a handful of pages reached from the header, footer and upsell slots. Full detail in <code>docs/information-architecture.md</code>.',
        'لنس بر اساس «هدف کاربر» چیده شده، نه نوع محتوا: پنج بخش اصلی در منو و چند صفحه که از سربرگ، پابرگ و پیشنهادها در دسترسن.',
        sitemap_svgs(),
        [
            Card('Why five', 'Hick’s law and the IA skill both cap primary navigation at 5–7 items. Five intents cover every top task in three clicks or fewer.', 'coral', 'DECISION'),
            Card('Agents appear twice', 'Each agent has its own page under Agents <b>and</b> appears inside the intent it serves (the Scout in Work, Merlin in Hire, the Smith in Plus).', 'ink'),
            Card('Validation gap', 'No card sort or tree test yet. Run a 15-person closed card sort per language before launch.', 'muted'),
        ],
        'sitemap · tree',
        SITEMAP_TABLE,
    )
    files['blueprint-pmo'] = page(
        'blueprint-pmo',
        'Service blueprint',
        'Agentic PMO: what the client never sees',
        'The client sees a plan, a morning summary and a weekly call. Below the line of visibility, the Steward and a Lance project manager do the work that makes those feel effortless.',
        'کارفرما یه برنامه، یه خلاصه‌ی صبحگاهی و یه جلسه‌ی هفتگی می‌بینه. زیر خط دید، پیشکار و مدیر پروژه‌ی لنس کاری رو انجام می‌دن که اون‌ها رو ساده نشون می‌ده.',
        [(1240, blueprint_svg())],
        [
            Card('Burndown risk check', 'Every morning the Steward compares done points with the plan and flags a slipping sprint before the client feels it. It is the one backstage step the offer’s promise depends on.', 'coral', 'FOCAL'),
            Card('Human in the loop', 'The PM edits agent output before the weekly call. Tiers differ only in how much human time sits below the line.', 'ink'),
            Card('Failure to design for', 'If the brief is vague, every downstream cell degrades. The intake form asks for “done looks like” before anything else.', 'muted'),
        ],
        'agentic pmo · service blueprint',
    )
    files['state-project'] = page(
        'state-project',
        'State machine',
        'Project and escrow lifecycle',
        'Every state a Lance project and its money can be in. Money moves only on an event: it is held from <b>Funded</b> until a release or a refund.',
        'همه‌ی حالت‌هایی که یه پروژه و پولش می‌تونن داشته باشن. پول فقط با یه رویداد جابه‌جا می‌شه: از «تأمین شد» تا آزادسازی یا بازپرداخت در امانت می‌مونه.',
        [(1240, state_svg())],
        [
            Card('Released', 'The happy completion, reached only by the client’s approval or an arbitration ruling. Never by a timer alone, until auto-release is designed.', 'coral', 'FOCAL'),
            Card('Revise loop', 'In review can return to In progress any number of times; the Sentinel’s checklist carries over so nothing is re-argued.', 'ink'),
            Card('Exceptions', 'Disputed and Refunded are rare but must be designed first: they are where trust is won or lost.', 'muted'),
        ],
        'project lifecycle · state machine',
    )
    files['personas'] = page(
        'personas',
        'User document',
        'Who Lance is for',
        'Five proto-personas built from the brief with the user-persona and jobs-to-be-done skills. The starter is primary: if Lance works for someone with a skill and no clients, it works for everyone after her.',
        'پنج پرسونای اولیه که از روی بریف ساخته شدن. تازه‌کار، پرسونای اصلیه: اگه لنس برای کسی که مهارت داره ولی هنوز کارفرما نداره جواب بده، برای همه‌ی بعدی‌ها هم جواب می‌ده.',
        [(1240, personas_svg())],
        PERSONA_CARDS,
        'personas · quadrant + jobs to be done',
    )
    files['index'] = index_html()
    for name, body in files.items():
        with open(os.path.join(OUT, f'{name}.html'), 'w') as f:
            f.write(body)
    print('wrote', len(files), 'files to', OUT)


if __name__ == '__main__':
    main()
