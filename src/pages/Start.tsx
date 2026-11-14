import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft01Icon, ArrowRight01Icon, Briefcase01Icon, BookOpen01Icon, Search01Icon, SparklesIcon, Task01Icon, UserAdd01Icon, Wallet01Icon } from '@hugeicons/core-free-icons'
import { Knight, type KnightId } from '../brand/Knights'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { Bar, GuideCard, Vignette } from '../ui/cards'
import { Button, cn, Container, Field, inputCls, PageHeader, type IconSvgElement } from '../ui/core'
import { Steps } from '../ui/steps'

type Path = 'work' | 'hire' | 'learn' | 'agents'
const PATHS: { id: Path; who: KnightId; title: Bi; line: Bi; home: string }[] = [
  { id: 'work', who: 'scout', title: { en: 'I want work', fa: 'دنبال کارم' }, line: { en: 'See jobs from every site that fit your skills.', fa: 'آگهی‌های همه‌ی سایت‌ها که به مهارتت می‌خوره رو ببین.' }, home: '/work' },
  { id: 'hire', who: 'merlin', title: { en: 'I want to hire', fa: 'می‌خوام استخدام کنم' }, line: { en: 'Post a project with a fair price, or have it run for you.', fa: 'پروژه‌ت رو با قیمت منصفانه ثبت کن، یا بسپارش که برات جلو ببرن.' }, home: '/hire' },
  { id: 'learn', who: 'scribe', title: { en: 'I’m just starting', fa: 'تازه دارم شروع می‌کنم' }, line: { en: 'Free paths from first lesson to first client.', fa: 'مسیرهای رایگان از درس اول تا اولین کارفرما.' }, home: '/learn' },
  { id: 'agents', who: 'steward', title: { en: 'I want help with routine work', fa: 'برای کارهای تکراری کمک می‌خوام' }, line: { en: 'Hand proposals, CVs and sprint plans to an agent.', fa: 'پیشنهاد، رزومه و برنامه‌ی اسپرینت رو بسپار به دستیار.' }, home: '/agents' },
]

const GUIDES: Record<Path, { icon: IconSvgElement; title: Bi; line: Bi }[]> = {
  work: [
    { icon: Search01Icon, title: { en: 'Tell the Scout your skills', fa: 'مهارت‌هات رو به پیشاهنگ بگو' }, line: { en: 'Three is enough to start. You can change them any time.', fa: 'سه تا برای شروع کافیه؛ هر وقت خواستی عوضشون کن.' } },
    { icon: UserAdd01Icon, title: { en: 'Add one piece to Showcase', fa: 'یه نمونه‌کار به ویترین اضافه کن' }, line: { en: 'Clients look at your work before they read your message.', fa: 'کارفرماها قبل از خوندن پیامت، کارت رو نگاه می‌کنن.' } },
    { icon: SparklesIcon, title: { en: 'Let the Herald draft', fa: 'بذار جارچی پیش‌نویس کنه' }, line: { en: 'You edit and send. It never sends for you.', fa: 'ویرایش و ارسال با خودته؛ هیچ‌وقت به جات نمی‌فرسته.' } },
  ],
  hire: [
    { icon: Briefcase01Icon, title: { en: 'Describe the work', fa: 'کار رو تعریف کن' }, line: { en: 'Who it’s for and what “done” means. Four short steps.', fa: 'برای کیه و «تموم شده» یعنی چی؛ چهار مرحله‌ی کوتاه.' } },
    { icon: Wallet01Icon, title: { en: 'Let Merlin price it', fa: 'قیمت رو از مرلین بپرس' }, line: { en: 'A fair range, with the reasons written out.', fa: 'یه بازه‌ی منصفانه، با دلیل‌هاش.' } },
    { icon: Task01Icon, title: { en: 'Pay into escrow', fa: 'پول رو به امانت بسپار' }, line: { en: 'It is released only when you approve the work.', fa: 'فقط وقتی کار رو تأیید کنی آزاد می‌شه.' } },
  ],
  learn: [
    { icon: BookOpen01Icon, title: { en: 'Pick a free path', fa: 'یه مسیر رایگان انتخاب کن' }, line: { en: 'Design or web development, six or seven lessons.', fa: 'طراحی یا برنامه‌نویسی وب، شش هفت درس.' } },
    { icon: UserAdd01Icon, title: { en: 'Make one real piece', fa: 'یه نمونه‌کار واقعی بساز' }, line: { en: 'Every path ends with something you can show.', fa: 'آخر هر مسیر یه چیزی داری که نشونش بدی.' } },
    { icon: SparklesIcon, title: { en: 'Send your first proposal', fa: 'اولین پیشنهادت رو بفرست' }, line: { en: 'With a price from Merlin and a draft from the Herald.', fa: 'با قیمتی از مرلین و پیش‌نویسی از جارچی.' } },
  ],
  agents: [
    { icon: SparklesIcon, title: { en: 'Choose a knight', fa: 'یه شوالیه انتخاب کن' }, line: { en: 'Each does one job. Start with the one you need today.', fa: 'هر کدوم یه کار انجام می‌ده؛ با همونی شروع کن که امروز لازم داری.' } },
    { icon: Task01Icon, title: { en: 'Give it a brief', fa: 'بهش بریف بده' }, line: { en: 'It shows its plan before it starts.', fa: 'قبل از شروع، برنامه‌ش رو نشون می‌ده.' } },
    { icon: Search01Icon, title: { en: 'Review, then ship', fa: 'بررسی کن، بعد منتشر کن' }, line: { en: 'Nothing leaves your account without you.', fa: 'هیچ‌چیز بدون تو از حسابت بیرون نمی‌ره.' } },
  ],
}

