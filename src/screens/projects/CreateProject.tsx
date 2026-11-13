import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar03Icon, CheckmarkCircle02Icon, Edit02Icon, SparklesIcon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, ButtonLink, Chip, FileDrop, Icon, ProgressBar, SelectSheet, Slider, Tag, TextArea, TextField, useToast, type PickedFile } from '../../components/ui'
import { allSkills, projectTypes } from '../../data/catalog'
import { cn } from '../../lib/cn'
import { formatDays, formatNumber, formatToman, toEnDigits, toFaDigits } from '../../lib/format'

type Draft = { type: string | null; title: string; description: string; skills: string[]; budget: number; days: number }

const DRAFT_KEY = 'lance:project-draft'
const empty: Draft = { type: null, title: '', description: '', skills: [], budget: 5_000_000, days: 14 }

const STEPS = ['نوع و عنوان', 'توضیحات', 'مهارت‌ها', 'بودجه و زمان'] as const

/** What the budget buys — the Figma hint «با این قیمت شما یک فریلنسر مید لول استخدام میکنید» made dynamic. */
function budgetTier(b: number) {
  if (b < 3_000_000) return { level: 'تازه‌کار', quality: 'پایه', tone: 'text-warning' }
  if (b < 9_000_000) return { level: 'مید لول', quality: 'متوسط', tone: 'text-primary' }
  return { level: 'حرفه‌ای', quality: 'بالا', tone: 'text-success' }
}

function loadDraft(): Draft {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '{}') }
  } catch {
    return empty
  }
}

/**
 * «07 · Projects / Create» — one 2,000px-tall form in Figma. Split into four
 * short steps with a progress bar, inline validation, an autosaved draft and
 * a review step, which is the standard pattern for long marketplace forms.
 */
