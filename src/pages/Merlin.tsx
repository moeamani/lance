import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowDown01Icon, ArrowRight01Icon, Delete02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, KINDS, type Level, type ProjectKind, type Size, type Urgency } from '../lib/merlin'
import { Button, ButtonLink, Choice, cn, Container, Hl, Icon, inputCls, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'

/*
 * Merlin, laid out like the Figma "10 · Merlin — Desktop [Beta]" page: a grid-lined hero with
 * sparkles, then one estimate card where every choice updates the price at once, and a history of
 * saved estimates beside it.
 */

type Input = { kind: ProjectKind; size: Size; level: Level; urgency: Urgency }
type Saved = Input & { at: number }
const KEY = 'lance:merlin-history'

function readHistory(): Saved[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.slice(0, 6) : []
  } catch {
    return []
  }
}

const SIZE: { value: Size; label: Bi }[] = [
  { value: 's', label: { en: 'Small', fa: 'کوچیک' } },
  { value: 'm', label: { en: 'Medium', fa: 'متوسط' } },
  { value: 'l', label: { en: 'Large', fa: 'بزرگ' } },
]
const LEVELS: { value: Level; label: Bi }[] = [
  { value: 'starter', label: { en: 'Starter', fa: 'تازه‌کار' } },
  { value: 'mid', label: { en: 'Mid-level', fa: 'سطح متوسط' } },
  { value: 'senior', label: { en: 'Senior', fa: 'باتجربه' } },
]
const URGENCY: { value: Urgency; label: Bi }[] = [
  { value: 'relaxed', label: { en: 'No rush', fa: 'عجله‌ای نیست' } },
  { value: 'normal', label: { en: 'Usual', fa: 'معمول' } },
  { value: 'rush', label: { en: 'Rush', fa: 'فوری' } },
]

