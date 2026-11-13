import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  LockPasswordIcon,
  SmartPhone01Icon,
  UserIcon,
  Rocket01Icon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, Icon, Logo, OtpInput, PasswordField, PhoneField, RadioCard, Sheet, TextField, useToast } from '../../components/ui'
import { cn } from '../../lib/cn'
import { formatNumber, maskMobile, toFaDigits } from '../../lib/format'
import { normalizeMobile, PASSWORD_RULES, passwordStrength, validateMobile, validateName } from '../../lib/validate'
import { useApp, type Role } from '../../store/AppStore'
import loginBg from '../../assets/brand/login-bg.png'

/** Demo: any code works except 0000 (shows the error state). */
const DEMO_BAD_CODE = '0000'

function AuthHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center pt-4 pb-10 text-center">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Logo height={34} />
      </motion.div>
      <h1 className="mt-6 text-2xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>}
    </div>
  )
}

function useCountdown(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (!running) return
    setLeft(seconds)
    const t = window.setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000)
    return () => window.clearInterval(t)
  }, [running, seconds])
  return [left, () => setLeft(seconds)] as const
}

/**
 * OTP bottom sheet (Figma: «OTP Verification Modal»). Adds a resend
 * countdown, auto-submit on the 4th digit, and the masked number.
 */
function OtpSheet({ open, phone, onClose, onVerified }: { open: boolean; phone: string; onClose: () => void; onVerified: () => void }) {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'checking' | 'error' | 'ok'>('idle')
  const [left, reset] = useCountdown(120, open)
  const toast = useToast()

  useEffect(() => {
    if (open) {
      setCode('')
      setState('idle')
    }
  }, [open])

  const verify = (c = code) => {
    if (c.length < 4) return
    setState('checking')
    window.setTimeout(() => {
      if (c === DEMO_BAD_CODE) {
        setState('error')
        return
      }
      setState('ok')
      window.setTimeout(onVerified, 450)
    }, 700)
  }

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="کد تایید"
      footer={
        <Button block size="lg" loading={state === 'checking'} disabled={code.length < 4 || state === 'ok'} onClick={() => verify()}>
          {state === 'ok' ? 'تایید شد' : 'تایید'}
        </Button>
      }
    >
      <p className="text-sm leading-7 text-fg-muted">
        کد ۴ رقمی ارسال‌شده به شماره{' '}
        <bdi dir="ltr" className="font-bold text-fg tabular">
          {maskMobile(phone)}
        </bdi>{' '}
        را وارد کنید.
      </p>
      <div className="my-6">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v)
            if (state === 'error') setState('idle')
          }}
          onComplete={verify}
          error={state === 'error'}
          success={state === 'ok'}
          autoFocus
        />
        <AnimatePresence>
          {state === 'error' && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mt-3 text-center text-xs text-danger">
              کد وارد شده صحیح نمی‌باشد.
            </motion.p>
          )}
        </AnimatePresence>
        <p className="mt-3 text-center text-[11px] text-fg-subtle">برای دمو: هر کدی جز {toFaDigits('0000')} پذیرفته می‌شود.</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-fg-muted">شماره را اشتباه وارد کرده‌اید؟</span>
        <button type="button" onClick={onClose} className="font-bold text-primary underline underline-offset-4">
          تغییر شماره
        </button>
      </div>
      <button
        type="button"
        disabled={left > 0}
        onClick={() => {
          reset()
          toast.show('کد جدید ارسال شد.', { tone: 'info' })
        }}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-surface text-sm font-bold text-primary disabled:text-fg-subtle"
      >
        ارسال مجدد کد تایید
        {left > 0 && <span className="tabular">({toFaDigits(`${mm}:${ss}`)})</span>}
      </button>
    </Sheet>
  )
}

