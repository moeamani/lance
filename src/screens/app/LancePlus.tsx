import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckmarkBadge01Icon, FlashIcon, Rocket01Icon, SparklesIcon, Tick02Icon, Coins01Icon, Crown02Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, Icon, Logo, RadioCard, Tag } from '../../components/ui'
import { formatNumber, formatToman } from '../../lib/format'
import { useApp } from '../../store/AppStore'

const features = [
  { icon: Rocket01Icon, t: 'پیشنهاد نامحدود', d: 'روی هر تعداد پروژه که خواستی پیشنهاد بده؛ بدون سقف ماهانه.' },
  { icon: CheckmarkBadge01Icon, t: 'نشان ویژه پلاس', d: 'پروفایل و پیشنهادهات با نشان پلاس بالاتر از بقیه نمایش داده می‌شن.' },
  { icon: Coins01Icon, t: 'کارمزد کمتر', d: 'کارمزد هر تراکنش از ۱۰٪ به ۷٪ کاهش پیدا می‌کنه.' },
  { icon: FlashIcon, t: 'اعلان فوری پروژه‌ها', d: 'پروژه‌های مرتبط با مهارتت رو زودتر از همه ببین.' },
]

const plans = [
  { id: 'monthly', label: 'ماهانه', price: 249_000, per: 'ماه' },
  { id: 'yearly', label: 'سالانه', price: 1_249_000, per: 'سال', save: 58 },
] as const

/** «20 · Lance Plus Page» with real feature copy instead of «فیچر اول … چهارم». */
export function LancePlus() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly')
  const sel = plans.find((p) => p.id === plan)!
  const [loading, setLoading] = useState(false)

  return (
    <>
      <AppHeader transparent />
      <Screen
        title="لنس پلاس"
        footer={
          user?.plus ? (
            <Button block size="lg" variant="secondary" disabled>
              اشتراک پلاس شما فعال است
            </Button>
          ) : (
            <Button
              block
              size="lg"
              loading={loading}
              iconStart={Crown02Icon}
              onClick={() => {
                setLoading(true)
                window.setTimeout(() => navigate('/app/payment/success?for=plus'), 900)
              }}
            >
              خرید اشتراک {sel.label} · {formatToman(sel.price)}
            </Button>
          )
        }
      >
        <div className="relative -mt-4 mb-6 grid h-52 place-items-center overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute text-primary"
              style={{ top: `${(i * 37) % 90}%`, left: `${(i * 61) % 95}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1, 0.6] }}
              transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
            >
              <Icon icon={SparklesIcon} size={i % 3 === 0 ? 18 : 10} className={i % 2 ? 'text-white/70' : ''} />
            </motion.span>
          ))}
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} className="relative flex flex-col items-center gap-3 drop-shadow-[0_0_30px_#ff7fe366]">
            <Logo height={64} />
            <Tag className="h-7 px-3 text-sm">پلاس</Tag>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3" role="radiogroup" aria-label="طرح اشتراک">
          {plans.map((p) => (
            <RadioCard
              key={p.id}
              name="plan"
              selected={plan === p.id}
              onSelect={() => setPlan(p.id)}
              title={p.label}
              description={'save' in p ? `${formatNumber(p.save)}٪ صرفه‌جویی نسبت به ماهانه` : 'لغو در هر زمان'}
              end={
                <span className="text-end">
                  <span className="block font-extrabold tabular">{formatToman(p.price)}</span>
                  <span className="text-xs text-fg-subtle">/ {p.per}</span>
                </span>
              }
            />
          ))}
        </div>

        <h2 className="mt-8 mb-4 text-center text-xl font-extrabold">ویژگی‌ها</h2>
        <ul className="flex flex-col divide-y divide-stroke rounded-[18px] border border-stroke bg-surface">
          {features.map((f, i) => (
            <motion.li key={f.t} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex gap-4 p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon icon={f.icon} size={24} />
              </span>
              <div>
                <p className="font-extrabold">{f.t}</p>
                <p className="mt-1 text-xs leading-6 text-fg-muted">{f.d}</p>
              </div>
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-fg-subtle">
          <Icon icon={Tick02Icon} size={14} /> بدون تمدید خودکار · پرداخت امن از درگاه بانکی
        </p>
      </Screen>
    </>
  )
}
