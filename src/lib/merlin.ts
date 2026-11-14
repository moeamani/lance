import type { Bi } from '../i18n/locale'

/**
 * Merlin's estimate — a transparent model, not a black box. Every adjustment it applies is
 * returned as a reason, so the person sees *why* the range moved. Base figures are demo values;
 * in production they come from completed Lance projects in the same category and size.
 */
export type ProjectKind = 'website' | 'app' | 'brand' | 'content' | 'video' | 'data'
export type Size = 's' | 'm' | 'l'
export type Level = 'starter' | 'mid' | 'senior'
export type Urgency = 'relaxed' | 'normal' | 'rush'

export const KINDS: { id: ProjectKind; label: Bi }[] = [
  { id: 'website', label: { en: 'Website', fa: 'وب‌سایت' } },
  { id: 'app', label: { en: 'Mobile app', fa: 'اپ موبایل' } },
  { id: 'brand', label: { en: 'Brand identity', fa: 'هویت بصری' } },
  { id: 'content', label: { en: 'Writing', fa: 'تولید محتوا' } },
  { id: 'video', label: { en: 'Video', fa: 'ویدیو' } },
  { id: 'data', label: { en: 'Data & dashboards', fa: 'داده و داشبورد' } },
]

// Median project price for a medium project with a mid-level freelancer (demo base, toman / USD).
const BASE: Record<ProjectKind, { irt: number; usd: number; days: number }> = {
  website: { irt: 45_000_000, usd: 2_400, days: 21 },
  app: { irt: 120_000_000, usd: 7_500, days: 42 },
  brand: { irt: 28_000_000, usd: 1_600, days: 14 },
  content: { irt: 9_000_000, usd: 600, days: 7 },
  video: { irt: 16_000_000, usd: 900, days: 10 },
  data: { irt: 24_000_000, usd: 1_400, days: 12 },
}
const SIZE = { s: 0.45, m: 1, l: 2.1 }
const LEVEL = { starter: 0.6, mid: 1, senior: 1.6 }
const URGENCY = { relaxed: 0.95, normal: 1, rush: 1.25 }

export type Estimate = { low: number; high: number; mid: number; days: number; confidence: 'high' | 'medium' | 'low'; reasons: Bi[] }

export function estimate(i: { kind: ProjectKind; size: Size; level: Level; urgency: Urgency; currency: 'IRT' | 'USD' }): Estimate {
  const b = BASE[i.kind]
  const base = i.currency === 'IRT' ? b.irt : b.usd
  const mid = base * SIZE[i.size] * LEVEL[i.level] * URGENCY[i.urgency]
  const spread = i.size === 'l' ? 0.28 : 0.18
  const round = (n: number) => (i.currency === 'IRT' ? Math.round(n / 500_000) * 500_000 : Math.round(n / 50) * 50)
  const reasons: Bi[] = [
    {
      en: `Medium ${KINDS.find((k) => k.id === i.kind)!.label.en.toLowerCase()} projects on Lance usually land near this middle.`,
      fa: `پروژه‌های ${KINDS.find((k) => k.id === i.kind)!.label.fa} با اندازه‌ی متوسط در لنس معمولاً حدود همین وسط بسته می‌شن.`,
    },
  ]
  if (i.size !== 'm')
    reasons.push(i.size === 's' ? { en: 'Smaller scope: fewer screens or deliverables.', fa: 'کار کوچیک‌تره: صفحه‌ها یا خروجی‌های کمتر.' } : { en: 'Larger scope: more screens, roles or rounds of review.', fa: 'کار بزرگ‌تره: صفحه‌ها، نقش‌ها یا دورهای بازبینی بیشتر.' })
  if (i.level !== 'mid')
    reasons.push(i.level === 'starter' ? { en: 'A starter costs less and needs more of your time to review.', fa: 'تازه‌کار ارزون‌تره، ولی بررسی کارش وقت بیشتری ازت می‌گیره.' } : { en: 'A senior costs more and usually needs fewer revisions.', fa: 'باتجربه گرون‌تره، ولی معمولاً دور اصلاح کمتری لازم داره.' })
  if (i.urgency === 'rush') reasons.push({ en: 'Rush deadline adds about a quarter for evenings and weekends.', fa: 'مهلت فوری حدود یک‌چهارم اضافه می‌کنه، برای کار شب و آخر هفته.' })
  if (i.urgency === 'relaxed') reasons.push({ en: 'A relaxed deadline gives a small discount: easier to fit in.', fa: 'مهلت راحت یه کم ارزون‌تر تموم می‌شه، چون راحت‌تر جا می‌شه.' })
  const confidence = i.size === 'l' ? 'low' : i.kind === 'app' ? 'medium' : 'high'
  return {
    low: round(mid * (1 - spread)),
    high: round(mid * (1 + spread)),
    mid: round(mid),
    days: Math.round(b.days * SIZE[i.size] * (i.urgency === 'rush' ? 0.7 : i.urgency === 'relaxed' ? 1.25 : 1)),
    confidence,
    reasons,
  }
}