export function SignUp() {
  const navigate = useNavigate()
  const { signIn } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(true)
  const [touched, setTouched] = useState(false)
  const [otp, setOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  const nameV = validateName(name)
  const phoneV = validateMobile(phone)
  const valid = nameV.ok && phoneV.ok && agree

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setOtp(true)
    }, 600)
  }

  return (
    <>
      <AppHeader leading="close" backTo="/" transparent />
      <form onSubmit={submit} className="flex flex-1 flex-col" noValidate>
        <Screen
          title="ثبت نام"
          footer={
            <Button type="submit" block size="lg" loading={loading}>
              ارسال کد تایید
            </Button>
          }
        >
          <AuthHero title="ثبت نام" subtitle="یه حساب بساز و اولین پروژه‌ت رو امروز شروع کن." />
          <div className="flex flex-col gap-5">
            <TextField
              label="نام و نام خانوادگی"
              placeholder="اسمت چیه؟"
              iconStart={UserIcon}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={touched && !nameV.ok && nameV.message}
            />
            <PhoneField label="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)} error={touched && !phoneV.ok && phoneV.message} />
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-fg-muted">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-5 accent-[var(--color-primary)]" />
              <span>
                با ثبت نام، با تمامی{' '}
                <Link to="/app/settings/policy" className="font-bold text-primary underline underline-offset-4">
                  قوانین لنس
                </Link>{' '}
                موافقت می‌کنم.
              </span>
            </label>
            {touched && !agree && <p className="text-xs text-danger">برای ادامه باید قوانین را بپذیرید.</p>}
          </div>
          <p className="mt-8 text-center text-sm text-fg-muted">
            حساب داری؟{' '}
            <Link to="/auth/login" className="font-bold text-primary">
              وارد شو
            </Link>
          </p>
        </Screen>
      </form>
      <OtpSheet
        open={otp}
        phone={phone}
        onClose={() => setOtp(false)}
        onVerified={() => {
          setOtp(false)
          signIn({ name, phone: normalizeMobile(phone) })
          navigate('/auth/password')
        }}
      />
    </>
  )
}

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useApp()
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)
  const [otp, setOtp] = useState(false)
  const v = validateMobile(phone)
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Photo backdrop from «04 · Onboarding / OTP & Role Selection» */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <img src={loginBg} alt="" className="size-full object-cover opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg" />
      </div>
      <AppHeader leading="close" backTo="/" transparent className="relative" />
      <form
        className="relative flex flex-1 flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (v.ok) setOtp(true)
        }}
      >
        <Screen
          title="ورود"
          footer={
            <div className="flex flex-col gap-3">
              <Button type="submit" block size="lg">
                ارسال کد تایید
              </Button>
              <p className="text-center text-sm text-fg-muted">
                حساب نداری؟{' '}
                <Link to="/auth/signup" className="font-bold text-primary">
                  ثبت نام
                </Link>
              </p>
            </div>
          }
        >
          <AuthHero title="ورود" subtitle="خوشحالیم که برگشتی 👋" />
          <PhoneField label="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)} error={touched && !v.ok && v.message} autoFocus />
          <Link to="/auth/login/password" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-[12px] border border-stroke bg-surface text-sm font-bold hover:border-stroke-strong">
            <Icon icon={LockPasswordIcon} size={18} />
            ورود با رمز عبور
          </Link>
        </Screen>
      </form>
      <OtpSheet
        open={otp}
        phone={phone}
        onClose={() => setOtp(false)}
        onVerified={() => {
          signIn({ phone: normalizeMobile(phone) })
          navigate(from, { replace: true })
        }}
      />
    </div>
  )
}

