import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, CheckmarkCircle02Icon, Edit02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { offers } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, KINDS, type Level, type ProjectKind, type Size, type Urgency } from '../lib/merlin'
import { Button, ButtonLink, Choice, cn, Container, Field, Hl, Icon, inputCls, PageHeader, Panel, Pip, SectionHead, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'
import { Steps } from '../ui/steps'

/* ───────────────────────── Hub ───────────────────────── */
export function Hire() {
  useTitle({ en: 'Hire', fa: 'استخدام' })
  const { t, to, money, num } = useLocale()
  return (
    <Container>
      <PageHeader
        title={t({ en: 'Three ways to hire', fa: 'سه راه برای استخدام' })}
        lead={t({
          en: 'Describe the work and let people propose, buy a fixed-price package, or have the whole project run for you. Every payment waits in escrow until you approve the work.',
          fa: 'کار رو تعریف کن تا آدم‌ها پیشنهاد بدن، یه بسته‌ی قیمت‌مقطوع بخر، یا کل پروژه رو بسپار که برات جلو ببرن. هر پرداختی تا وقتی کار رو تأیید نکنی در امانت می‌مونه.',
        })}
      />
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Panel rail="pink" className="flex flex-col p-8">
          <span className="numeral text-[13px] text-ink-subtle">I</span>
          <h2 className="heading mt-2 text-[28px]">{t({ en: 'Post a project', fa: 'پروژه ثبت کن' })}</h2>
          <p className="mt-3 max-w-[46ch] text-ink-muted">
            {t({
              en: 'Four short steps. Merlin suggests a fair budget at step three, so the proposals you get are realistic.',
              fa: 'چهار مرحله‌ی کوتاه. مرلین توی مرحله‌ی سوم یه بودجه‌ی منصفانه پیشنهاد می‌ده تا پیشنهادهایی که می‌گیری واقع‌بینانه باشن.',
            })}
          </p>
          <div className="mt-auto flex items-end justify-between gap-6 pt-8">
            <ButtonLink to={to('/hire/new')} iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Start a project', fa: 'شروع ثبت پروژه' })}
            </ButtonLink>
            <Knight who="merlin" label={t({ en: 'Merlin', fa: 'مرلین' })} className="hidden h-36 w-28 sm:block" />
          </div>
        </Panel>
        <div className="grid gap-4">
          <Link to={to('/hire/offers/agentic-pmo')} className="lift flex gap-5 rounded-lg border border-line bg-surface p-6">
            <div className="flex-1">
              <span className="numeral text-[13px] text-ink-subtle">II</span>
              <h2 className="heading mt-2 text-[22px]">{t({ en: 'Agentic PMO', fa: 'مدیریت پروژه‌ی هوشمند' })}</h2>
              <p className="mt-2 text-[15px] text-ink-muted">{t({ en: 'The Steward runs sprints and reports daily; a human PM reviews every week.', fa: 'پیشکار اسپرینت‌ها رو می‌چرخونه و هر روز گزارش می‌ده؛ یه مدیر پروژه‌ی واقعی هم هر هفته بررسی می‌کنه.' })}</p>
              <p className="mt-3 text-[14px] text-ink-subtle tabular">{t({ en: `From ${money(6_000_000, 'IRT', { compact: true })}`, fa: `از ${money(6_000_000, 'IRT', { compact: true })}` })}</p>
            </div>
            <Knight who="steward" label={t({ en: 'The Steward', fa: 'پیشکار' })} className="h-28 w-22 shrink-0" />
          </Link>
          <a href="#offers" className="lift flex flex-col rounded-lg border border-line bg-surface p-6">
            <span className="numeral text-[13px] text-ink-subtle">III</span>
            <h2 className="heading mt-2 text-[22px]">{t({ en: 'Buy a ready package', fa: 'یه بسته‌ی آماده بخر' })}</h2>
            <p className="mt-2 text-[15px] text-ink-muted">{t({ en: `Fixed scope, fixed price, ${num(offers.length)} packages to start with.`, fa: `کار و قیمت از قبل مشخصه؛ فعلاً ${num(offers.length)} بسته.` })}</p>
          </a>
        </div>
      </div>

      <section id="offers" aria-labelledby="offers-h" className="scroll-mt-24 pt-24">
        <SectionHead id="offers-h" title={t({ en: 'Ready packages', fa: 'بسته‌های آماده' })} lead={t({ en: 'Agent-assisted packages are reviewed by a person before delivery.', fa: 'بسته‌هایی که دستیار هوشمند کمک می‌کنه، قبل از تحویل توسط یه آدم بررسی می‌شن.' })} />
        <ul className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => (
            <li key={o.slug}>
              <Link to={to(`/hire/offers/${o.slug}`)} className="lift flex h-full flex-col rounded-lg border border-line bg-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-[18px]">{t(o.title)}</h3>
                  {o.agentAssisted && <Tag tone="pink">{t({ en: 'Agent-assisted', fa: 'با کمک دستیار' })}</Tag>}
                </div>
                <p className="mt-1 text-[14px] text-ink-subtle">{t(o.by)}</p>
                <p className="mt-3 text-[15px] text-ink-muted">{t(o.line)}</p>
                <p className="mt-auto pt-5 text-[15px] tabular">
                  {t({ en: 'From', fa: 'از' })} {money(o.from, o.currency)}
                  <span className="text-ink-subtle">
                    {' '}
                    / {t({ en: `${o.days} days`, fa: `${num(o.days)} روز` })}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}

/* ───────────────────────── Post a project (4 steps) ───────────────────────── */
type Draft = { kind: ProjectKind | ''; title: string; brief: string; skills: string; size: Size; level: Level; urgency: Urgency; budget: number | null }
const EMPTY: Draft = { kind: '', title: '', brief: '', skills: '', size: 'm', level: 'mid', urgency: 'normal', budget: null }
const KEY = 'lance:draft-project'

/** Deadline factors, the same ones Merlin uses (src/lib/merlin.ts). */
const URGENCY_DAYS: Record<Urgency, number> = { rush: 0.7, normal: 1, relaxed: 1.25 }

/** Skills as chips (the Figma form): type, press Enter or comma; each chip has a remove button. */
function SkillsInput({ id, describedBy, value, onChange }: { id: string; describedBy?: string; value: string; onChange: (v: string) => void }) {
  const { t } = useLocale()
  const [draft, setDraft] = useState('')
  const list = value.split(',').map((x) => x.trim()).filter(Boolean)
  const add = (raw: string) => {
    const v = raw.trim().replace(/,$/, '')
    if (!v || list.some((x) => x.toLowerCase() === v.toLowerCase())) return setDraft('')
    onChange([...list, v].join(', '))
    setDraft('')
  }
  return (
    <div className="flex flex-col gap-3">
      <input
        id={id}
        aria-describedby={describedBy}
        value={draft}
        onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && list.length) onChange(list.slice(0, -1).join(', '))
        }}
        onBlur={() => draft && add(draft)}
        className={cn(inputCls, 'h-12')}
        placeholder={t({ en: 'e.g. Figma', fa: 'مثلاً فیگما' })}
        autoComplete="off"
      />
      {list.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={t({ en: 'Skills added', fa: 'مهارت‌های اضافه‌شده' })}>
          {list.map((x) => (
            <li key={x}>
              <button
                type="button"
                onClick={() => onChange(list.filter((y) => y !== x).join(', '))}
                className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-line bg-raised px-3 text-[14px] hover:border-line-strong"
                aria-label={t({ en: `Remove ${x}`, fa: `حذف ${x}` })}
              >
                {x}
                <Icon icon={Cancel01Icon} size={14} className="text-ink-subtle" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PostProject() {
  useTitle({ en: 'Post a project', fa: 'ثبت پروژه' })
  const { t, to, lang, money, num, range } = useLocale()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(() => {
    // A service tile on Home links here with ?kind=…; it pre-selects the type over any saved draft.
    const pick = new URLSearchParams(window.location.search).get('kind')
    const kind = KINDS.some((k) => k.id === pick) ? (pick as ProjectKind) : null
    let saved: Draft = EMPTY
    try {
      saved = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    } catch {
      /* ignore */
    }
    return kind ? { ...saved, kind } : saved
  })
  const [tried, setTried] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(d))
    } catch {
      /* ignore */
    }
  }, [d])
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))
  const cur = lang === 'fa' ? 'IRT' : 'USD'
  const est = d.kind ? estimate({ kind: d.kind, size: d.size, level: d.level, urgency: d.urgency, currency: cur }) : null
  // Merlin's days already include the urgency; undo it to get the usual length, then show each option.
  const baseDays = est ? est.days / URGENCY_DAYS[d.urgency] : 20

  const STEPS = [t({ en: 'What', fa: 'چی' }), t({ en: 'Details', fa: 'جزئیات' }), t({ en: 'Price', fa: 'قیمت' }), t({ en: 'Review', fa: 'مرور' })]
  const errors = [
    { kind: !d.kind && t({ en: 'Pick the type closest to your project.', fa: 'نزدیک‌ترین نوع به پروژه‌ت رو انتخاب کن.' }), title: d.title.trim().length < 6 && t({ en: 'Give it a title of at least 6 characters, e.g. “Online shop for handmade rugs”.', fa: 'یه عنوان حداقل ۶ حرفی بنویس، مثلاً «فروشگاه آنلاین فرش دستباف».' }) },
    { brief: d.brief.trim().length < 40 && t({ en: 'Write at least 40 characters: who it’s for and what “done” looks like.', fa: 'حداقل ۴۰ حرف بنویس: برای کیه و «تموم شده» یعنی چی.' }) },
    { budget: !d.budget && t({ en: 'Pick a budget, or use Merlin’s middle.', fa: 'یه بودجه انتخاب کن، یا عدد وسط مرلین رو بردار.' }) },
    {},
  ] as Record<string, string | false>[]
  const ok = Object.values(errors[step]).every((e) => !e)
  const next = () => {
    setTried(true)
    if (!ok) return
    setTried(false)
    if (step < 3) setStep(step + 1)
    else {
      setDone(true)
      try {
        localStorage.removeItem(KEY)
      } catch {
        /* ignore */
      }
    }
  }
  const err = (k: string) => tried && errors[step][k]

  if (done) {
    return (
      <Container narrow className="py-24 text-center">
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-16 place-items-center rounded-full bg-pink-soft text-pink-ink">
          <Icon icon={CheckmarkCircle02Icon} size={32} />
        </motion.span>
        <h1 className="display mt-6 text-[clamp(2rem,4vw,3rem)]">{t({ en: 'Your project is live', fa: 'پروژه‌ت منتشر شد' })}</h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-ink-muted">
          {t({
            en: 'We’ll tell you when the first proposals arrive. Your budget stays private until you choose someone.',
            fa: 'هر وقت اولین پیشنهادها رسید خبرت می‌کنیم. بودجه‌ت تا وقتی کسی رو انتخاب نکنی پیش خودمون می‌مونه.',
          })}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to={to('/hire/offers/agentic-pmo')} variant="outline">
            {t({ en: 'Add the Agentic PMO', fa: 'افزودن مدیریت پروژه‌ی هوشمند' })}
          </ButtonLink>
          <Button onClick={() => navigate(to('/'))}>{t({ en: 'Back home', fa: 'برگشت به خانه' })}</Button>
        </div>
      </Container>
    )
  }

  return (
    <Container narrow className="pt-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="heading text-[clamp(1.8rem,3.2vw,2.5rem)]">
          <Hl>{t({ en: 'Post', fa: 'ثبت' })}</Hl> {t({ en: 'a project, free', fa: 'پروژه، رایگان' })}
        </h1>
        <ButtonLink to={to('/hire')} variant="solid" size="sm" aria-label={t({ en: 'Close and go back to Hire', fa: 'بستن و برگشت به استخدام' })}>
          <Icon icon={Cancel01Icon} size={18} />
        </ButtonLink>
      </div>
      <Steps steps={STEPS} current={step} onJump={setStep} className="mb-8" />
      <form
        className="rounded-lg bg-surface p-5 sm:p-8 day:border day:border-line"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: lang === 'fa' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex flex-col gap-8">
            {step === 0 && (
              <>
                <fieldset>
                  <legend className="mb-4 text-[18px] font-bold">
                    {t({ en: 'Choose your project ', fa: '' })}
                    <Hl>{t({ en: 'type', fa: 'نوع' })}</Hl>
                    {t({ en: '', fa: ' پروژه‌ی خودت رو انتخاب کن' })}
                  </legend>
                  <Choice label={t({ en: 'Type', fa: 'نوع' })} value={d.kind} onChange={(v) => set('kind', v as ProjectKind)} options={KINDS.map((k) => ({ value: k.id, label: t(k.label) }))} />
                  {err('kind') && <p role="alert" className="mt-2 text-[14px] text-danger">{err('kind')}</p>}
                </fieldset>
                <Field label={<span className="text-[18px] font-bold">{t({ en: 'What’s the project ', fa: '' })}<Hl>{t({ en: 'called', fa: 'اسم' })}</Hl>{t({ en: '?', fa: ' پروژه چیه؟' })}</span>} help={t({ en: 'What a freelancer reads first. Be specific.', fa: 'اولین چیزیه که فریلنسر می‌خونه؛ دقیق بنویس.' })} error={err('title')}>
                  {(p) => <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={d.title} onChange={(e) => set('title', e.target.value)} className={cn(inputCls, 'h-12')} maxLength={80} autoComplete="off" />}
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field
                  label={<span className="text-[18px] font-bold"><Hl>{t({ en: 'Describe', fa: 'توضیحات' })}</Hl>{t({ en: ' your project', fa: ' پروژه‌ت رو بنویس' })}</span>}
                  help={t({ en: 'Who is it for, what does “done” look like, anything you already have.', fa: 'برای کیه، «تموم شده» یعنی چی، و هر چیزی که از قبل آماده داری.' })}
                  error={err('brief')}
                >
                  {(p) => (
                    <textarea id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={d.brief} onChange={(e) => set('brief', e.target.value)} rows={7} className={cn(inputCls, 'py-3 leading-relaxed')} maxLength={2000} />
                  )}
                </Field>
                <Field label={<span className="text-[18px] font-bold"><Hl>{t({ en: 'Skills', fa: 'مهارت‌های' })}</Hl>{t({ en: ' it needs', fa: ' مورد نیاز' })}</span>} optional={t({ en: 'Optional', fa: 'اختیاری' })} help={t({ en: 'Type a skill and press Enter.', fa: 'یه مهارت بنویس و اینتر بزن.' })}>
                  {(p) => <SkillsInput id={p.id} describedBy={p.describedBy} value={d.skills} onChange={(v) => set('skills', v)} />}
                </Field>
              </>
            )}
            {step === 2 && est && (
              <>
                <div className="flex items-center gap-4">
                  <Knight who="merlin" label={t({ en: 'Merlin', fa: 'مرلین' })} className="h-24 w-20 shrink-0" />
                  <p className="text-ink-muted">
                    {t({
                      en: 'Merlin read your brief. Adjust three things and the range follows; the reasons are written underneath.',
                      fa: 'مرلین بریفت رو خوند. سه تا چیز رو تنظیم کن تا بازه همراهش عوض بشه؛ دلیل‌ها زیرش نوشته شده.',
                    })}
                  </p>
                </div>
                {(
                  [
                    ['size', t({ en: 'Size', fa: 'اندازه' }), [['s', t({ en: 'Small', fa: 'کوچیک' })], ['m', t({ en: 'Medium', fa: 'متوسط' })], ['l', t({ en: 'Large', fa: 'بزرگ' })]]],
                    ['level', t({ en: 'Freelancer level', fa: 'سطح فریلنسر' })!, [['starter', t({ en: 'Starter', fa: 'تازه‌کار' })], ['mid', t({ en: 'Mid', fa: 'متوسط' })], ['senior', t({ en: 'Senior', fa: 'باتجربه' })]]],
                  ] as const
                ).map(([k, label, opts]) => (
                  <fieldset key={k}>
                    <legend className="mb-3 text-[16px] font-bold">{label}</legend>
                    <Choice label={label} value={d[k]} onChange={(v) => setD((x) => ({ ...x, [k]: v, budget: null }))} options={opts.map(([value, l]) => ({ value, label: l }))} />
                  </fieldset>
                ))}
                {/* Deadline as day tiles, as in the Figma form; each maps to an urgency Merlin understands. */}
                <fieldset>
                  <legend className="mb-1 text-[18px] font-bold">
                    {t({ en: 'How many ', fa: 'تعداد ' })}
                    <Hl>{t({ en: 'days', fa: 'روز' })}</Hl>
                    {t({ en: ' does it need?', fa: ' مورد نیاز برای پروژه رو تعیین کن' })}
                  </legend>
                  <p className="mb-4 text-[14px] text-ink-subtle">{t({ en: 'A tighter deadline costs more and narrows who can take it.', fa: 'مهلت کمتر، هزینه‌ی بیشتری داره و انتخاب فریلنسر رو محدودتر می‌کنه.' })}</p>
                  <div role="radiogroup" aria-label={t({ en: 'Days', fa: 'روز' })} className="grid grid-cols-3 gap-3">
                    {(['rush', 'normal', 'relaxed'] as const).map((u) => {
                      const days = Math.max(3, Math.round(baseDays * URGENCY_DAYS[u]))
                      const on = d.urgency === u
                      return (
                        <button
                          key={u}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setD((x) => ({ ...x, urgency: u, budget: null }))}
                          className={cn('flex h-20 flex-col items-center justify-center rounded-[14px] border transition-colors', on ? 'border-pink bg-pink-soft' : 'border-transparent bg-raised hover:border-line-strong day:border-line')}
                        >
                          <span className={cn('text-[24px] font-bold tabular', on ? 'text-pink-ink' : 'text-ink-muted')}>{t({ en: `${days} days`, fa: `${num(days)} روز` })}</span>
                          <span className="text-[12px] text-ink-subtle">{t(u === 'rush' ? { en: 'Rush', fa: 'فوری' } : u === 'relaxed' ? { en: 'Relaxed', fa: 'بدون عجله' } : { en: 'Usual', fa: 'معمول' })}</span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-[13px] text-ink-subtle">{t({ en: `Similar projects took about ${Math.round(baseDays)} days.`, fa: `پروژه‌های مشابه حدود ${num(Math.round(baseDays))} روز طول کشیدن.` })}</p>
                </fieldset>
                <div className="rounded-[16px] border border-line bg-raised/40 p-5 sm:p-6" aria-live="polite">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="text-[14px] text-ink-subtle">{t({ en: 'Merlin’s fair range', fa: 'بازه‌ی منصفانه‌ی مرلین' })}</p>
                    <Tag tone={est.confidence === 'high' ? 'success' : 'neutral'}>
                      {t(est.confidence === 'high' ? { en: 'High confidence', fa: 'اطمینان بالا' } : est.confidence === 'medium' ? { en: 'Medium confidence', fa: 'اطمینان متوسط' } : { en: 'Low confidence: wide range', fa: 'اطمینان کم؛ بازه بازه' })}
                    </Tag>
                  </div>
                  <p className="mt-2 text-[28px] font-semibold tabular">
                    {range(est.low, est.high, cur)}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2 text-[15px] text-ink-muted">
                    {est.reasons.map((r) => (
                      <li key={r.en} className="flex gap-2">
                        <Pip /> <span className="-mt-1.5">{t(r)}</span>
                      </li>
                    ))}
                  </ul>
                  <fieldset className="mt-6 border-t border-line pt-5">
                    <legend className="mb-1 text-[18px] font-bold">
                      <Hl>{t({ en: 'Budget', fa: 'بودجه' })}</Hl>
                      {t({ en: ': pick yours', fa: ' مورد نظرت رو تعیین کن' })}
                    </legend>
                    <p className="mb-4 text-[14px] text-ink-subtle">{t({ en: 'A higher price usually buys more experience.', fa: 'دقت کن که هرچه قیمت بیشتر باشه، کیفیت بهتره!' })}</p>
                    <div role="radiogroup" aria-label={t({ en: 'Your budget', fa: 'بودجه‌ی تو' })} className="flex flex-col gap-3">
                      {[est.low, est.mid, est.high].map((v, i) => {
                        const on = d.budget === v
                        return (
                          <button
                            key={v}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set('budget', v)}
                            className={cn('flex items-center gap-4 rounded-[14px] border px-4 py-3.5 text-start transition-colors', on ? 'border-pink bg-pink-soft' : 'border-transparent bg-raised hover:border-line-strong day:border-line')}
                          >
                            <span className="min-w-0 flex-1">
                              <span className={cn('block text-[18px] font-bold tabular', on ? 'text-pink-ink' : 'text-ink')}>{money(v, cur)}</span>
                              <span className="block text-[13px] text-ink-subtle">
                                {t(
                                  [
                                    { en: 'At this price you can choose a starter freelancer.', fa: 'با این قیمت می‌تونی یه فریلنسر تازه‌کار انتخاب کنی.' },
                                    { en: 'At this price you can choose a mid-level freelancer.', fa: 'با این قیمت می‌تونی یه فریلنسر سطح متوسط انتخاب کنی.' },
                                    { en: 'At this price you can choose a senior freelancer.', fa: 'با این قیمت می‌تونی یه فریلنسر باتجربه انتخاب کنی.' },
                                  ][i],
                                )}
                              </span>
                            </span>
                            <Icon icon={ArrowRight01Icon} size={18} directional className={on ? 'text-pink-ink' : 'text-ink-subtle'} />
                          </button>
                        )
                      })}
                    </div>
                    {err('budget') && <p role="alert" className="mt-2 text-[14px] text-danger">{err('budget')}</p>}
                  </fieldset>
                </div>
              </>
            )}
            {step === 3 && (
              <dl className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface">
                {[
                  [0, t({ en: 'Type', fa: 'نوع' }), d.kind ? t(KINDS.find((k) => k.id === d.kind)!.label) : ''],
                  [0, t({ en: 'Title', fa: 'عنوان' }), d.title],
                  [1, t({ en: 'Description', fa: 'توضیح' }), d.brief],
                  [2, t({ en: 'Budget', fa: 'بودجه' }), d.budget ? money(d.budget, cur) : ''],
                  [2, t({ en: 'Time', fa: 'زمان' }), est ? t({ en: `About ${est.days} days`, fa: `حدود ${num(est.days)} روز` }) : ''],
                ].map(([s, k, v]) => (
                  <div key={String(k)} className="flex items-start gap-4 p-5">
                    <dt className="w-28 shrink-0 text-[14px] text-ink-subtle">{k}</dt>
                    <dd className="min-w-0 flex-1 text-[15px] whitespace-pre-line">{v}</dd>
                    <button type="button" onClick={() => setStep(s as number)} aria-label={t({ en: `Edit ${k}`, fa: `ویرایش ${k}` })} className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-subtle hover:bg-raised hover:text-ink">
                      <Icon icon={Edit02Icon} size={18} />
                    </button>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <Button type="button" variant="ghost" icon={ArrowLeft01Icon} directional onClick={() => setStep(step - 1)}>
              {t({ en: 'Back', fa: 'قبلی' })}
            </Button>
          ) : (
            <span className="text-[14px] text-ink-subtle">{t({ en: 'Saved as you type', fa: 'همین‌طور که می‌نویسی ذخیره می‌شه' })}</span>
          )}
          <Button type="submit" size="lg" className="min-w-[200px]" iconEnd={step === 3 ? Tick02Icon : ArrowRight01Icon} directional={step !== 3}>
            {step === 3 ? t({ en: 'Publish project', fa: 'انتشار پروژه' }) : t({ en: 'Continue', fa: 'ادامه' })}
          </Button>
        </div>
      </form>
    </Container>
  )
}

/* ───────────────────────── Offer detail ───────────────────────── */
export function OfferDetail() {
  const { slug } = useParams()
  const { t, to, money, num, lang } = useLocale()
  const toast = useToast()
  const o = offers.find((x) => x.slug === slug) ?? offers[0]
  useTitle(o.title)
  const [tier, setTier] = useState(1)
  const tiers = o.tiers ?? [{ name: { en: 'Standard', fa: 'استاندارد' }, price: o.from, days: o.days, includes: [o.line] }]
  const roman = ['I', 'II', 'III']
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Hire', fa: 'استخدام' }), to: to('/hire') }, { label: t(o.title) }]} title={t(o.title)} lead={t(o.line)} />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-4 text-[15px] text-ink-muted">
            {t({ en: 'Delivered by', fa: 'ارائه‌دهنده' })}: <span className="text-ink">{t(o.by)}</span>
          </p>
          <div role="radiogroup" aria-label={t({ en: 'Packages', fa: 'بسته‌ها' })} className="grid gap-3 md:grid-cols-3">
            {tiers.map((x, i) => (
              <button
                key={x.name.en}
                type="button"
                role="radio"
                aria-checked={tier === i}
                onClick={() => setTier(i)}
                className={cn('flex flex-col rounded-lg border p-5 text-start transition-colors', tier === i ? 'rail border-pink bg-surface' : 'border-line bg-surface hover:border-line-strong')}
              >
                <span className="numeral text-[13px] text-ink-subtle">{lang === 'fa' ? num(i + 1) : roman[i]}</span>
                <span className="heading mt-1 text-[20px]">{t(x.name)}</span>
                <span className="mt-3 text-[18px] tabular">{money(x.price, 'IRT')}</span>
                <span className="text-[14px] text-ink-subtle">{t({ en: `${x.days} days`, fa: `${num(x.days)} روز` })}</span>
                <ul className="mt-4 flex flex-col gap-2 text-[14px] text-ink-muted">
                  {x.includes.map((inc) => (
                    <li key={inc.en} className="flex gap-2">
                      <Icon icon={Tick02Icon} size={16} className="mt-1 text-pink-ink" />
                      {t(inc)}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
        <Panel rail="pink" className="flex flex-col gap-4 self-start p-6 lg:sticky lg:top-24">
          {o.slug === 'agentic-pmo' && <Knight who="steward" label={t({ en: 'The Steward', fa: 'پیشکار' })} className="mx-auto h-40 w-32" />}
          <p className="text-[14px] text-ink-subtle">{t(tiers[tier].name)}</p>
          <p className="text-[28px] font-semibold tabular">{money(tiers[tier].price, 'IRT')}</p>
          <p className="text-[15px] text-ink-muted">
            {t({ en: 'Paid into escrow. Released only when you approve the work.', fa: 'پول در امانت می‌مونه و فقط وقتی کار رو تأیید کنی آزاد می‌شه.' })}
          </p>
          <Button block size="lg" onClick={() => toast(t({ en: 'Added. Finish checkout after signing in.', fa: 'اضافه شد. بعد از ورود، پرداخت رو تموم کن.' }))}>
            {t({ en: 'Continue with this package', fa: 'ادامه با همین بسته' })}
          </Button>
          {o.slug === 'agentic-pmo' && (
            <Link to={to('/plus/scrum')} className="text-center text-[15px] text-pink-ink underline underline-offset-4">
              {t({ en: 'See what the Steward writes first', fa: 'اول ببین پیشکار چی می‌نویسه' })}
            </Link>
          )}
        </Panel>
      </div>
    </Container>
  )
}