export function CreateProject() {
  const navigate = useNavigate()
  const toast = useToast()
  const [d, setD] = useState<Draft>(loadDraft)
  const [files, setFiles] = useState<PickedFile[]>([])
  const [step, setStep] = useState(0)
  const [review, setReview] = useState(false)
  const [touched, setTouched] = useState(false)
  const [manualBudget, setManualBudget] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    } catch {
      /* ignore */
    }
  }, [d])

  const errors = useMemo(
    (): Record<string, string | false>[] => [
      { type: !d.type && 'نوع پروژه را انتخاب کنید.', title: d.title.trim().length < 5 && 'یک عنوان حداقل ۵ حرفی بنویسید.' },
      { description: d.description.trim().length < 30 && 'حداقل ۳۰ کاراکتر توضیح بدهید تا لنسرها دقیق‌تر پیشنهاد بدهند.' },
      { skills: d.skills.length === 0 && 'حداقل یک مهارت انتخاب کنید.' },
      { budget: d.budget < 500_000 && 'حداقل بودجه ۵۰۰ هزار تومان است.', days: (d.days < 1 || d.days > 365) && 'بین ۱ تا ۳۶۵ روز' },
    ],
    [d],
  )
  const stepValid = (i: number) => Object.values(errors[i]).every((e) => !e)
  const err = (k: string) => touched && errors[step][k]

  const next = () => {
    setTouched(true)
    if (!stepValid(step)) return
    setTouched(false)
    if (step < STEPS.length - 1) setStep(step + 1)
    else setReview(true)
  }

  const submit = () => {
    setSubmitting(true)
    window.setTimeout(() => {
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        /* ignore */
      }
      navigate('/projects/new/done', { replace: true, state: { title: d.title } })
    }, 900)
  }

  const tier = budgetTier(d.budget)
  const hasDraft = d.title || d.description

  if (review) {
    return (
      <>
        <AppHeader title="بررسی نهایی" onLeading={() => setReview(false)} />
        <Screen
          title="بررسی پروژه"
          footer={
            <Button block size="lg" loading={submitting} onClick={submit}>
              ثبت پروژه
            </Button>
          }
        >
          <p className="mb-5 text-sm text-fg-muted">قبل از انتشار یک بار مرور کن. بعد از ثبت هم تا قبل از پذیرش پیشنهاد قابل ویرایشه.</p>
          <div className="flex flex-col gap-3">
            {[
              { i: 0, k: 'نوع پروژه', v: projectTypes.find((p) => p.value === d.type)?.label },
              { i: 0, k: 'عنوان', v: d.title },
              { i: 1, k: 'توضیحات', v: <span className="line-clamp-3 font-normal leading-6 text-fg-muted">{d.description}</span> },
              { i: 1, k: 'فایل‌ها', v: files.length ? `${formatNumber(files.length)} فایل` : 'بدون فایل' },
              { i: 2, k: 'مهارت‌ها', v: <span className="flex flex-wrap gap-1.5">{d.skills.map((s) => <Tag key={s}>{s}</Tag>)}</span> },
              { i: 3, k: 'بودجه و زمان', v: `${formatToman(d.budget)} · ${formatDays(d.days)}` },
            ].map((row) => (
              <div key={row.k} className="flex items-start gap-3 rounded-[14px] border border-stroke bg-surface p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-fg-subtle">{row.k}</p>
                  <div className="mt-1 text-sm font-bold">{row.v}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReview(false)
                    setStep(row.i)
                  }}
                  aria-label={`ویرایش ${row.k}`}
                  className="grid size-9 place-items-center rounded-[10px] text-fg-muted hover:bg-white-soft hover:text-primary"
                >
                  <Icon icon={Edit02Icon} size={18} />
                </button>
              </div>
            ))}
          </div>
        </Screen>
      </>
    )
  }

  return (
    <>
      <AppHeader
        leading={step === 0 ? 'close' : 'back'}
        onLeading={step === 0 ? undefined : () => setStep(step - 1)}
        backTo="/app"
        title="ثبت پروژه"
        subtitle={`مرحله ${toFaDigits(step + 1)} از ${toFaDigits(STEPS.length)} · ${STEPS[step]}`}
        actions={hasDraft ? <span className="text-[11px] text-fg-subtle">پیش‌نویس ذخیره شد</span> : undefined}
      />
      <div className="flex gap-1.5 px-5" aria-hidden>
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1">
            <ProgressBar value={i < step ? 100 : i === step ? 50 : 0} />
          </div>
        ))}
      </div>
      <Screen
        title="ثبت پروژه"
        className="pt-8"
        footer={
          <Button block size="lg" onClick={next}>
            {step === STEPS.length - 1 ? 'مرور و ثبت' : 'ادامه'}
          </Button>
        }
      >
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }} className="flex flex-col gap-7">
            {step === 0 && (
              <>
                <SelectSheet
                  label={<span className="text-lg">نوع پروژه‌ی خود را انتخاب کنید!</span>}
                  sheetTitle="نوع پروژه"
                  placeholder="نوع پروژه شما چیه؟"
                  icon={UserGroupIcon}
                  options={projectTypes}
                  value={d.type}
                  onChange={(v) => set('type', v)}
                  error={err('type')}
                />
                <TextField
                  label={<span className="text-lg">اسم پروژه چیه؟</span>}
                  placeholder="مثلاً طراحی لوگو برای کافه"
                  value={d.title}
                  maxLength={80}
                  onChange={(e) => set('title', e.target.value)}
                  error={err('title')}
                  hint="عنوان کوتاه و دقیق، پیشنهادهای مرتبط‌تری جذب می‌کند."
                />
              </>
            )}
            {step === 1 && (
              <>
                <div>
                  <TextArea
                    label={<span className="text-lg">توضیحات پروژه خود را بنویسید.</span>}
                    hint={
                      <>
                        <b className="text-fg">جزئیات دقیق‌تر</b> در درک بیشتر پروژه به فریلنسر کمک میکنه!
                      </>
                    }
                    placeholder="چند تا نکته‌ی کلیدی رو بیان کنید یا توضیحات کامل راجع به پروژه‌ی خود را بدهید."
                    value={d.description}
                    maxChars={2000}
                    onChange={(e) => set('description', e.target.value)}
                    error={err('description')}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['هدف پروژه چیه؟', 'خروجی نهایی چیه؟', 'نمونه‌ی مشابه دارید؟'].map((p) => (
                      <Chip key={p} icon={SparklesIcon} onClick={() => set('description', `${d.description}${d.description ? '\n' : ''}${p} `)}>
                        {p}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold">فایل‌های موردنیاز برای پروژه (اختیاری)</p>
                  <FileDrop files={files} onChange={setFiles} onError={(m) => toast.show(m, { tone: 'error' })} />
                </div>
              </>
            )}
            {step === 2 && (
              <SelectSheet
                multiple
                max={8}
                label={<span className="text-lg">مهارت‌های مورد نیاز خود را انتخاب کنید.</span>}
                sheetTitle="مهارت‌ها"
                placeholder="دنبال چه مهارت‌هایی هستی؟"
                icon={UserGroupIcon}
                options={allSkills.map((s) => ({ value: s, label: s }))}
                value={d.skills}
                onChange={(v) => set('skills', v)}
                error={err('skills')}
                hint="تا ۸ مهارت"
                searchable
              />
            )}
            {step === 3 && (
              <>
                <section>
                  <h2 className="text-lg font-extrabold">بودجه مورد نظر خود را تعیین کنید</h2>
                  <p className="mt-1 text-sm text-fg-muted">
                    دقت کنید که هرچه <b className="text-fg">قیمت بیشتر</b> باشد <b className="text-fg">کیفیت بهتر</b> است!
                  </p>
                  <div className="mt-4 rounded-[18px] border border-stroke bg-surface p-4">
                    <AnimatePresence mode="wait">
                      <motion.p key={tier.level} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-base font-extrabold">
                        با این قیمت شما یک فریلنسر <span className={tier.tone}>{tier.level}</span> استخدام می‌کنید.
                      </motion.p>
                    </AnimatePresence>
                    <p className="mt-1 text-xs text-fg-muted">
                      کیفیت کار <b className={tier.tone}>{tier.quality}</b> تحویل می‌گیرید.
                    </p>
                    <Slider className="mt-5" label="بودجه" min={500_000} max={30_000_000} step={500_000} value={d.budget} onChange={(v) => set('budget', v)} format={(n) => formatToman(n, { compact: true })} />
                    <p className="mt-3 text-3xl font-extrabold tabular">
                      {formatNumber(d.budget)} <span className="text-sm font-medium text-fg-muted">تومان</span>
                    </p>
                  </div>
                  <AnimatePresence initial={false}>
                    {manualBudget ? (
                      <motion.div key="manual" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 overflow-hidden">
                        <TextField
                          label="مبلغ (تومان)"
                          inputMode="numeric"
                          dir="ltr"
                          className="text-left tabular"
                          value={formatNumber(d.budget)}
                          onChange={(e) => set('budget', Number(toEnDigits(e.target.value).replace(/\D/g, '')) || 0)}
                          error={err('budget')}
                          autoFocus
                        />
                      </motion.div>
                    ) : (
                      <Button key="btn" variant="outline" block className="mt-3" onClick={() => setManualBudget(true)}>
                        وارد کردن رقم
                      </Button>
                    )}
                  </AnimatePresence>
                </section>
                <section>
                  <h2 className="text-lg font-extrabold">تعداد روز مورد نیاز برای اجرای پروژه را وارد کنید.</h2>
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" aria-label="کم کردن روز" onClick={() => set('days', Math.max(1, d.days - 1))} className="grid size-14 place-items-center rounded-[14px] border border-stroke bg-surface text-2xl font-bold hover:border-primary">
                      −
                    </button>
                    <div className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[14px] border border-stroke bg-surface">
                      <Icon icon={Calendar03Icon} size={20} className="text-fg-muted" />
                      <span className="text-xl font-extrabold tabular">{formatNumber(d.days)}</span>
                      <span className="text-sm text-fg-muted">روز</span>
                    </div>
                    <button type="button" aria-label="اضافه کردن روز" onClick={() => set('days', Math.min(365, d.days + 1))} className="grid size-14 place-items-center rounded-[14px] border border-stroke bg-surface text-2xl font-bold hover:border-primary">
                      +
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[7, 14, 30, 60].map((n) => (
                      <Chip key={n} selected={d.days === n} onClick={() => set('days', n)}>
                        {formatDays(n)}
                      </Chip>
                    ))}
                  </div>
                  <p className={cn('mt-4 flex items-start gap-2 rounded-[12px] bg-surface p-3 text-xs leading-5 text-fg-muted')}>
                    <Icon icon={SparklesIcon} size={16} className="mt-0.5 text-primary" />
                    تعداد روزی که دیگر کارفرماها با شرایط مشابه شما وارد کرده‌اند به‌طور میانگین <b className="text-primary">{formatDays(30)}</b> بوده است.
                  </p>
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Screen>
    </>
  )
}

export function ProjectCreated() {
  return (
    <Screen
      title="پروژه ثبت شد"
      className="relative flex flex-col items-center justify-center text-center"
      footer={
        <div className="flex flex-col gap-3">
          <ButtonLink to="/app/projects" size="lg" block>
            مشاهده پروژه‌های من
          </ButtonLink>
          <ButtonLink to="/app" size="lg" block variant="secondary">
            بازگشت به داشبورد
          </ButtonLink>
        </div>
      }
    >
      <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade" />
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="relative grid size-24 place-items-center rounded-full bg-success-soft text-success shadow-[0_0_40px_#7fffbf33]">
        <Icon icon={CheckmarkCircle02Icon} size={52} />
      </motion.span>
      <h1 className="relative mt-8 text-2xl font-extrabold">پروژه‌ات منتشر شد! 🎉</h1>
      <p className="relative mt-3 max-w-[300px] text-sm leading-7 text-fg-muted">معمولاً اولین پیشنهادها در کمتر از ۲ ساعت می‌رسن. وقتی رسید بهت خبر می‌دیم.</p>
    </Screen>
  )
}