/** The estimate card. Used on /merlin and on Merlin's agent page. */
export function MerlinEstimator() {
  const { t, to, lang, num, range, ago } = useLocale()
  const toast = useToast()
  const [v, setV] = useState<Input>({ kind: 'website', size: 'm', level: 'mid', urgency: 'normal' })
  const [history, setHistory] = useState<Saved[]>(readHistory)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(history))
    } catch {
      /* ignore */
    }
  }, [history])
  const cur = lang === 'fa' ? 'IRT' : 'USD'
  const e = estimate({ ...v, currency: cur })
  const kindLabel = (k: ProjectKind) => t(KINDS.find((x) => x.id === k)!.label)
  const set = <K extends keyof Input>(k: K, val: Input[K]) => setV((x) => ({ ...x, [k]: val }))

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px] [&>*]:min-w-0">
      <section aria-labelledby="est-h" className="rounded-lg border border-line/70 bg-surface p-5 sm:p-8">
        <h2 id="est-h" className="text-[22px] font-bold">
          {t({ en: 'Estimate your project', fa: 'برآورد پروژه‌ی تو' })}
        </h2>
        <div className="mt-6 grid gap-7 md:grid-cols-2">
          <div>
            <label htmlFor="m-kind" className="mb-3 block text-[16px] font-semibold">
              {t({ en: 'Project type', fa: 'نوع پروژه' })}
            </label>
            <div className="relative">
              <select id="m-kind" value={v.kind} onChange={(ev) => set('kind', ev.target.value as ProjectKind)} className={cn(inputCls, 'h-12 appearance-none border-pink pe-10 text-pink-ink')}>
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {t(k.label)}
                  </option>
                ))}
              </select>
              <Icon icon={ArrowDown01Icon} size={18} className="pointer-events-none absolute inset-y-0 end-3.5 my-auto text-pink-ink" />
            </div>
          </div>
          <fieldset>
            <legend className="mb-3 text-[16px] font-semibold">{t({ en: 'Size', fa: 'اندازه' })}</legend>
            <Choice label={t({ en: 'Size', fa: 'اندازه' })} value={v.size} onChange={(x) => set('size', x as Size)} options={SIZE.map((o) => ({ value: o.value, label: t(o.label) }))} />
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-[16px] font-semibold">{t({ en: 'Freelancer level', fa: 'سطح فریلنسر' })}</legend>
            <Choice label={t({ en: 'Freelancer level', fa: 'سطح فریلنسر' })} value={v.level} onChange={(x) => set('level', x as Level)} options={LEVELS.map((o) => ({ value: o.value, label: t(o.label) }))} />
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-[16px] font-semibold">{t({ en: 'Project timeline', fa: 'مدت زمان پروژه' })}</legend>
            <Choice label={t({ en: 'Project timeline', fa: 'مدت زمان پروژه' })} value={v.urgency} onChange={(x) => set('urgency', x as Urgency)} options={URGENCY.map((o) => ({ value: o.value, label: t(o.label) }))} />
          </fieldset>
        </div>

        <div className="mt-8 border-t border-line pt-7 text-center" aria-live="polite">
          <p className="text-[16px] font-semibold">{t({ en: 'Estimated project cost', fa: 'برآورد هزینه پروژه' })}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={`${e.low}-${e.high}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-pink-ink tabular">
              {range(e.low, e.high, cur)}
            </motion.p>
          </AnimatePresence>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[14px] text-ink-muted">
            {t({ en: `about ${e.days} days`, fa: `حدود ${num(e.days)} روز` })}
            <Tag tone={e.confidence === 'high' ? 'success' : 'neutral'}>
              {t(e.confidence === 'high' ? { en: 'High confidence', fa: 'اطمینان بالا' } : e.confidence === 'medium' ? { en: 'Medium confidence', fa: 'اطمینان متوسط' } : { en: 'Low confidence', fa: 'اطمینان کم' })}
            </Tag>
          </p>
          <details className="group mx-auto mt-5 max-w-[520px] rounded-[12px] bg-raised text-start day:border day:border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
              {t({ en: 'Why this range', fa: 'چرا این بازه؟' })}
              <Icon icon={ArrowDown01Icon} size={18} className="text-ink-muted transition-transform group-open:rotate-180" />
            </summary>
            <ul className="flex flex-col gap-2 px-4 pb-4 text-[14px] text-ink-muted">
              {e.reasons.map((r) => (
                <li key={r.en} className="flex gap-2">
                  <Icon icon={Tick02Icon} size={16} className="mt-1 shrink-0 text-pink-ink" />
                  {t(r)}
                </li>
              ))}
            </ul>
          </details>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              variant="pinkline"
              onClick={() => {
                setHistory((h) => [{ ...v, at: Date.now() }, ...h].slice(0, 6))
                toast(t({ en: 'Saved to your history', fa: 'در تاریخچه ذخیره شد' }))
              }}
            >
              {t({ en: 'Save estimate', fa: 'ذخیره‌ی برآورد' })}
            </Button>
            <ButtonLink to={`${to('/hire/new')}?kind=${v.kind}`} iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Post this project', fa: 'ثبت همین پروژه' })}
            </ButtonLink>
          </div>
        </div>
      </section>

      <aside aria-labelledby="hist-h" className="rounded-lg border border-line/70 bg-surface p-4 lg:self-start">
        <h2 id="hist-h" className="px-1 pb-3 text-[16px] font-semibold">
          {t({ en: 'History', fa: 'تاریخچه' })}
        </h2>
        {history.length === 0 ? (
          <p className="rounded-[12px] bg-raised p-4 text-[14px] text-ink-subtle day:border day:border-line">{t({ en: 'Saved estimates show up here, so you can compare them later.', fa: 'برآوردهایی که ذخیره کنی اینجا می‌مونن تا بعداً مقایسه‌شون کنی.' })}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((h) => {
              const he = estimate({ ...h, currency: cur })
              return (
                <li key={h.at} className="group relative">
                  <button type="button" onClick={() => setV({ kind: h.kind, size: h.size, level: h.level, urgency: h.urgency })} className="w-full rounded-[12px] bg-raised p-3.5 text-start transition-colors hover:bg-line day:border day:border-line">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[15px] font-semibold">{kindLabel(h.kind)}</span>
                      <span className="text-[12px] text-ink-subtle">{ago(new Date(h.at).toISOString())}</span>
                    </span>
                    <span className="mt-2 flex items-baseline justify-between gap-2 text-[13px]">
                      <span className="text-ink-subtle">{t({ en: 'Estimate', fa: 'برآورد هزینه' })}</span>
                      <span className="font-semibold text-pink-ink tabular">{range(he.low, he.high, cur)}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistory((x) => x.filter((y) => y.at !== h.at))}
                    className="absolute end-2 bottom-2 hidden size-8 place-items-center rounded-[8px] bg-surface text-ink-subtle hover:text-danger group-hover:grid group-focus-within:grid"
                    aria-label={t({ en: 'Delete this estimate', fa: 'حذف این برآورد' })}
                  >
                    <Icon icon={Delete02Icon} size={16} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
    </div>
  )
}

/** Small four-point stars, as scattered around the Figma Merlin hero. */
function Sparkles() {
  const stars = [
    { x: 12, y: 30, s: 14 },
    { x: 18, y: 64, s: 10 },
    { x: 84, y: 28, s: 12 },
    { x: 89, y: 60, s: 16 },
    { x: 30, y: 82, s: 8 },
    { x: 72, y: 80, s: 9 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <svg key={i} viewBox="0 0 20 20" width={s.s} height={s.s} className={cn('absolute text-pink', i % 2 && 'breathe')} style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: 0.7 }}>
          <path d="M10 0C10.6 6 14 9.4 20 10C14 10.6 10.6 14 10 20C9.4 14 6 10.6 0 10C6 9.4 9.4 6 10 0Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  )
}

export default function Merlin() {
  useTitle({ en: 'Merlin', fa: 'مرلین' })
  const { t, to } = useLocale()
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <span aria-hidden className="absolute inset-0 -z-10 [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_70%_at_50%_30%,#000,transparent)] opacity-60" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_25%,color-mix(in_oklab,var(--pink)_16%,transparent),transparent)]" />
        <Sparkles />
        <Container className="relative py-20 text-center sm:py-28">
          <span className="inline-flex items-center rounded-full border border-pink/40 bg-pink-soft px-3.5 py-1 text-[13px] font-medium text-pink-ink">{t({ en: 'AI project price estimator', fa: 'تخمین‌گر هوشمند قیمت پروژه' })}</span>
          <h1 className="display mx-auto mt-6 max-w-[14ch] text-[clamp(2.6rem,6vw,4.6rem)]">
            {t({ en: 'Price the future with ', fa: 'آینده رو با ' })}
            <Hl>{t({ en: 'Merlin', fa: 'مرلین' })}</Hl>
            {t({ en: '', fa: ' قیمت‌گذاری کن' })}
          </h1>
          <p className="mx-auto mt-6 max-w-[48ch] text-[18px] text-ink-muted">
            {t({ en: 'A quick, reasoned estimate of your project’s price from Merlin, so you see the costs clearly before you start.', fa: 'تخمین سریع و دقیق قیمت پروژه با کمک هوش مصنوعی مرلین؛ قبل از شروع، دید روشنی از هزینه‌ها داشته باش.' })}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button size="lg" iconEnd={ArrowRight01Icon} directional onClick={() => document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth' })}>
              {t({ en: 'Estimate now', fa: 'تخمین بزن' })}
            </Button>
            <ButtonLink to={to('/agents/merlin')} size="lg" variant="solid">
              {t({ en: 'Learn more', fa: 'بیشتر بدانید' })}
            </ButtonLink>
          </div>
          <Knight who="merlin" label="" tile={false} className="mx-auto mt-14 h-40 w-auto" />
        </Container>
      </section>
      <Container>
        <div id="estimate" className="scroll-mt-28">
          <MerlinEstimator />
        </div>
      </Container>
    </>
  )
}
