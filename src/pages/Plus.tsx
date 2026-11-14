import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ArrowRight01Icon, CheckmarkCircle02Icon, Copy01Icon, Download01Icon, Task01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { agentById } from '../data/agents'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { AgentRun } from '../ui/AgentRun'
import { Button, ButtonLink, cn, Container, Field, Icon, inputCls, PageHeader, Panel, Pip, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'
import { Steps } from '../ui/steps'

export function Plus() {
  useTitle({ en: 'Lance Plus', fa: 'لنس پلاس' })
  const { t, to, money } = useLocale()
  const perks: { title: Bi; line: Bi }[] = [
    { title: { en: 'CV tailored to every job', fa: 'رزومه‌ی مخصوص هر آگهی' }, line: { en: 'The Smith reshapes your CV around each job description, using only what is true.', fa: 'آهنگر رزومه‌ت رو حول هر شرح شغل از نو می‌چینه؛ فقط با چیزهایی که واقعاً درسته.' } },
    { title: { en: 'Sprints written for you', fa: 'اسپرینت‌ها، آماده' }, line: { en: 'The Steward turns any brief into a backlog and a two-week plan, and writes your daily summary.', fa: 'پیشکار هر بریفی رو به فهرست کار و برنامه‌ی دوهفته‌ای تبدیل می‌کنه و خلاصه‌ی روزانه‌ت رو می‌نویسه.' } },
    { title: { en: 'Lower fee on what you earn', fa: 'کارمزد کمتر روی درآمدت' }, line: { en: 'Lance takes 7% instead of 10% from every payment you receive.', fa: 'لنس به جای ۱۰٪، فقط ۷٪ از هر پرداختی که می‌گیری برمی‌داره.' } },
    { title: { en: 'First look at new jobs', fa: 'زودتر از بقیه ببین' }, line: { en: 'The Scout tells you about strong matches an hour before everyone else sees them.', fa: 'پیشاهنگ کارهای خیلی مرتبط رو یه ساعت زودتر از بقیه بهت خبر می‌ده.' } },
  ]
  return (
    <Container>
      <PageHeader
        title={t({ en: 'Lance Plus', fa: 'لنس پلاس' })}
        lead={t({ en: 'For people who freelance every week. Two agents work for you, and you keep more of what you earn.', fa: 'برای کسایی که هر هفته فریلنسری کار می‌کنن. دو تا دستیار برات کار می‌کنن و سهم بیشتری از درآمدت برای خودت می‌مونه.' })}
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {perks.map((p) => (
            <li key={p.title.en}>
              <Icon icon={CheckmarkCircle02Icon} size={22} className="text-gilt-ink" />
              <h2 className="heading mt-3 text-[20px]">{t(p.title)}</h2>
              <p className="mt-2 text-[15px] text-ink-muted">{t(p.line)}</p>
            </li>
          ))}
        </ul>
        <Panel rail="gilt" className="flex flex-col gap-5 self-start p-8">
          <div className="flex items-end gap-2">
            <span className="text-[40px] font-semibold tabular">{money(249_000, 'IRT')}</span>
            <span className="pb-2 text-ink-subtle">{t({ en: 'a month', fa: 'در ماه' })}</span>
          </div>
          <p className="text-[15px] text-ink-muted">{t({ en: 'Cancel any time from Settings. No automatic yearly renewal.', fa: 'هر وقت خواستی از تنظیمات لغوش کن. تمدید خودکار سالانه نداره.' })}</p>
          <Button variant="gilt" size="lg" block>
            {t({ en: 'Get Plus', fa: 'گرفتن لنس پلاس' })}
          </Button>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <ButtonLink to={to('/plus/cv')} variant="outline" icon={UserAdd01Icon}>
              {t({ en: 'Try CV tailor', fa: 'امتحان رزومه‌ساز' })}
            </ButtonLink>
            <ButtonLink to={to('/plus/scrum')} variant="outline" icon={Task01Icon}>
              {t({ en: 'Try Auto-scrum', fa: 'امتحان اسکرام خودکار' })}
            </ButtonLink>
          </div>
        </Panel>
      </div>
    </Container>
  )
}

/* ───────────────────────── CV tailor (the Smith) ───────────────────────── */
const SAMPLE_JD = {
  en: 'Product Designer (mid-level). Must have: Figma, design systems, user research, prototyping, accessibility. Nice to have: Webflow, motion design. You will own the checkout and account areas.',
  fa: 'طراح محصول (سطح متوسط). الزامی: فیگما، دیزاین سیستم، تحقیق کاربر، پروتوتایپ، دسترس‌پذیری. امتیاز: وب‌فلو، موشن دیزاین. مسئولیت بخش پرداخت و حساب کاربری با شماست.',
}
const MY_SKILLS = ['Figma', 'design systems', 'user research', 'prototyping', 'motion design', 'React']
const SKILL_FA: Record<string, string> = { Figma: 'فیگما', 'design systems': 'دیزاین سیستم', 'user research': 'تحقیق کاربر', prototyping: 'پروتوتایپ', accessibility: 'دسترس‌پذیری', Webflow: 'وب‌فلو', 'motion design': 'موشن دیزاین', React: 'ری‌اکت' }
const WANTED = ['Figma', 'design systems', 'user research', 'prototyping', 'accessibility', 'Webflow', 'motion design']

export function CvTailor() {
  useTitle({ en: 'CV tailor', fa: 'رزومه‌ساز' })
  const { t, to, lang, num } = useLocale()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [jd, setJd] = useState('')
  const smith = agentById('smith')!
  const matched = WANTED.filter((w) => MY_SKILLS.includes(w))
  const missing = WANTED.filter((w) => !MY_SKILLS.includes(w))
  const score = Math.round((matched.length / WANTED.length) * 100)
  const sk = (s: string) => (lang === 'fa' ? SKILL_FA[s] ?? s : s)
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Plus', fa: 'پلاس' }), to: to('/plus') }, { label: t({ en: 'CV tailor', fa: 'رزومه‌ساز' }) }]} title={t({ en: 'Tailor your CV to one job', fa: 'رزومه‌ت رو برای یه آگهی آماده کن' })} lead={t({ en: 'Paste the job description. The Smith reorders your CV around what it asks for and tells you what is missing. It never adds experience you don’t have.', fa: 'شرح شغل رو بچسبون. آهنگر رزومه‌ت رو حول خواسته‌هاش مرتب می‌کنه و می‌گه چی کم داری. هیچ‌وقت سابقه‌ای که نداری رو اضافه نمی‌کنه.' })} />
      <Steps steps={[t({ en: 'Job description', fa: 'شرح شغل' }), t({ en: 'The Smith works', fa: 'کار آهنگر' }), t({ en: 'Your new CV', fa: 'رزومه‌ی جدید' })]} current={step} onJump={setStep} className="mx-auto mb-10 max-w-[620px]" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="mx-auto max-w-[900px]">
          {step === 0 && (
            <Panel className="p-6 sm:p-8">
              <Field label={t({ en: 'Job description', fa: 'شرح شغل' })} help={t({ en: 'Paste the whole post. Requirements and nice-to-haves are both useful.', fa: 'کل آگهی رو بچسبون؛ هم الزامی‌ها به درد می‌خورن، هم امتیازی‌ها.' })}>
                {(p) => <textarea id={p.id} aria-describedby={p.describedBy} rows={8} value={jd} onChange={(e) => setJd(e.target.value)} className={cn(inputCls, 'py-3 leading-relaxed')} />}
              </Field>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setJd(t(SAMPLE_JD))} className="text-[15px] text-cobalt-ink underline underline-offset-4">
                  {t({ en: 'Use a sample job', fa: 'استفاده از یه آگهی نمونه' })}
                </button>
                <Button disabled={jd.trim().length < 40} onClick={() => setStep(1)} iconEnd={ArrowRight01Icon} directional>
                  {t({ en: 'Give it to the Smith', fa: 'بده به آهنگر' })}
                </Button>
              </div>
            </Panel>
          )}
          {step === 1 && (
            <AgentRun
              agent={smith}
              autoStart
              cta={
                <Button size="sm" onClick={() => setStep(2)} iconEnd={ArrowRight01Icon} directional>
                  {t({ en: 'See my CV', fa: 'دیدن رزومه' })}
                </Button>
              }
            />
          )}
          {step === 2 && (
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <Panel className="p-8" aria-label={t({ en: 'Tailored CV', fa: 'رزومه‌ی آماده' })}>
                <p className="heading text-[24px]">{t({ en: 'Hamed Sadeghi', fa: 'حامد صادقی' })}</p>
                <p className="text-ink-muted">{t({ en: 'Product designer, design systems and checkout flows', fa: 'طراح محصول، دیزاین سیستم و مراحل پرداخت' })}</p>
                <h3 className="mt-8 text-[14px] text-ink-subtle">{t({ en: 'Most relevant experience', fa: 'مرتبط‌ترین سوابق' })}</h3>
                <ul className="mt-3 flex flex-col gap-3 text-[15px]">
                  <li>
                    <b className="font-medium">{t({ en: 'Built a 40-component design system', fa: 'ساخت یه دیزاین سیستم ۴۰ کامپوننتی' })}</b>
                    <span className="block text-[14px] text-ink-subtle">{t({ en: 'Moved up: the job asks for design systems first.', fa: 'اومد بالا، چون آگهی اول از همه دیزاین سیستم می‌خواد.' })}</span>
                  </li>
                  <li>
                    <b className="font-medium">{t({ en: 'Redesigned a shop checkout, tested with 6 buyers', fa: 'بازطراحی پرداخت یه فروشگاه، تست با ۶ خریدار' })}</b>
                    <span className="block text-[14px] text-ink-subtle">{t({ en: 'Matches “you will own the checkout”.', fa: 'با «مسئولیت بخش پرداخت با شماست» جوره.' })}</span>
                  </li>
                </ul>
                <h3 className="mt-8 text-[14px] text-ink-subtle">{t({ en: 'Skills, in the job’s order', fa: 'مهارت‌ها، به ترتیب آگهی' })}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {matched.map((s) => (
                    <Tag key={s} tone="cobalt">
                      {sk(s)}
                    </Tag>
                  ))}
                </div>
              </Panel>
              <div className="flex flex-col gap-4">
                <Panel rail="cobalt" className="p-6 text-center">
                  <p className="text-[14px] text-ink-subtle">{t({ en: 'Match with the job', fa: 'تطابق با آگهی' })}</p>
                  <p className="mt-1 text-[44px] font-semibold tabular">{num(score)}٪</p>
                </Panel>
                <Panel className="p-6">
                  <p className="text-[15px] font-medium">{t({ en: 'What’s missing', fa: 'چی کم داری' })}</p>
                  <ul className="mt-3 flex flex-col gap-2 text-[15px] text-ink-muted">
                    {missing.map((m) => (
                      <li key={m} className="flex items-center gap-2">
                        <Pip tone="gilt" /> {sk(m)}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink to={to('/learn')} variant="ghost" size="sm" className="mt-3 -ms-3">
                    {t({ en: 'Find a course for these', fa: 'پیدا کردن دوره براشون' })}
                  </ButtonLink>
                </Panel>
                <Button icon={Download01Icon} onClick={() => toast(t({ en: 'PDF ready in your downloads', fa: 'فایل پی‌دی‌اف دانلود شد' }))}>
                  {t({ en: 'Download PDF', fa: 'دانلود پی‌دی‌اف' })}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  )
}

/* ───────────────────────── Auto-scrum (the Steward) ───────────────────────── */
const SAMPLE_BRIEF = {
  en: 'An online shop for handmade rugs. Customers browse by size and colour, pay online, and track delivery. Admin adds products and sees orders. Launch in 8 weeks with 2 developers and 1 designer.',
  fa: 'فروشگاه آنلاین فرش دستباف. مشتری‌ها بر اساس اندازه و رنگ می‌گردن، آنلاین پرداخت می‌کنن و ارسال رو پیگیری می‌کنن. ادمین محصول اضافه می‌کنه و سفارش‌ها رو می‌بینه. راه‌اندازی تا ۸ هفته با ۲ برنامه‌نویس و ۱ طراح.',
}
type Card = { id: string; title: Bi; points: number; who: 'dev' | 'design' }
const BACKLOG: { sprint: Bi; goal: Bi; cards: Card[] }[] = [
  { sprint: { en: 'Sprint 1', fa: 'اسپرینت ۱' }, goal: { en: 'Browse rugs', fa: 'گشتن بین فرش‌ها' }, cards: [ { id: 'a', title: { en: 'Product list with size and colour filters', fa: 'فهرست محصول با فیلتر اندازه و رنگ' }, points: 5, who: 'dev' }, { id: 'b', title: { en: 'Product page design', fa: 'طراحی صفحه‌ی محصول' }, points: 3, who: 'design' }, { id: 'c', title: { en: 'Admin: add a product', fa: 'ادمین: افزودن محصول' }, points: 5, who: 'dev' } ] },
  { sprint: { en: 'Sprint 2', fa: 'اسپرینت ۲' }, goal: { en: 'Pay online', fa: 'پرداخت آنلاین' }, cards: [ { id: 'd', title: { en: 'Cart and checkout', fa: 'سبد خرید و پرداخت' }, points: 8, who: 'dev' }, { id: 'e', title: { en: 'Payment gateway', fa: 'درگاه پرداخت' }, points: 5, who: 'dev' }, { id: 'f', title: { en: 'Checkout design, 2 steps', fa: 'طراحی پرداخت، دو مرحله‌ای' }, points: 3, who: 'design' } ] },
  { sprint: { en: 'Sprint 3', fa: 'اسپرینت ۳' }, goal: { en: 'Track orders', fa: 'پیگیری سفارش' }, cards: [ { id: 'g', title: { en: 'Order status page', fa: 'صفحه‌ی وضعیت سفارش' }, points: 3, who: 'dev' }, { id: 'h', title: { en: 'Admin: order list', fa: 'ادمین: فهرست سفارش‌ها' }, points: 5, who: 'dev' } ] },
  { sprint: { en: 'Sprint 4', fa: 'اسپرینت ۴' }, goal: { en: 'Launch', fa: 'راه‌اندازی' }, cards: [ { id: 'i', title: { en: 'Speed and accessibility pass', fa: 'بررسی سرعت و دسترس‌پذیری' }, points: 3, who: 'dev' }, { id: 'j', title: { en: 'Launch checklist', fa: 'چک‌لیست راه‌اندازی' }, points: 2, who: 'design' } ] },
]

export function Scrum() {
  useTitle({ en: 'Auto-scrum', fa: 'اسکرام خودکار' })
  const { t, to, num } = useLocale()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState('')
  const steward = agentById('steward')!
  const total = useMemo(() => BACKLOG.flatMap((s) => s.cards).reduce((a, c) => a + c.points, 0), [])
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Plus', fa: 'پلاس' }), to: to('/plus') }, { label: t({ en: 'Auto-scrum', fa: 'اسکرام خودکار' }) }]} title={t({ en: 'From brief to sprints', fa: 'از بریف تا اسپرینت' })} lead={t({ en: 'The Steward reads your brief and writes a backlog split into two-week sprints. You move, rename or delete anything before it goes to your team.', fa: 'پیشکار بریفت رو می‌خونه و یه فهرست کار می‌نویسه که به اسپرینت‌های دوهفته‌ای تقسیم شده. قبل از این‌که به تیمت برسه، هر چیزی رو می‌تونی جابه‌جا، عوض یا حذف کنی.' })} />
      <Steps steps={[t({ en: 'Brief', fa: 'بریف' }), t({ en: 'The Steward plans', fa: 'برنامه‌ریزی پیشکار' }), t({ en: 'Your sprints', fa: 'اسپرینت‌ها' })]} current={step} onJump={setStep} className="mx-auto mb-10 max-w-[620px]" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
          {step === 0 && (
            <Panel className="mx-auto max-w-[760px] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-4">
                <Knight who="steward" label={t(steward.name)} className="h-20 w-16 shrink-0" />
                <p className="text-ink-muted">{t({ en: 'Tell me what you are building, for whom, and with how many people.', fa: 'بگو چی می‌سازی، برای کی، و با چند نفر.' })}</p>
              </div>
              <Field label={t({ en: 'Project brief', fa: 'بریف پروژه' })}>
                {(p) => <textarea id={p.id} rows={6} value={brief} onChange={(e) => setBrief(e.target.value)} className={cn(inputCls, 'py-3 leading-relaxed')} />}
              </Field>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setBrief(t(SAMPLE_BRIEF))} className="text-[15px] text-cobalt-ink underline underline-offset-4">
                  {t({ en: 'Use a sample brief', fa: 'استفاده از بریف نمونه' })}
                </button>
                <Button disabled={brief.trim().length < 40} onClick={() => setStep(1)} iconEnd={ArrowRight01Icon} directional>
                  {t({ en: 'Plan it', fa: 'برنامه‌ریزی کن' })}
                </Button>
              </div>
            </Panel>
          )}
          {step === 1 && (
            <div className="mx-auto max-w-[760px]">
              <AgentRun
                agent={steward}
                autoStart
                cta={
                  <Button size="sm" onClick={() => setStep(2)} iconEnd={ArrowRight01Icon} directional>
                    {t({ en: 'See the sprints', fa: 'دیدن اسپرینت‌ها' })}
                  </Button>
                }
              />
            </div>
          )}
          {step === 2 && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-ink-muted">{t({ en: `${BACKLOG.length} sprints, ${total} points, 8 weeks`, fa: `${num(BACKLOG.length)} اسپرینت، ${num(total)} امتیاز، ۸ هفته` })}</p>
                <div className="flex gap-2">
                  <Button variant="outline" icon={Copy01Icon} onClick={() => toast(t({ en: 'Copied as a table', fa: 'به‌صورت جدول کپی شد' }))}>
                    {t({ en: 'Copy', fa: 'کپی' })}
                  </Button>
                  <ButtonLink to={to('/hire/offers/agentic-pmo')}>{t({ en: 'Have it run for me', fa: 'بسپارش به لنس' })}</ButtonLink>
                </div>
              </div>
              <ol className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
                {BACKLOG.map((s, i) => (
                  <li key={s.sprint.en} className={cn('w-[78%] shrink-0 snap-start rounded-lg border border-line bg-surface p-4 sm:w-[46%] lg:w-auto', i === 0 && 'rail')}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-medium">{t(s.sprint)}</p>
                      {i === 0 && <Tag tone="cobalt">{t({ en: 'Starts Saturday', fa: 'از شنبه' })}</Tag>}
                    </div>
                    <p className="mb-4 text-[14px] text-ink-subtle">{t(s.goal)}</p>
                    <ul className="flex flex-col gap-2">
                      {s.cards.map((c) => (
                        <li key={c.id} className="rounded-md border border-line bg-raised p-3">
                          <p className="text-[15px]">{t(c.title)}</p>
                          <p className="mt-2 flex items-center justify-between text-[13px] text-ink-subtle">
                            <span>{c.who === 'dev' ? t({ en: 'Developer', fa: 'برنامه‌نویس' }) : t({ en: 'Designer', fa: 'طراح' })}</span>
                            <span className="tabular">{t({ en: `${c.points} pts`, fa: `${num(c.points)} امتیاز` })}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  )
}