export function LoginPassword() {
  const navigate = useNavigate()
  const { signIn } = useApp()
  const [phone, setPhone] = useState('')
  const [pw, setPw] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const v = validateMobile(phone)
  return (
    <>
      <AppHeader leading="back" backTo="/auth/login" transparent />
      <form
        className="flex flex-1 flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (!v.ok || !pw) return
          setLoading(true)
          window.setTimeout(() => {
            signIn({ phone: normalizeMobile(phone) })
            navigate('/app', { replace: true })
          }, 700)
        }}
      >
        <Screen
          title="ورود با رمز عبور"
          footer={
            <Button type="submit" block size="lg" loading={loading}>
              ورود
            </Button>
          }
        >
          <AuthHero title="ورود" />
          <div className="flex flex-col gap-5">
            <PhoneField label="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)} error={touched && !v.ok && v.message} />
            <PasswordField
              label="رمز عبور"
              placeholder="رمز عبور"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              error={touched && !pw && 'رمز عبور را وارد کنید.'}
              labelAction={
                <button type="button" onClick={() => toast.show('لینک بازیابی به موبایلت پیامک شد.', { tone: 'info' })} className="text-xs font-bold text-primary underline underline-offset-4">
                  فراموشی رمز عبور
                </button>
              }
            />
            <Link to="/auth/login" className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-stroke bg-surface text-sm font-bold hover:border-stroke-strong">
              <Icon icon={SmartPhone01Icon} size={18} />
              ورود با کد یکبار مصرف
            </Link>
          </div>
        </Screen>
      </form>
    </>
  )
}

/** Live password checklist — replaces the four static coloured hints in Figma. */
export function CreatePassword() {
  const navigate = useNavigate()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [touched, setTouched] = useState(false)
  const strength = passwordStrength(pw)
  const match = pw.length > 0 && pw === pw2
  const valid = strength >= 3 && match
  const meter = ['bg-stroke', 'bg-danger', 'bg-warning', 'bg-warning', 'bg-success'][strength]
  const meterLabel = ['', 'ضعیف', 'متوسط', 'خوب', 'قوی'][strength]

  return (
    <>
      <AppHeader leading="close" backTo="/" transparent />
      <form
        className="flex flex-1 flex-col"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setTouched(true)
          if (valid) navigate('/auth/role')
        }}
      >
        <Screen
          title="رمز عبور"
          footer={
            <div className="flex flex-col gap-2">
              <Button type="submit" block size="lg">
                تایید
              </Button>
              <Button variant="ghost" block onClick={() => navigate('/auth/role')}>
                بعداً تنظیم می‌کنم
              </Button>
            </div>
          }
        >
          <AuthHero title="رمز عبور" subtitle="یه رمز امن برای ورودهای بعدی بساز." />
          <div className="flex flex-col gap-5">
            <PasswordField label="رمز عبور" placeholder="رمز عبور خود را وارد کنید" value={pw} onChange={(e) => setPw(e.target.value)} />
            <div aria-live="polite">
              <div className="flex gap-1.5" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <motion.span key={i} className={cn('h-1.5 flex-1 rounded-full', i < strength ? meter : 'bg-stroke')} animate={{ opacity: i < strength ? 1 : 0.6 }} />
                ))}
              </div>
              {strength > 0 && <p className="mt-2 text-xs text-fg-muted">قدرت رمز: {meterLabel}</p>}
            </div>
            <ul className="flex flex-col gap-2.5">
              {PASSWORD_RULES.map((r) => {
                const ok = r.test(pw)
                return (
                  <li key={r.id} className={cn('flex items-center gap-2 text-xs transition-colors', ok ? 'text-success' : 'text-fg-muted')}>
                    <motion.span animate={{ scale: ok ? [1, 1.3, 1] : 1 }} className={cn('grid size-5 place-items-center rounded-full', ok ? 'bg-success text-on-primary' : 'border border-stroke-strong')}>
                      {ok && <Icon icon={CheckmarkCircle02Icon} size={14} />}
                    </motion.span>
                    {r.label}
                  </li>
                )
              })}
            </ul>
            <PasswordField
              label="تکرار رمز عبور"
              placeholder="تکرار رمز عبور"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              error={touched && !match && 'رمزها یکسان نیستند.'}
              hint={match ? '✓ رمزها یکسان هستند' : undefined}
            />
            {touched && strength < 3 && <p className="text-xs text-danger">حداقل ۳ مورد از شرایط بالا را رعایت کنید.</p>}
          </div>
        </Screen>
      </form>
    </>
  )
}

