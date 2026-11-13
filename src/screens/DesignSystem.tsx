import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Add01Icon, ArrowLeft01Icon, Folder03Icon, Search01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../components/layout/AppHeader'
import {
  Accordion,
  Avatar,
  Button,
  Chip,
  CountBadge,
  Dialog,
  EmptyState,
  Icon,
  IconButton,
  OtpInput,
  PasswordField,
  PhoneField,
  ProgressBar,
  ProgressRing,
  RatingBadge,
  SegmentedControl,
  SelectSheet,
  Sheet,
  Skeleton,
  Slider,
  StarRating,
  StatusPill,
  StepTimeline,
  Switch,
  Tag,
  TextField,
  useToast,
} from '../components/ui'
import { Wallet01Icon, SecurityCheckIcon, Money03Icon } from '@hugeicons/core-free-icons'
import { formatToman } from '../lib/format'

const tokens = [
  ['primary', '#ff7fe3', 'Color/Primary/500'],
  ['primary-strong', '#ff66de', 'Button/Primary - Darker'],
  ['bg', '#0d0d0d', 'Background/Primary'],
  ['surface', '#1f1f1f', 'Cards/Primary'],
  ['surface-sunken', '#141414', 'Cards/Secondary'],
  ['stroke', '#303030', 'Cards/Primary - Stroke'],
  ['fg-muted', '#cccccc', 'Text/Primary - Elevated'],
  ['success', '#7fffbf', 'Intent/Success/500'],
  ['warning', '#ffe57f', 'Intent/Warning/500'],
  ['danger', '#ff4242', 'Intent/Danger/450'],
  ['info', '#7fbdff', 'Fills/Blue (solid)'],
]

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-stroke py-8">
      <h2 className="mb-4 text-xs font-bold tracking-wide text-fg-subtle">{title}</h2>
      {children}
    </section>
  )
}

