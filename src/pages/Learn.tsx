import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft01Icon, ArrowRight01Icon, BookOpen01Icon, CheckmarkCircle02Icon, Edit02Icon, PlayIcon, Tick02Icon, UserIcon, Video01Icon } from '@hugeicons/core-free-icons'
import { courses, disciplines, type Course } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { Bar, GuideCard, OathCard, Vignette } from '../ui/cards'
import { Button, ButtonLink, Choice, cn, Container, Field, Icon, inputCls, PageHeader, Panel, SectionHead, Tag } from '../ui/core'
import { Steps } from '../ui/steps'
import { Tabs } from '../ui/tabs'

const LEVEL = { starter: { en: 'Starter', fa: 'تازه‌کار' }, mid: { en: 'Mid', fa: 'متوسط' }, senior: { en: 'Senior', fa: 'باتجربه' } } as const

function CourseCard({ c }: { c: Course }) {
  const { t, to, money, num } = useLocale()
  return (
    <Link to={to(`/learn/${c.slug}`)} className="lift flex h-full flex-col rounded-lg border border-line bg-surface p-6">
      <div className="flex flex-wrap gap-2">
        <Tag tone={c.kind === 'path' ? 'cobalt' : 'neutral'}>{c.kind === 'path' ? t({ en: 'Path', fa: 'مسیر' }) : t({ en: 'Course', fa: 'دوره' })}</Tag>
        <Tag>{t(LEVEL[c.level])}</Tag>
      </div>
      <h3 className="heading mt-4 text-[20px]">{t(c.title)}</h3>
      <p className="mt-1 text-[14px] text-ink-subtle">{t(c.teacher)}</p>
      <p className="mt-3 text-[15px] text-ink-muted">{t(c.line)}</p>
      <p className="mt-auto flex items-center justify-between pt-6 text-[15px]">
        <span className="text-ink-subtle">{t({ en: `${c.lessons} lessons, ${c.hours} hours`, fa: `${num(c.lessons)} درس، ${num(c.hours)} ساعت` })}</span>
        <span className="tabular">{c.price ? money(c.price, 'IRT') : <span className="text-success">{t({ en: 'Free', fa: 'رایگان' })}</span>}</span>
      </p>
    </Link>
  )
}

