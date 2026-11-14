import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft01Icon, ArrowRight01Icon, Copy01Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { agents, agentById, type Agent } from '../data/agents'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, KINDS, type Level, type ProjectKind, type Size, type Urgency } from '../lib/merlin'
import { AgentRun } from '../ui/AgentRun'
import { Button, ButtonLink, Choice, Container, Icon, PageHeader, Panel, Pip, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'
import { Steps } from '../ui/steps'

export function Agents() {
  useTitle({ en: 'Agents', fa: 'دستیارها' })
  const { t, to } = useLocale()
  return (
    <Container>
      <PageHeader
        title={t({ en: 'The Round Table', fa: 'میزگرد شوالیه‌ها' })}
        lead={t({
          en: 'Seven agents, each with one job. They show their plan, work in the open, and stop for your approval before anything is sent, paid or published.',
          fa: 'هفت دستیار، هر کدوم با یه کار مشخص. برنامه‌شون رو نشون می‌دن، جلوی چشمت کار می‌کنن و قبل از فرستادن، پرداخت یا انتشار هر چیزی، منتظر تأیید تو می‌مونن.',
        })}
      />
      {/* Merlin leads (2 × 2); the six knights fill the 3 × 2 beside him. */}
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {agents.map((a, i) => (
          <li key={a.id} className={i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}>
            <Link to={to(`/agents/${a.id}`)} className="group grid h-full grid-cols-[120px_1fr] gap-5 lg:block">
              <Knight who={a.id} label={t(a.name)} className={i === 0 ? 'aspect-[4/5] w-full transition-transform duration-200 group-hover:-translate-y-1 lg:mb-6' : 'aspect-[4/5] w-full transition-transform duration-200 group-hover:-translate-y-1 lg:mb-5'} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="heading text-[22px] group-hover:text-pink-ink">{t(a.name)}</h2>
                  {a.plan === 'plus' && <Tag tone="sun">{t({ en: 'Plus', fa: 'پلاس' })}</Tag>}
                </div>
                <p className="mt-1 font-medium text-ink-muted">{t(a.role)}</p>
                <p className="mt-3 text-[15px] text-ink-muted">{t(a.line)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

/** Merlin's full price check: four questions, one per step, then the range with its reasons. */
function PriceCheck() {
  const { t, lang, num, range } = useLocale()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [v, setV] = useState<{ kind: ProjectKind | ''; size: Size; level: Level; urgency: Urgency }>({ kind: '', size: 'm', level: 'mid', urgency: 'normal' })
  const cur = lang === 'fa' ? 'IRT' : 'USD'
  const steps = [t({ en: 'Type', fa: 'نوع' }), t({ en: 'Size', fa: 'اندازه' }), t({ en: 'Level', fa: 'سطح' }), t({ en: 'Deadline', fa: 'مهلت' })]
  const e = v.kind ? estimate({ kind: v.kind, size: v.size, level: v.level, urgency: v.urgency, currency: cur }) : null
  const finished = step === 4

  const q = [
    { k: 'kind', label: t({ en: 'What are you making?', fa: 'چی می‌خوای بسازی؟' }), opts: KINDS.map((k) => ({ value: k.id, label: t(k.label) })) },
    { k: 'size', label: t({ en: 'How big is it?', fa: 'چقدر بزرگه؟' }), opts: [{ value: 's', label: t({ en: 'Small', fa: 'کوچیک' }), hint: t({ en: 'A few screens or pieces', fa: 'چند صفحه یا چند خروجی' }) }, { value: 'm', label: t({ en: 'Medium', fa: 'متوسط' }), hint: t({ en: 'A typical project', fa: 'یه پروژه‌ی معمولی' }) }, { value: 'l', label: t({ en: 'Large', fa: 'بزرگ' }), hint: t({ en: 'Many roles, many rounds', fa: 'نقش‌ها و دورهای زیاد' }) }] },
    { k: 'level', label: t({ en: 'Who do you want to hire?', fa: 'چه کسی رو می‌خوای استخدام کنی؟' }), opts: [{ value: 'starter', label: t({ en: 'A starter', fa: 'یه تازه‌کار' }) }, { value: 'mid', label: t({ en: 'Mid-level', fa: 'سطح متوسط' }) }, { value: 'senior', label: t({ en: 'A senior', fa: 'یه باتجربه' }) }] },
    { k: 'urgency', label: t({ en: 'How soon?', fa: 'تا کِی لازمش داری؟' }), opts: [{ value: 'relaxed', label: t({ en: 'No rush', fa: 'عجله‌ای نیست' }) }, { value: 'normal', label: t({ en: 'Normal', fa: 'معمولی' }) }, { value: 'rush', label: t({ en: 'As soon as possible', fa: 'هر چه زودتر' }) }] },
  ] as const

  return (
    <Panel rail="pink" className="p-6 sm:p-8">
      <Steps steps={steps} current={Math.min(step, 3)} onJump={(i) => setStep(i)} className="mb-8" />
      <AnimatePresence mode="wait" initial={false}>
        {!finished ? (
          <motion.fieldset key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
            <legend className="heading mb-5 text-[22px]">{q[step].label}</legend>
            <Choice
              label={q[step].label}
              value={(v as Record<string, string>)[q[step].k]}
              onChange={(val) => {
                setV((x) => ({ ...x, [q[step].k]: val }))
                setStep(step + 1)
              }}
              options={q[step].opts as unknown as { value: string; label: string; hint?: string }[]}
            />
            {step > 0 && (
              <Button variant="ghost" size="sm" className="mt-6" icon={ArrowLeft01Icon} directional onClick={() => setStep(step - 1)}>
                {t({ en: 'Back', fa: 'قبلی' })}
              </Button>
            )}
          </motion.fieldset>
        ) : (
          e && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-live="polite">
              <p className="text-[14px] text-ink-subtle">{t({ en: 'A fair range for this project', fa: 'بازه‌ی منصفانه برای این پروژه' })}</p>
              <p className="mt-1 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tabular">
                {range(e.low, e.high, cur)}
              </p>
              <p className="mt-1 text-ink-muted">{t({ en: `About ${e.days} days of work`, fa: `حدود ${num(e.days)} روز کار` })}</p>
              <h3 className="mt-6 text-[15px] font-medium">{t({ en: 'Why this range', fa: 'چرا این بازه' })}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-[15px] text-ink-muted">
                {e.reasons.map((r) => (
                  <li key={r.en} className="flex gap-2.5">
                    <span className="mt-2.5">
                      <Pip />
                    </span>
                    {t(r)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                <Button icon={Copy01Icon} onClick={() => toast(t({ en: 'Range copied', fa: 'بازه کپی شد' }))}>
                  {t({ en: 'Copy the range', fa: 'کپی بازه' })}
                </Button>
                <Button variant="ghost" icon={RefreshIcon} onClick={() => setStep(0)}>
                  {t({ en: 'Start over', fa: 'از اول' })}
                </Button>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Panel>
  )
}

function SampleResult({ a }: { a: Agent }) {
  const { t } = useLocale()
  const last = a.run[a.run.length - 1]
  return (
    <p className="text-[15px]">
      <span className="text-ink-subtle">{t({ en: 'Result', fa: 'نتیجه' })}: </span>
      {t(last.result)}
    </p>
  )
}

export function AgentDetail() {
  const { slug } = useParams()
  const { t, to } = useLocale()
  const a = agentById(slug ?? '') ?? agents[0]
  useTitle(a.name)
  const isMerlin = a.id === 'merlin'
  const others = agents.filter((x) => x.id !== a.id).slice(0, 3)
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Agents', fa: 'دستیارها' }), to: to('/agents') }, { label: t(a.name) }]} title={t(a.name)} lead={t(a.line)} />
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-6">
          <Knight who={a.id} label={t(a.name)} className="aspect-[4/5] w-full max-w-[320px]" />
          <dl className="flex flex-col gap-4 text-[15px]">
            <div>
              <dt className="text-ink-subtle">{t({ en: 'You give it', fa: 'چی بهش می‌دی' })}</dt>
              <dd className="mt-1">{t(a.input)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'You get back', fa: 'چی تحویل می‌گیری' })}</dt>
              <dd className="mt-1">{t(a.output)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'Where it stops', fa: 'کجا متوقف می‌شه' })}</dt>
              <dd className="mt-1">{t(a.limit)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'Plan', fa: 'اشتراک' })}</dt>
              <dd className="mt-1">{a.plan === 'plus' ? <Tag tone="sun">{t({ en: 'Included in Plus', fa: 'در لنس پلاس' })}</Tag> : <Tag tone="success">{t({ en: 'Free', fa: 'رایگان' })}</Tag>}</dd>
            </div>
          </dl>
        </aside>
        <div className="flex flex-col gap-8">
          {isMerlin ? (
            <>
              <h2 className="heading text-[24px]">{t({ en: 'Price check', fa: 'بررسی قیمت' })}</h2>
              <PriceCheck />
            </>
          ) : (
            <>
              <h2 className="heading text-[24px]">{t({ en: 'Watch an example run', fa: 'یه اجرای نمونه رو ببین' })}</h2>
              <AgentRun agent={a} result={<SampleResult a={a} />} cta={a.home !== `/agents/${a.id}` ? <ButtonLink to={to(a.home)} size="sm">{t({ en: 'Use it for real', fa: 'استفاده‌ی واقعی' })}</ButtonLink> : undefined} />
            </>
          )}
          <section aria-labelledby="others-h" className="pt-6">
            <h2 id="others-h" className="mb-4 text-[15px] text-ink-subtle">
              {t({ en: 'Works well with', fa: 'کنار این‌ها خوب کار می‌کنه' })}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={to(`/agents/${o.id}`)} className="lift flex items-center gap-3 rounded-md border border-line bg-surface p-3">
                    <Knight who={o.id} label={t(o.name)} className="h-14 w-11 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{t(o.name)}</span>
                      <span className="block truncate text-[13px] text-ink-subtle">{t(o.role)}</span>
                    </span>
                    <Icon icon={ArrowRight01Icon} size={16} directional className="text-ink-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Container>
  )
}