/** Living style guide — every component, every state, rendered from code. */
export function DesignSystem() {
  const toast = useToast()
  const [seg, setSeg] = useState('a')
  const [otp, setOtp] = useState('12')
  const [slider, setSlider] = useState(5_000_000)
  const [stars, setStars] = useState(4)
  const [sw, setSw] = useState(true)
  const [sheet, setSheet] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [sel, setSel] = useState<string | null>(null)

  return (
    <>
      <AppHeader title="سیستم طراحی" subtitle="Lance UI · نسخه کد" backTo="/app/settings" />
      <main className="px-5 pb-20">
        <p className="text-sm leading-7 text-fg-muted">
          توکن‌ها یک‌به‌یک از متغیرهای فیگما (صفحه ۰۵ · Foundations) گرفته شده‌اند. هر کامپوننت حالت‌های فوکوس، غیرفعال، خطا و بارگذاری دارد و با کیبورد و صفحه‌خوان کار می‌کند.
        </p>

        <Block title="COLOR TOKENS">
          <div className="grid grid-cols-2 gap-2">
            {tokens.map(([name, hex, figma]) => (
              <div key={name} className="flex items-center gap-3 rounded-[12px] border border-stroke bg-surface p-2">
                <span className="size-10 shrink-0 rounded-[8px] border border-white/10" style={{ background: hex }} />
                <div className="min-w-0 text-[11px]">
                  <p className="font-bold">{name}</p>
                  <p dir="ltr" className="truncate text-end text-fg-subtle">
                    {hex} · {figma}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="TYPE SCALE (Peyda → Vazirmatn fallback)">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-extrabold">H1 · ۲۴ / ExtraBold</p>
            <p className="text-xl font-extrabold">H2 · ۲۰ / ExtraBold</p>
            <p className="text-base font-extrabold">H3 · ۱۶ / ExtraBold</p>
            <p className="text-sm font-bold">Medium Bold · ۱۴</p>
            <p className="text-sm">Medium Regular · ۱۴ — متن بدنه برای توضیحات</p>
            <p className="text-xs text-fg-muted">Caption · ۱۲</p>
          </div>
        </Block>

        <Block title="BUTTONS">
          <div className="flex flex-wrap gap-2">
            <Button>اصلی</Button>
            <Button variant="secondary">ثانویه</Button>
            <Button variant="outline">خطی</Button>
            <Button variant="ghost">متنی</Button>
            <Button variant="danger">حذف</Button>
            <Button loading>بارگذاری</Button>
            <Button disabled>غیرفعال</Button>
            <Button size="sm" iconStart={Add01Icon}>
              کوچک
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <IconButton icon={UserIcon} label="پروفایل" />
            <IconButton icon={Search01Icon} label="جستجو" variant="soft" />
            <IconButton icon={Folder03Icon} label="پروژه‌ها" dot />
          </div>
        </Block>

        <Block title="INPUTS">
          <div className="flex flex-col gap-4">
            <TextField label="متن" placeholder="اسمت چیه؟" iconStart={UserIcon} />
            <TextField label="خطا" defaultValue="ab" error="نام باید حداقل ۳ حرف باشد." />
            <PhoneField label="موبایل" />
            <PasswordField label="رمز عبور" placeholder="رمز عبور" />
            <SelectSheet label="انتخاب" placeholder="یک گزینه" options={[{ value: 'a', label: 'گزینه الف' }, { value: 'b', label: 'گزینه ب' }]} value={sel} onChange={setSel} />
            <OtpInput value={otp} onChange={setOtp} />
          </div>
        </Block>

        <Block title="SELECTION">
          <SegmentedControl label="نمونه" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'لنسر' }, { value: 'b', label: 'کارفرما' }, { value: 'c', label: 'هر دو', count: 3 }]} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip selected>انتخاب‌شده</Chip>
            <Chip>عادی</Chip>
            <Chip onRemove={() => toast.show('حذف شد')}>قابل حذف</Chip>
            <Switch checked={sw} onChange={setSw} label="سوییچ" />
          </div>
          <div className="mt-6 rounded-[14px] border border-stroke bg-surface p-4">
            <Slider label="بودجه" min={500_000} max={30_000_000} step={500_000} value={slider} onChange={setSlider} format={(n) => formatToman(n, { compact: true })} />
          </div>
          <div className="mt-6">
            <StarRating value={stars} onChange={setStars} />
          </div>
        </Block>

        <Block title="DATA DISPLAY">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>طراح رابط کاربری</Tag>
            <Tag tone="success">فعال</Tag>
            <Tag tone="danger">فوری</Tag>
            <StatusPill pulse>آنلاین</StatusPill>
            <StatusPill tone="warning">در انتظار</StatusPill>
            <CountBadge count={12} />
            <RatingBadge value={4.5} label="امتیاز" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Avatar name="محمد امانی" src="brand" size={56} online />
            <Avatar name="سارا احمدی" size={56} verified />
            <ProgressRing value={72} size={56} />
            <div className="flex-1">
              <ProgressBar value={60} />
            </div>
          </div>
          <StepTimeline
            className="mt-6"
            current={1}
            steps={[
              { label: 'پرداخت کارفرما', icon: Wallet01Icon },
              { label: 'در ضمانت لنس', icon: SecurityCheckIcon },
              { label: 'آزادسازی', icon: Money03Icon },
            ]}
          />
          <div className="mt-6 flex flex-col gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Block>

        <Block title="FEEDBACK & OVERLAYS">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => toast.show('ذخیره شد!', { action: { label: 'بازگردانی', onClick: () => {} } })}>
              Toast
            </Button>
            <Button variant="secondary" onClick={() => toast.show('خطایی رخ داد.', { tone: 'error' })}>
              Toast خطا
            </Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              Bottom sheet
            </Button>
            <Button variant="secondary" onClick={() => setDialog(true)}>
              Dialog
            </Button>
          </div>
          <Accordion className="mt-4" items={[{ id: '1', title: 'آکاردئون', content: 'محتوا با انیمیشن ارتفاع باز می‌شود.' }]} />
          <EmptyState icon={Folder03Icon} title="حالت خالی" description="هر لیست یک حالت خالی با اقدام بعدی دارد." action={<Button size="sm">اقدام</Button>} />
        </Block>

        <Link to="/app" className="inline-flex items-center gap-1 text-sm font-bold text-primary">
          رفتن به اپ <Icon icon={ArrowLeft01Icon} size={16} />
        </Link>
      </main>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Bottom sheet" footer={<Button block onClick={() => setSheet(false)}>تایید</Button>}>
        <p className="pb-6 text-sm leading-7 text-fg-muted">دسته را به پایین بکشید یا Esc را بزنید. فوکوس داخل شیت می‌ماند و بعد از بستن به دکمه برمی‌گردد.</p>
      </Sheet>
      <Dialog open={dialog} onClose={() => setDialog(false)} title="مطمئنی؟" description="این یک دیالوگ تأیید است." actions={<><Button variant="secondary" className="flex-1" onClick={() => setDialog(false)}>انصراف</Button><Button className="flex-1" onClick={() => setDialog(false)}>تایید</Button></>} />
    </>
  )
}