/** Onboarding: one question, three guide cards, then (only then) an account. */
export function Start() {
  useTitle({ en: 'Start', fa: 'شروع' })
  const { t, to, lang } = useLocale()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [path, setPath] = useState<Path | null>(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const p = PATHS.find((x) => x.id === path)
  const steps = [t({ en: 'Your goal', fa: 'هدفت' }), t({ en: 'How it works', fa: 'روال کار' }), t({ en: 'Your account', fa: 'حساب کاربری' })]
  return (
    <Container>
      <PageHeader title={t({ en: 'What brings you to Lance?', fa: 'برای چی اومدی لنس؟' })} lead={t({ en: 'One question, three short cards, and you’re in. You can change your answer later.', fa: 'یه سؤال، سه تا کارت کوتاه، و تمام. بعداً هم می‌تونی جوابت رو عوض کنی.' })} className="text-center [&>div]:justify-center [&_p]:mx-auto" />
      <Steps steps={steps} current={step} onJump={setStep} className="mx-auto mb-12 max-w-[560px]" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, x: lang === 'fa' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {step === 0 && (
            <div role="radiogroup" aria-label={t({ en: 'Your goal', fa: 'هدفت' })} className="mx-auto grid max-w-[920px] gap-4 sm:grid-cols-2">
              {PATHS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={path === x.id}
                  onClick={() => {
                    setPath(x.id)
                    setStep(1)
                  }}
                  className={cn('lift flex items-center gap-5 rounded-lg border bg-surface p-5 text-start', path === x.id ? 'rail border-cobalt' : 'border-line')}
                >
                  <Knight who={x.who} label="" className="h-24 w-20 shrink-0" />
                  <span>
                    <span className="heading block text-[20px]">{t(x.title)}</span>
                    <span className="mt-1 block text-[15px] text-ink-muted">{t(x.line)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {step === 1 && path && (
            <>
              <div className="grid gap-4 lg:grid-cols-3">
                {GUIDES[path].map((g, i) => (
                  <GuideCard
                    key={g.title.en}
                    icon={g.icon}
                    tone={i === 1 ? 'gilt' : 'cobalt'}
                    step={lang === 'fa' ? `کارت ${['۱', '۲', '۳'][i]}` : `Card ${['I', 'II', 'III'][i]}`}
                    title={t(g.title)}
                    line={t(g.line)}
                    vignette={
                      <Vignette>
                        <Bar w={['70%', '55%', '80%'][i]} tone={i === 1 ? 'gilt' : 'cobalt'} />
                        <Bar w="90%" />
                        <Bar w="60%" />
                      </Vignette>
                    }
                  />
                ))}
              </div>
              <div className="mt-10 flex justify-between">
                <Button variant="ghost" icon={ArrowLeft01Icon} directional onClick={() => setStep(0)}>
                  {t({ en: 'Back', fa: 'قبلی' })}
                </Button>
                <Button iconEnd={ArrowRight01Icon} directional onClick={() => setStep(2)}>
                  {t({ en: 'Makes sense', fa: 'متوجه شدم' })}
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <form
              className="mx-auto flex max-w-[460px] flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault()
                if (name.trim().length < 2 || contact.trim().length < 5) return
                navigate(to(p?.home ?? '/'))
              }}
            >
              <Field label={t({ en: 'Your name', fa: 'اسمت' })}>{(f) => <input id={f.id} required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={cn(inputCls, 'h-12')} />}</Field>
              <Field label={t({ en: 'Email or mobile number', fa: 'ایمیل یا شماره موبایل' })} help={t({ en: 'We send a 4-digit code. No password needed.', fa: 'یه کد چهاررقمی می‌فرستیم؛ رمز عبور لازم نیست.' })}>
                {(f) => <input id={f.id} aria-describedby={f.describedBy} required dir="ltr" autoComplete="username" value={contact} onChange={(e) => setContact(e.target.value)} className={cn(inputCls, 'h-12 text-start')} spellCheck={false} />}
              </Field>
              <Button type="submit" size="lg" block disabled={name.trim().length < 2 || contact.trim().length < 5}>
                {t({ en: 'Send my code', fa: 'کد رو بفرست' })}
              </Button>
              <button type="button" onClick={() => navigate(to(p?.home ?? '/'))} className="text-[15px] text-ink-muted underline underline-offset-4">
                {t({ en: 'Look around first', fa: 'اول یه نگاهی بندازم' })}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  )
}

export function SignIn() {
  useTitle({ en: 'Sign in', fa: 'ورود' })
  const { t } = useLocale()
  const [v, setV] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <Container narrow className="max-w-[460px] py-16">
      <h1 className="display text-[clamp(2rem,4vw,2.75rem)]">{t({ en: 'Sign in', fa: 'ورود' })}</h1>
      <p className="mt-3 text-ink-muted">{t({ en: 'We’ll send a 4-digit code. No password to remember.', fa: 'یه کد چهاررقمی برات می‌فرستیم. رمزی لازم نیست حفظ کنی.' })}</p>
      <form
        className="mt-8 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (v.trim().length >= 5) setSent(true)
        }}
      >
        <Field label={t({ en: 'Email or mobile number', fa: 'ایمیل یا شماره موبایل' })} error={false}>
          {(f) => <input id={f.id} required dir="ltr" autoComplete="username" value={v} onChange={(e) => setV(e.target.value)} className={cn(inputCls, 'h-12 text-start')} spellCheck={false} />}
        </Field>
        <Button type="submit" size="lg" block disabled={sent}>
          {sent ? t({ en: 'Code sent, check your messages', fa: 'کد فرستاده شد؛ پیام‌هات رو چک کن' }) : t({ en: 'Send my code', fa: 'کد رو بفرست' })}
        </Button>
      </form>
    </Container>
  )
}
