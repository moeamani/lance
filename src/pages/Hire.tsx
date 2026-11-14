import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon, Edit02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { offers } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, KINDS, type Level, type ProjectKind, type Size, type Urgency } from '../lib/merlin'
import { Button, ButtonLink, Choice, cn, Container, Field, Icon, inputCls, PageHeader, Panel, Pip, SectionHead, Tag } from '../ui/core'
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
        <Panel rail="cobalt" className="flex flex-col p-8">
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
                  {o.agentAssisted && <Tag tone="cobalt">{t({ en: 'Agent-assisted', fa: 'با کمک دستیار' })}</Tag>}
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

export function PostProject() {
  useTitle({ en: 'Post a project', fa: 'ثبت پروژه' })
  const { t, to, lang, money, num, range } = useLocale()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(() => {
    try {
      return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    } catch {
      return EMPTY
    }
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
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-16 place-items-center rounded-full bg-cobalt-soft text-cobalt-ink">
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
    <Container narrow>
      <PageHeader crumbs={[{ label: t({ en: 'Hire', fa: 'استخدام' }), to: to('/hire') }, { label: t({ en: 'Post a project', fa: 'ثبت پروژه' }) }]} title={t({ en: 'Post a project', fa: 'ثبت پروژه' })} className="pb-8" />
      <Steps steps={STEPS} current={step} onJump={setStep} className="mb-10" />
      <form
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
                  <legend className="mb-3 text-[15px] font-medium">{t({ en: 'What kind of project is it?', fa: 'پروژه‌ت از چه نوعیه؟' })}</legend>
                  <Choice label={t({ en: 'Type', fa: 'نوع' })} value={d.kind} onChange={(v) => set('kind', v as ProjectKind)} options={KINDS.map((k) => ({ value: k.id, label: t(k.label) }))} />
                  {err('kind') && <p role="alert" className="mt-2 text-[14px] text-danger">{err('kind')}</p>}
                </fieldset>
                <Field label={t({ en: 'Title', fa: 'عنوان' })} help={t({ en: 'What a freelancer reads first. Be specific.', fa: 'اولین چیزیه که فریلنسر می‌خونه؛ دقیق بنویس.' })} error={err('title')}>
                  {(p) => <input id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={d.title} onChange={(e) => set('title', e.target.value)} className={cn(inputCls, 'h-12')} maxLength={80} autoComplete="off" />}
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field
                  label={t({ en: 'Describe the work', fa: 'کار رو توضیح بده' })}
                  help={t({ en: 'Who is it for, what does “done” look like, anything you already have.', fa: 'برای کیه، «تموم شده» یعنی چی، و هر چیزی که از قبل آماده داری.' })}
                  error={err('brief')}
                >
                  {(p) => (
                    <textarea id={p.id} aria-describedby={p.describedBy} aria-invalid={p.invalid} value={d.brief} onChange={(e) => set('brief', e.target.value)} rows={7} className={cn(inputCls, 'py-3 leading-relaxed')} maxLength={2000} />
                  )}
                </Field>
                <Field label={t({ en: 'Skills it needs', fa: 'مهارت‌های لازم' })} optional={t({ en: 'Optional', fa: 'اختیاری' })} help={t({ en: 'Separate with commas.', fa: 'با ویرگول جدا کن.' })}>
                  {(p) => <input id={p.id} aria-describedby={p.describedBy} value={d.skills} onChange={(e) => set('skills', e.target.value)} className={cn(inputCls, 'h-12')} placeholder="Figma, React" autoComplete="off" />}
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
                    ['urgency', t({ en: 'Deadline', fa: 'مهلت' }), [['relaxed', t({ en: 'Relaxed', fa: 'راحت' })], ['normal', t({ en: 'Normal', fa: 'معمولی' })], ['rush', t({ en: 'Rush', fa: 'فوری' })]]],
                  ] as const
                ).map(([k, label, opts]) => (
                  <fieldset key={k}>
                    <legend className="mb-3 text-[15px] font-medium">{label}</legend>
                    <Choice label={label} value={d[k]} onChange={(v) => setD((x) => ({ ...x, [k]: v, budget: null }))} options={opts.map(([value, l]) => ({ value, label: l }))} />
                  </fieldset>
                ))}
                <Panel rail="cobalt" className="p-6" aria-live="polite">
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
                    <legend className="mb-3 text-[15px] font-medium">{t({ en: 'Your budget', fa: 'بودجه‌ی تو' })}</legend>
                    <Choice
                      label={t({ en: 'Your budget', fa: 'بودجه‌ی تو' })}
                      value={d.budget ? String(d.budget) : ''}
                      onChange={(v) => set('budget', Number(v))}
                      options={[est.low, est.mid, est.high].map((v, i) => ({ value: String(v), label: money(v, cur), hint: t([{ en: 'Low end', fa: 'پایین بازه' }, { en: 'Middle', fa: 'وسط' }, { en: 'High end', fa: 'بالای بازه' }][i]) }))}
                    />
                    {err('budget') && <p role="alert" className="mt-2 text-[14px] text-danger">{err('budget')}</p>}
                  </fieldset>
                </Panel>
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
          <Button type="submit" iconEnd={step === 3 ? Tick02Icon : ArrowRight01Icon} directional={step !== 3}>
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
                className={cn('flex flex-col rounded-lg border p-5 text-start transition-colors', tier === i ? 'rail border-cobalt bg-surface' : 'border-line bg-surface hover:border-line-strong')}
              >
                <span className="numeral text-[13px] text-ink-subtle">{lang === 'fa' ? num(i + 1) : roman[i]}</span>
                <span className="heading mt-1 text-[20px]">{t(x.name)}</span>
                <span className="mt-3 text-[18px] tabular">{money(x.price, 'IRT')}</span>
                <span className="text-[14px] text-ink-subtle">{t({ en: `${x.days} days`, fa: `${num(x.days)} روز` })}</span>
                <ul className="mt-4 flex flex-col gap-2 text-[14px] text-ink-muted">
                  {x.includes.map((inc) => (
                    <li key={inc.en} className="flex gap-2">
                      <Icon icon={Tick02Icon} size={16} className="mt-1 text-cobalt-ink" />
                      {t(inc)}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
        <Panel rail="cobalt" className="flex flex-col gap-4 self-start p-6 lg:sticky lg:top-24">
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
            <Link to={to('/plus/scrum')} className="text-center text-[15px] text-cobalt-ink underline underline-offset-4">
              {t({ en: 'See what the Steward writes first', fa: 'اول ببین پیشکار چی می‌نویسه' })}
            </Link>
          )}
        </Panel>
      </div>
    </Container>
  )
}