export function Learn() {
  useTitle({ en: 'Learn', fa: 'یادگیری' })
  const { t, to } = useLocale()
  const [tab, setTab] = useState<'paths' | 'courses' | 'guides'>('paths')
  const list = courses.filter((c) => (tab === 'paths' ? c.kind === 'path' : c.kind === 'course'))
  return (
    <Container>
      <PageHeader
        title={t({ en: 'Learn a skill, then get paid for it', fa: 'یه مهارت یاد بگیر، بعد ازش درآمد داشته باش' })}
        lead={t({
          en: 'Free paths take a starter to a first client. Courses are taught and sold by people who do the work every day.',
          fa: 'مسیرهای رایگان، تازه‌کار رو تا اولین کارفرما می‌رسونن. دوره‌ها رو کسایی درس می‌دن و می‌فروشن که هر روز همین کار رو انجام می‌دن.',
        })}
        actions={
          <ButtonLink to={to('/learn/teach')} variant="outline" icon={Edit02Icon}>
            {t({ en: 'Teach on Lance', fa: 'در لنس درس بده' })}
          </ButtonLink>
        }
      />
      <Tabs
        label={t({ en: 'What to show', fa: 'نمایش' })}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'paths', label: t({ en: 'Paths', fa: 'مسیرها' }) },
          { value: 'courses', label: t({ en: 'Courses', fa: 'دوره‌ها' }) },
          { value: 'guides', label: t({ en: 'Guides', fa: 'راهنماها' }) },
        ]}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="mt-8">
          {tab !== 'guides' ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {list.map((c) => (
                <li key={c.slug}>
                  <CourseCard c={c} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <GuideCard
                icon={UserIcon}
                step={t({ en: 'Guide I', fa: 'راهنمای ۱' })}
                title={t({ en: 'A profile clients read to the end', fa: 'پروفایلی که کارفرما تا آخر بخونه' })}
                line={t({ en: 'One line on what you do, three pieces of work, one honest price.', fa: 'یه خط درباره‌ی کارت، سه نمونه‌کار و یه قیمت روشن.' })}
                vignette={
                  <Vignette>
                    <Bar w="40%" tone="cobalt" />
                    <Bar w="85%" />
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <span className="h-10 rounded-sm bg-surface" />
                      <span className="h-10 rounded-sm bg-surface" />
                      <span className="h-10 rounded-sm bg-surface" />
                    </div>
                  </Vignette>
                }
              />
              <GuideCard
                icon={BookOpen01Icon}
                tone="gilt"
                step={t({ en: 'Guide II', fa: 'راهنمای ۲' })}
                title={t({ en: 'Read a brief like a pro', fa: 'بریف رو حرفه‌ای بخون' })}
                line={t({ en: 'Find the goal, the deadline and the one thing they forgot to mention.', fa: 'هدف، مهلت و همون یه چیزی که یادشون رفته بگن رو پیدا کن.' })}
                vignette={
                  <Vignette>
                    <Bar w="90%" />
                    <Bar w="60%" tone="gilt" />
                    <Bar w="75%" />
                  </Vignette>
                }
              />
              <GuideCard
                icon={Video01Icon}
                step={t({ en: 'Guide III', fa: 'راهنمای ۳' })}
                title={t({ en: 'Your first milestone', fa: 'اولین قدم کاری' })}
                line={t({ en: 'Small, paid, and finished in under a week. Trust grows from there.', fa: 'کوچیک، پولی و کمتر از یه هفته. اعتماد از همین‌جا ساخته می‌شه.' })}
                vignette={
                  <Vignette>
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-cobalt" />
                      <Bar w="50%" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full border border-line-strong" />
                      <Bar w="70%" />
                    </div>
                  </Vignette>
                }
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <section aria-labelledby="oath-h" className="pt-24">
        <SectionHead
          id="oath-h"
          title={t({ en: 'Three oaths for your first month', fa: 'سه عهد برای ماه اول' })}
          lead={t({ en: 'Pin one above your desk. They are the habits that get starters re-hired.', fa: 'یکی‌ش رو بالای میزت بچسبون. همین عادت‌هان که باعث می‌شن تازه‌کارها دوباره استخدام بشن.' })}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <OathCard who="sentinel" tone="cobalt" label={t({ en: 'The Sentinel', fa: 'نگهبان' })} oath={t({ en: 'I check my work twice', fa: 'کارم رو دو بار چک می‌کنم' })} />
          <OathCard who="scribe" tone="marble" label={t({ en: 'The Scribe', fa: 'کاتب' })} oath={t({ en: 'I write things down', fa: 'همه‌چیز رو می‌نویسم' })} />
          <div className="col-span-2 md:col-span-1">
            <OathCard who="scout" tone="gilt" label={t({ en: 'The Scout', fa: 'پیشاهنگ' })} oath={t({ en: 'I learn in public', fa: 'یادگیری‌م رو به بقیه نشون می‌دم' })} />
          </div>
        </div>
      </section>
    </Container>
  )
}

export function CourseDetail() {
  const { slug } = useParams()
  const { t, to, money, num } = useLocale()
  const c = courses.find((x) => x.slug === slug) ?? courses[0]
  useTitle(c.title)
  const disc = disciplines.find((d) => d.id === c.discipline)!
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Learn', fa: 'یادگیری' }), to: to('/learn') }, { label: t(c.title) }]} title={t(c.title)} lead={t(c.line)} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="outline-h">
          <h2 id="outline-h" className="heading mb-5 text-[22px]">
            {t({ en: 'What you will do', fa: 'چه کارهایی انجام می‌دی' })}
          </h2>
          <ol className="flex flex-col">
            {c.outline.map((o, i) => (
              <li key={o.en} className="flex items-center gap-4 border-b border-line py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-[13px] numeral">{num(i + 1)}</span>
                <span className="flex-1">{t(o)}</span>
                {i === 0 && <Tag tone="success">{t({ en: 'Free preview', fa: 'پیش‌نمایش رایگان' })}</Tag>}
              </li>
            ))}
          </ol>
        </section>
        <Panel rail={c.price ? 'gilt' : 'cobalt'} className="flex flex-col gap-4 self-start p-6 lg:sticky lg:top-24">
          <p className="text-[28px] font-semibold tabular">{c.price ? money(c.price, 'IRT') : t({ en: 'Free', fa: 'رایگان' })}</p>
          <dl className="grid grid-cols-2 gap-3 text-[15px]">
            <dt className="text-ink-subtle">{t({ en: 'Teacher', fa: 'مدرس' })}</dt>
            <dd>{t(c.teacher)}</dd>
            <dt className="text-ink-subtle">{t({ en: 'Field', fa: 'حوزه' })}</dt>
            <dd>{t(disc.label)}</dd>
            <dt className="text-ink-subtle">{t({ en: 'Length', fa: 'مدت' })}</dt>
            <dd>{t({ en: `${c.hours} hours`, fa: `${num(c.hours)} ساعت` })}</dd>
          </dl>
          <ButtonLink to={to('/sign-in')} block size="lg" icon={PlayIcon} directional>
            {c.price ? t({ en: 'Buy and start', fa: 'خرید و شروع' }) : t({ en: 'Start the path', fa: 'شروع مسیر' })}
          </ButtonLink>
        </Panel>
      </div>
    </Container>
  )
}

/* ───────────────────────── Teach: sell a course in 4 steps ───────────────────────── */
export function Teach() {
  useTitle({ en: 'Teach on Lance', fa: 'در لنس درس بده' })
  const { t, to, lang, money, num } = useLocale()
  const [step, setStep] = useState(0)
  const [v, setV] = useState({ title: '', who: 'starter', lessons: 6, price: '1500000' })
  const [done, setDone] = useState(false)
  const steps = [t({ en: 'Topic', fa: 'موضوع' }), t({ en: 'Audience', fa: 'مخاطب' }), t({ en: 'Lessons', fa: 'درس‌ها' }), t({ en: 'Price', fa: 'قیمت' })]
  const priceN = Number(v.price.replace(/\D/g, '')) || 0
  const fee = Math.round(priceN * 0.2)
  const valid = [v.title.trim().length >= 6, true, v.lessons >= 3, priceN === 0 || priceN >= 200_000][step]

  if (done)
    return (
      <Container narrow className="py-24 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gilt-soft text-gilt-ink">
          <Icon icon={CheckmarkCircle02Icon} size={32} />
        </span>
        <h1 className="display mt-6 text-[clamp(2rem,4vw,3rem)]">{t({ en: 'Your course draft is saved', fa: 'پیش‌نویس دوره‌ت ذخیره شد' })}</h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-ink-muted">{t({ en: 'Record the first lesson next. We review every course within three working days before it goes live.', fa: 'قدم بعدی ضبط درس اوله. هر دوره قبل از انتشار، ظرف سه روز کاری بررسی می‌شه.' })}</p>
        <ButtonLink to={to('/learn')} className="mt-8">
          {t({ en: 'Back to Learn', fa: 'برگشت به یادگیری' })}
        </ButtonLink>
      </Container>
    )

  return (
    <Container narrow>
      <PageHeader crumbs={[{ label: t({ en: 'Learn', fa: 'یادگیری' }), to: to('/learn') }, { label: t({ en: 'Teach', fa: 'درس بده' }) }]} title={t({ en: 'Teach what you do every day', fa: 'همون کاری رو درس بده که هر روز انجامش می‌دی' })} className="pb-8" />
      <Steps steps={steps} current={step} onJump={setStep} className="mb-10" />
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          if (step < 3) setStep(step + 1)
          else setDone(true)
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: lang === 'fa' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {step === 0 && (
              <Field label={t({ en: 'What will people be able to do after your course?', fa: 'بعد از دوره‌ت، آدم‌ها چه کاری از دستشون برمیاد؟' })} help={t({ en: 'Start with a verb. “Design a logo a client approves”, not “Logo design”.', fa: 'با یه فعل شروع کن. «لوگویی طراحی کنن که کارفرما تأییدش کنه»، نه «طراحی لوگو».' })}>
                {(p) => <input id={p.id} aria-describedby={p.describedBy} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} className={cn(inputCls, 'h-12')} autoComplete="off" />}
              </Field>
            )}
            {step === 1 && (
              <fieldset>
                <legend className="mb-3 text-[15px] font-medium">{t({ en: 'Who is it for?', fa: 'برای کیه؟' })}</legend>
                <Choice label={t({ en: 'Audience', fa: 'مخاطب' })} value={v.who} onChange={(w) => setV({ ...v, who: w })} options={(['starter', 'mid', 'senior'] as const).map((l) => ({ value: l, label: t(LEVEL[l]) }))} />
              </fieldset>
            )}
            {step === 2 && (
              <fieldset>
                <legend className="mb-1 text-[15px] font-medium">{t({ en: 'How many lessons?', fa: 'چند تا درس؟' })}</legend>
                <p className="mb-4 text-[14px] text-ink-subtle">{t({ en: 'Short lessons get finished. Aim for 8–15 minutes each.', fa: 'درس‌های کوتاه تا آخر دیده می‌شن. هر درس ۸ تا ۱۵ دقیقه باشه.' })}</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" aria-label={t({ en: 'Fewer', fa: 'کمتر' })} onClick={() => setV({ ...v, lessons: Math.max(1, v.lessons - 1) })}>
                    −
                  </Button>
                  <output className="w-16 text-center text-[28px] font-semibold tabular" aria-live="polite">
                    {num(v.lessons)}
                  </output>
                  <Button variant="outline" aria-label={t({ en: 'More', fa: 'بیشتر' })} onClick={() => setV({ ...v, lessons: Math.min(40, v.lessons + 1) })}>
                    +
                  </Button>
                </div>
              </fieldset>
            )}
            {step === 3 && (
              <Field label={t({ en: 'Price (toman)', fa: 'قیمت (تومان)' })} help={t({ en: 'Use 0 for a free course. Lance keeps 20% of paid sales.', fa: 'برای دوره‌ی رایگان صفر بزن. لنس ۲۰٪ از فروش دوره‌های پولی رو برمی‌داره.' })}>
                {(p) => (
                  <>
                    <input id={p.id} aria-describedby={p.describedBy} inputMode="numeric" dir="ltr" value={num(priceN)} onChange={(e) => setV({ ...v, price: e.target.value.replace(/[^\d۰-۹]/g, '').replace(/[۰-۹]/g, (x) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x))) })} className={cn(inputCls, 'h-12 text-start tabular')} />
                    {priceN > 0 && (
                      <p className="text-[15px] text-ink-muted">
                        {t({ en: 'You receive', fa: 'سهم تو' })} <span className="text-ink tabular">{money(priceN - fee, 'IRT')}</span> {t({ en: 'per sale', fa: 'برای هر فروش' })}
                      </p>
                    )}
                  </>
                )}
              </Field>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          {step > 0 ? (
            <Button variant="ghost" icon={ArrowLeft01Icon} directional onClick={() => setStep(step - 1)}>
              {t({ en: 'Back', fa: 'قبلی' })}
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={!valid} iconEnd={step === 3 ? Tick02Icon : ArrowRight01Icon} directional={step !== 3}>
            {step === 3 ? t({ en: 'Save draft', fa: 'ذخیره‌ی پیش‌نویس' }) : t({ en: 'Continue', fa: 'ادامه' })}
          </Button>
        </div>
      </form>
    </Container>
  )
}