function PathIcon({ icon, tone }: { icon: typeof Briefcase01Icon; tone: string }) {
  return (
    <span className={cn('relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[16px]', tone)}>
      <span className="absolute inset-0 bg-dots opacity-50" />
      <Icon icon={icon} size={28} className="relative" />
    </span>
  )
}

export function ChoosePath() {
  const navigate = useNavigate()
  const { role, setRole } = useApp()
  const [choice, setChoice] = useState<Role | null>(null)
  return (
    <div className="relative flex flex-1 flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
        <img src={loginBg} alt="" className="size-full object-cover opacity-25 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg" />
      </div>
      <AppHeader leading="close" backTo="/" transparent className="relative" />
      <Screen
        className="relative"
        title="انتخاب مسیر"
        footer={
          <Button
            block
            size="lg"
            disabled={!choice}
            onClick={() => {
              if (!choice) return
              setRole(choice)
              navigate('/auth/welcome')
            }}
          >
            {choice ? 'تأیید و ادامه' : 'یکی از گزینه‌ها رو انتخاب کن'}
          </Button>
        }
      >
        <h1 className="pt-6 pb-2 text-center text-2xl font-extrabold">میخوای تو لنس چیکار کنی؟</h1>
        <p className="mb-8 text-center text-sm text-fg-muted">بعداً از تنظیمات هم می‌تونی عوضش کنی.</p>
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="نقش">
          <RadioCard
            name="role"
            selected={choice === 'freelancer'}
            onSelect={() => setChoice('freelancer')}
            title="می‌خوام پروژه بگیرم"
            description="پروفایل بساز، روی پروژه‌ها پیشنهاد بده و امن تسویه کن."
            icon={<PathIcon icon={Rocket01Icon} tone="bg-primary-soft text-primary" />}
          />
          <RadioCard
            name="role"
            selected={choice === 'employer'}
            onSelect={() => setChoice('employer')}
            title="می‌خوام پروژه ثبت کنم"
            description="پروژه‌ات رو رایگان ثبت کن و بهترین لنسر رو انتخاب کن."
            icon={<PathIcon icon={Briefcase01Icon} tone="bg-info-soft text-info" />}
          />
        </div>
        {role && !choice && <p className="sr-only">نقش فعلی: {role === 'freelancer' ? 'لنسر' : 'کارفرما'}</p>}
      </Screen>
    </div>
  )
}

export function Welcome() {
  const navigate = useNavigate()
  const { role, user } = useApp()
  return (
    <>
      <Screen
        className="relative flex flex-col items-center justify-center overflow-hidden text-center"
        title="خوش آمدید"
        footer={
          <Button block size="lg" iconEnd={ArrowLeft01Icon} onClick={() => navigate(role === 'employer' ? '/projects/new' : '/app', { replace: true })}>
            {role === 'employer' ? 'ثبت اولین پروژه' : 'ادامه'}
          </Button>
        }
      >
        <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade" />
        <Confetti />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="relative grid size-24 place-items-center rounded-[28px] bg-primary-soft text-primary shadow-glow"
        >
          <Logo height={28} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative mt-8 text-2xl font-extrabold">
          {user?.name ? `${user.name.split(' ')[0]}، ` : ''}به لنس خوش آمدید!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="relative mt-3 max-w-[280px] text-sm leading-7 text-fg-muted">
          ثبت نام شما با موفقیت انجام شد.{' '}
          {role === 'employer' ? 'حالا اولین پروژه‌ات رو ثبت کن تا پیشنهادها برسن.' : `پروفایلت رو کامل کن تا ${formatNumber(3)} برابر بیشتر دیده بشی.`}
        </motion.p>
      </Screen>
    </>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 18 })
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute top-1/3 left-1/2 size-2 rounded-[2px]"
          style={{ background: ['#ff7fe3', '#7fffbf', '#ffe57f', '#7fbdff'][i % 4] }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: (Math.cos((i / pieces.length) * Math.PI * 2) * 160) | 0, y: (Math.sin((i / pieces.length) * Math.PI * 2) * 160 + 120) | 0, opacity: 0, rotate: 360 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 }}
        />
      ))}
    </div>
  )
}
