import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Alert02Icon,
  BankIcon,
  Cancel01Icon,
  Clock01Icon,
  Copy01Icon,
  IdIcon,
  Invoice01Icon,
  MoneyReceive02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, ButtonLink, Card, Chip, CountUp, EmptyState, Icon, KeyValue, SegmentedControl, Sheet, StatusPill, TextField, useToast } from '../../components/ui'
import { payments, type Payment } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatDate, formatNumber, formatTime, formatToman, toEnDigits, toFaDigits } from '../../lib/format'
import { useApp } from '../../store/AppStore'

const BALANCE = 18_000_000

const statusMeta = {
  success: { label: 'تراکنش موفق', tone: 'success' as const },
  failed: { label: 'تراکنش ناموفق', tone: 'danger' as const },
  pending: { label: 'در انتظار تأیید', tone: 'warning' as const },
}

function PaymentCard({ p }: { p: Payment }) {
  const m = statusMeta[p.status]
  const toast = useToast()
  return (
    <article className="rounded-[16px] border border-stroke bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-6">{p.title}</h3>
        <StatusPill tone={m.tone}>{m.label}</StatusPill>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className={cn('text-lg font-extrabold tabular', p.direction === 'in' && 'text-success')}>
          {p.direction === 'in' ? '+' : ''}
          {formatToman(p.amount)}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-fg-subtle tabular">
          <Icon icon={Clock01Icon} size={14} />
          {formatDate(p.at)} | {formatTime(p.at)}
        </p>
      </div>
      {p.status === 'success' ? (
        <button type="button" onClick={() => toast.show('فاکتور دانلود شد.', { tone: 'info' })} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-surface-sunken text-sm font-bold hover:bg-surface-raised">
          <Icon icon={Invoice01Icon} size={18} /> مشاهده فاکتور
        </button>
      ) : (
        <p className="mt-3 flex gap-2 rounded-[12px] bg-surface-sunken p-3 text-xs leading-5 text-fg-muted">
          <Icon icon={Alert02Icon} size={16} className={p.status === 'failed' ? 'text-danger' : 'text-warning'} />
          {p.status === 'failed' ? 'چنانچه مبلغ از حسابتان کسر شده ولی صورتحساب پرداخت نشده است، مبلغ کسرشده تا ۴۸ ساعت آینده به حساب بانکی‌تان برمی‌گردد.' : 'تراکنش در حال بررسی توسط بانک است. معمولاً کمتر از ۳۰ دقیقه طول می‌کشد.'}
        </p>
      )}
    </article>
  )
}

function WithdrawSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useApp()
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const n = Number(toEnDigits(amount).replace(/\D/g, ''))
  const err = n > BALANCE ? 'بیشتر از موجودی قابل برداشت است.' : n > 0 && n < 100_000 ? 'حداقل برداشت ۱۰۰ هزار تومان است.' : ''

  if (!user?.verified) {
    return (
      <Sheet open={open} onClose={onClose} title="برداشت وجه">
        <EmptyState
          icon={IdIcon}
          title="اول احراز هویت کن"
          description="برای برداشت، کارت ملی و شماره شبای به نام خودت لازمه. کمتر از ۲ دقیقه طول می‌کشه."
          action={
            <ButtonLink to="/verify" size="lg">
              شروع احراز هویت
            </ButtonLink>
          }
        />
      </Sheet>
    )
  }
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="برداشت وجه"
      footer={
        <Button
          block
          size="lg"
          loading={loading}
          disabled={!n || !!err}
          onClick={() => {
            setLoading(true)
            window.setTimeout(() => {
              setLoading(false)
              onClose()
              setAmount('')
              toast.show(`درخواست برداشت ${formatToman(n)} ثبت شد. واریز در اولین سیکل پایا.`)
            }, 800)
          }}
        >
          ثبت درخواست برداشت
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between rounded-[14px] bg-surface p-4 text-sm">
          <span className="text-fg-muted">قابل برداشت</span>
          <span className="font-extrabold text-success tabular">{formatToman(BALANCE)}</span>
        </div>
        <TextField
          label="مبلغ برداشت (تومان)"
          inputMode="numeric"
          dir="ltr"
          className="text-left text-lg font-bold tabular"
          value={n ? formatNumber(n) : ''}
          onChange={(e) => setAmount(e.target.value)}
          error={err}
          autoFocus
        />
        <div className="flex gap-2">
          {[25, 50, 100].map((pct) => (
            <Chip key={pct} selected={n === Math.floor((BALANCE * pct) / 100)} onClick={() => setAmount(String(Math.floor((BALANCE * pct) / 100)))}>
              {pct === 100 ? 'همه' : `${toFaDigits(pct)}٪`}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-[14px] border border-stroke bg-surface p-4">
          <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={BankIcon} size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold">بانک سامان</p>
            <p dir="ltr" className="text-end text-xs text-fg-subtle tabular">
              IR06 •••• •••• 0001
            </p>
          </div>
          <StatusPill tone="success">تأیید شده</StatusPill>
        </div>
      </div>
    </Sheet>
  )
}

/** Payment history + Income history (4 frames in Figma) + withdraw flow. */
export function Wallet() {
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState<'out' | 'in'>('out')
  const list = payments.filter((p) => p.direction === tab)
  const withdraw = params.get('withdraw') === '1'

  return (
    <>
      <AppHeader title="کیف پول" />
      <Screen title="کیف پول">
        <Card tone="glow" className="overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade opacity-40" />
          <div className="relative text-center">
            <p className="text-xs text-fg-muted">قابل برداشت</p>
            <p className="mt-2 text-3xl font-extrabold">
              <CountUp value={BALANCE} /> <span className="text-sm font-medium text-fg-muted">تومان</span>
            </p>
            <p className="mt-1 text-xs text-fg-subtle">{formatToman(20_000_000)} در ضمانت لنس</p>
            <Button className="mt-5" iconStart={MoneyReceive02Icon} onClick={() => setParams({ withdraw: '1' })}>
              برداشت
            </Button>
          </div>
        </Card>
        <SegmentedControl
          className="mt-5"
          label="نوع تراکنش"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'out', label: 'پرداختی‌ها' },
            { value: 'in', label: 'درآمدها' },
          ]}
        />
        <AnimatePresence mode="wait">
          <motion.ul key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-col gap-3">
            {list.map((p) => (
              <li key={p.id}>
                <PaymentCard p={p} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </Screen>
      <WithdrawSheet open={withdraw} onClose={() => setParams({})} />
    </>
  )
}

/** «22/23 · Successful / Unsuccessful Payment» — one screen, two states, real receipt. */
export function PaymentResult() {
  const { status } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { setPlus } = useApp()
  const ok = status !== 'failed'
  const purpose = params.get('for')
  const amount = purpose === 'plus' ? 1_249_000 : purpose === 'release' ? 20_000_000 : 7_000_000
  const ref = '33562342819821'
  const now = new Date()

  useEffect(() => {
    if (ok && purpose === 'plus') setPlus(true)
  }, [ok, purpose, setPlus])

  return (
    <Screen
      title={ok ? 'پرداخت موفق' : 'پرداخت ناموفق'}
      className="relative flex flex-col items-center pt-16"
      footer={
        <div className="flex flex-col gap-2">
          {!ok && (
            <Button block size="lg" onClick={() => navigate('/app/payment/success')}>
              تلاش مجدد
            </Button>
          )}
          <Button block size="lg" variant={ok ? 'primary' : 'secondary'} onClick={() => navigate(purpose === 'plus' ? '/app' : '/app/projects', { replace: true })}>
            بازگشت
          </Button>
        </div>
      }
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-80 bg-dots bg-dots-fade" />
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={cn('relative grid size-20 place-items-center rounded-full ring-8', ok ? 'bg-success text-on-primary ring-success/15' : 'bg-danger text-white ring-danger/15')}
      >
        <Icon icon={ok ? Tick02Icon : Cancel01Icon} size={36} strokeWidth={2.5} />
      </motion.span>
      <h1 className="relative mt-6 text-xl font-extrabold">{ok ? 'پرداخت شما با موفقیت انجام شد' : 'پرداخت انجام نشد'}</h1>
      {!ok && <p className="relative mt-2 text-center text-sm text-fg-muted">اگر مبلغی کسر شده، تا ۴۸ ساعت به حسابتان برمی‌گردد.</p>}
      <motion.dl initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mt-8 w-full divide-y divide-stroke rounded-[18px] border border-stroke bg-surface px-4">
        <KeyValue k="مبلغ پرداخت شده" v={formatToman(amount)} />
        <KeyValue k="زمان پرداخت" v={`${formatDate(now)} | ${formatTime(now)}`} />
        <KeyValue k="نوع پرداخت" v="درگاه بانکی" />
        <KeyValue
          k="شماره ارجاع"
          v={
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(ref).then(() => toast.show('شماره ارجاع کپی شد.'))}
              className="inline-flex items-center gap-1.5 hover:text-primary"
              aria-label="کپی شماره ارجاع"
            >
              {toFaDigits(ref)}
              <Icon icon={Copy01Icon} size={16} />
            </button>
          }
        />
      </motion.dl>
      <Link to="/app/wallet" className="relative mt-4 text-xs font-bold text-primary">
        مشاهده تاریخچه پرداخت‌ها
      </Link>
    </Screen>
  )
}
