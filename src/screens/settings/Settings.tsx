import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BankIcon,
  Briefcase01Icon,
  Call02Icon,
  Crown02Icon,
  Edit02Icon,
  IdIcon,
  InformationCircleIcon,
  LockPasswordIcon,
  Logout01Icon,
  Mail01Icon,
  Notification03Icon,
  Shield01Icon,
  Tick02Icon,
  UserIcon,
  UserSwitchIcon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Avatar, Button, Dialog, Icon, ListGroup, ListRow, Logo, SegmentedControl, StatusPill, Switch, TextField, useToast } from '../../components/ui'
import { me } from '../../data/mock'
import { maskMobile } from '../../lib/format'
import { useApp } from '../../store/AppStore'

function PoweredBy() {
  return (
    <p dir="ltr" className="mt-10 text-center text-xs text-fg-subtle">
      © Powered by <span className="font-bold text-warning">Syntex</span>
    </p>
  )
}

export function Settings() {
  const navigate = useNavigate()
  const { user, role, setRole, signOut } = useApp()
  const [confirm, setConfirm] = useState(false)
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(false)

  return (
    <>
      <AppHeader title="تنظیمات" />
      <Screen title="تنظیمات">
        <button type="button" onClick={() => navigate('/app/profile')} className="flex w-full items-center gap-3 rounded-[18px] border border-stroke bg-surface p-4 text-start hover:border-stroke-strong">
          <Avatar name={user?.name ?? me.name} src="brand" size={56} />
          <div className="flex-1">
            <p className="font-extrabold">{user?.name ?? me.name}</p>
            <p dir="ltr" className="text-end text-xs text-fg-subtle tabular">
              {maskMobile(user?.phone ?? me.phone)}
            </p>
          </div>
          {user?.verified ? <StatusPill tone="success">تأیید شده</StatusPill> : <StatusPill tone="warning">تأیید نشده</StatusPill>}
        </button>

        <h2 className="mt-6 mb-2 px-1 text-xs font-bold text-fg-subtle">حساب کاربری</h2>
        <ListGroup>
          <ListRow to="/app/settings/personal" icon={UserIcon} title="اطلاعات کاربری" subtitle="نام، موبایل، ایمیل" />
          {!user?.verified && <ListRow to="/verify" icon={IdIcon} title="احراز هویت" subtitle="برای برداشت وجه لازم است" />}
          <ListRow to="/app/wallet" icon={BankIcon} title="اطلاعات پرداخت" subtitle="شبا و تاریخچه تراکنش‌ها" />
          <ListRow to="/app/plus" icon={Crown02Icon} title="لنس پلاس" subtitle={user?.plus ? 'فعال' : 'پیشنهاد نامحدود و کارمزد کمتر'} />
        </ListGroup>

        <h2 className="mt-6 mb-2 px-1 text-xs font-bold text-fg-subtle">نقش فعال</h2>
        <div className="rounded-[16px] border border-stroke bg-surface p-3">
          <div className="mb-3 flex items-center gap-2 px-1 text-sm">
            <Icon icon={UserSwitchIcon} size={18} className="text-primary" />
            داشبورد و پیشنهادها بر اساس این نقش نمایش داده می‌شوند.
          </div>
          <SegmentedControl
            label="نقش"
            value={role}
            onChange={setRole}
            options={[
              { value: 'freelancer', label: 'لنسر' },
              { value: 'employer', label: 'کارفرما' },
            ]}
          />
        </div>

        <h2 className="mt-6 mb-2 px-1 text-xs font-bold text-fg-subtle">اعلان‌ها</h2>
        <ListGroup>
          <ListRow icon={Notification03Icon} title="اعلان‌های اپلیکیشن" end={<Switch checked={push} onChange={setPush} label="اعلان‌های اپلیکیشن" />} />
          <ListRow icon={Mail01Icon} title="خبرنامه ایمیلی" end={<Switch checked={email} onChange={setEmail} label="خبرنامه ایمیلی" />} />
        </ListGroup>

        <h2 className="mt-6 mb-2 px-1 text-xs font-bold text-fg-subtle">لنس</h2>
        <ListGroup>
          <ListRow to="/app/settings/policy" icon={Shield01Icon} title="شرایط و قوانین" />
          <ListRow to="/app/settings/about" icon={InformationCircleIcon} title="درباره ما" />
          <ListRow to="/design-system" icon={PaintBoardIcon} title="سیستم طراحی" subtitle="کامپوننت‌ها و توکن‌ها" />
        </ListGroup>

        <Button variant="danger" size="lg" block className="mt-8" iconEnd={Logout01Icon} onClick={() => setConfirm(true)}>
          خروج از اکانت
        </Button>
        <PoweredBy />
      </Screen>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        tone="danger"
        icon={
          <span className="grid size-14 place-items-center rounded-full bg-danger-soft text-danger">
            <Icon icon={Logout01Icon} size={26} />
          </span>
        }
        title="از حساب خارج می‌شی؟"
        description="برای ورود دوباره، یک کد تأیید به موبایلت ارسال می‌شه."
        actions={
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(false)}>
              انصراف
            </Button>
            <Button
              className="flex-1 !bg-danger !text-white"
              onClick={() => {
                signOut()
                navigate('/', { replace: true })
              }}
            >
              خروج
            </Button>
          </>
        }
      />
    </>
  )
}

type FieldKey = 'name' | 'phone' | 'email' | 'job'

/**
 * «26–32 · Settings / Personal Info» — 7 frames (preview, single, edit ×n)
 * collapse into one list where each row edits inline with save/cancel.
 */
export function PersonalInfo() {
  const toast = useToast()
  const { user } = useApp()
  const [values, setValues] = useState<Record<FieldKey, string>>({ name: user?.name ?? me.name, phone: user?.phone ?? me.phone, email: me.email, job: me.title })
  const [editing, setEditing] = useState<FieldKey | null>(null)
  const [draft, setDraft] = useState('')
  const rows: { k: FieldKey; label: string; icon: typeof UserIcon; hint: string; ltr?: boolean }[] = [
    { k: 'name', label: 'نام کاربری', icon: UserIcon, hint: 'شما این اسم را اضافه کردید برای نام کاربری' },
    { k: 'phone', label: 'شماره موبایل', icon: Call02Icon, hint: 'برای تغییر شماره، کد تأیید به شماره جدید ارسال می‌شود.', ltr: true },
    { k: 'email', label: 'ایمیل', icon: Mail01Icon, hint: 'برای دریافت فاکتورها و اطلاعیه‌ها', ltr: true },
    { k: 'job', label: 'عنوان شغلی', icon: Briefcase01Icon, hint: 'روی کارت پروفایل شما نمایش داده می‌شود.' },
  ]
  return (
    <>
      <AppHeader title="اطلاعات کاربری" backTo="/app/settings" />
      <Screen title="اطلاعات کاربری">
        <ul className="flex flex-col gap-3">
          {rows.map((r) => {
            const isEditing = editing === r.k
            return (
              <motion.li key={r.k} layout className="rounded-[16px] border border-stroke bg-surface p-4">
                <AnimatePresence mode="wait" initial={false}>
                  {isEditing ? (
                    <motion.form
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={(e) => {
                        e.preventDefault()
                        setValues((v) => ({ ...v, [r.k]: draft }))
                        setEditing(null)
                        toast.show(`${r.label} به‌روزرسانی شد.`)
                      }}
                    >
                      <TextField label={r.label} value={draft} onChange={(e) => setDraft(e.target.value)} hint={r.hint} dir={r.ltr ? 'ltr' : undefined} className={r.ltr ? 'text-left' : undefined} autoFocus />
                      <div className="mt-3 flex gap-2">
                        <Button type="submit" size="sm" iconStart={Tick02Icon} disabled={!draft.trim()}>
                          ذخیره
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                          انصراف
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-[12px] bg-primary-soft text-primary">
                        <Icon icon={r.icon} size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-fg-subtle">{r.label}</p>
                        <p dir={r.ltr ? 'ltr' : undefined} className="mt-0.5 truncate text-start font-bold tabular">
                          {r.k === 'phone' ? maskMobile(values.phone) : values[r.k]}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(values[r.k])
                          setEditing(r.k)
                        }}
                        aria-label={`ویرایش ${r.label}`}
                        className="grid size-10 place-items-center rounded-[10px] border border-stroke text-fg-muted hover:border-primary hover:text-primary"
                      >
                        <Icon icon={Edit02Icon} size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
        <ListGroup className="mt-6">
          <ListRow icon={LockPasswordIcon} title="تغییر رمز عبور" onClick={() => toast.show('لینک تغییر رمز به موبایلت ارسال شد.', { tone: 'info' })} />
        </ListGroup>
        <PoweredBy />
      </Screen>
    </>
  )
}

const policy = [
  { h: 'نقش پلتفرم', p: '«لنس» یک پلتفرم آنلاین برای اتصال کارفرمایان و متخصصان جهت اجرای پروژه‌های دیجیتال است. این پلتفرم صرفاً به‌عنوان واسط امن برای مدیریت پروژه، پرداخت و ارتباطات عمل می‌کند و مسئولیتی در قبال توافقات خارج از بستر پلتفرم ندارد.' },
  { h: 'پرداخت و ضمانت', p: 'تمامی پرداخت‌ها در کیف پول امن پلتفرم نگهداری می‌شود و تنها پس از تأیید کارفرما یا صدور رأی داوری آزاد خواهد شد. انجام هرگونه پرداخت یا توافق خارج از پلتفرم خلاف قوانین است و ممکن است منجر به مسدودسازی حساب دو طرف شود.' },
  { h: 'قوانین انجام پروژه', p: 'پروژه باید بر اساس توضیحات ثبت‌شده (Brief) انجام شود. هرگونه تغییر اساسی در پروژه نیازمند توافق مجدد است. تعداد دفعات بازبینی (Revision) مطابق شرایط پروژه خواهد بود.' },
  { h: 'اختلاف و داوری', p: 'در صورت بروز اختلاف، تیم پلتفرم با بررسی مستندات، پیام‌ها و خروجی پروژه تصمیم‌گیری خواهد کرد. رأی نهایی پلتفرم لازم‌الاجرا است. دسترسی به صفحه چت برای بررسی شکایات در اختیار ادمین‌های لنس است.' },
  { h: 'کارمزد', p: 'پلتفرم در ازای ارائه خدمات، درصدی از هر تراکنش را به‌عنوان کارمزد کسر می‌کند. میزان کارمزد پیش از پذیرش هر پروژه نمایش داده می‌شود و ممکن است در طول زمان تغییر کند.' },
  { h: 'تعهدات کاربران', p: 'کاربران متعهد می‌شوند اطلاعات صحیح ارائه دهند، ارتباط مالی خارج از پلتفرم نداشته باشند و از رفتارهای غیرحرفه‌ای یا سوءاستفاده خودداری کنند.' },
  { h: 'حریم خصوصی', p: 'اطلاعات کاربران صرفاً برای ارائه خدمات و بهبود تجربه استفاده می‌شود و بدون رضایت آنان در اختیار شخص ثالث قرار نخواهد گرفت، مگر در موارد قانونی.' },
]

/** «24 · Setting / Policy» — one 800-word text block in Figma; sectioned with a jump list here. */
export function Policy() {
  return (
    <>
      <AppHeader title="شرایط و قوانین" backTo="/app/settings" />
      <Screen title="شرایط و قوانین">
        <p className="rounded-[14px] border border-primary/20 bg-primary-soft p-4 text-sm leading-7">
          استفاده از خدمات پلتفرم «لنس» به منزله‌ی مطالعه، درک و پذیرش کامل قوانین و مقررات زیر است.
        </p>
        <nav aria-label="فهرست" className="mt-5 flex flex-wrap gap-2">
          {policy.map((s, i) => (
            <a key={s.h} href={`#p${i}`} className="rounded-full border border-stroke px-3 py-1.5 text-xs text-fg-muted hover:border-primary hover:text-primary">
              {s.h}
            </a>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-6">
          {policy.map((s, i) => (
            <section key={s.h} id={`p${i}`} className="scroll-mt-24">
              <h2 className="text-lg font-extrabold">{s.h}</h2>
              <p className="mt-2 text-sm leading-8 text-fg-muted">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 text-xs text-fg-subtle">آخرین به‌روزرسانی: ۱ آبان ۱۴۰۵</p>
      </Screen>
    </>
  )
}

export function About() {
  return (
    <>
      <AppHeader title="درباره ما" backTo="/app/settings" />
      <Screen title="درباره ما">
        <div className="relative grid h-48 place-items-center overflow-hidden rounded-[20px] border border-stroke bg-surface">
          <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade" />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }}>
            <Logo height={56} />
          </motion.div>
        </div>
        <h2 className="mt-8 text-xl font-extrabold">داستان لنس</h2>
        <p className="mt-3 text-sm leading-8 text-fg-muted">
          در زمان‌های دور، آنجا که شوالیه‌ها غایت توان مبارزین را به نمایش می‌گذاشتند و با درفش‌هایی افراشته بر سر نیزه، نشان از پادشاهی کشور خود می‌دادند؛ شوالیه‌هایی پدیدار شدند که مستقل از
          کشورها و در ازای پول، در این جنگ‌ها با نیزه‌های بی‌پرچم شرکت می‌کردند. این شوالیه‌ها <b className="text-fg">Free Lance</b> نام داشتند.
        </p>
        <p className="mt-3 text-sm leading-8 text-fg-muted">
          در گذر زمان این عبارت از کفاش و نجار و عطار و بنا تا طبیب و حکیم و خطیب و ادیب‌هایی را که با تکیه بر توانایی خود و به تنهایی کار می‌کردند توصیف کرد. و رسید به الان: ما و شما، از توی
          اتاق خودمون و با کمک دانش و خلاقیتمون، مسیر زندگی خودمونو می‌سازیم.
        </p>
        <p className="mt-6 rounded-[14px] border-s-4 border-primary bg-surface p-4 text-sm font-bold leading-7">پس الان می‌دونیم که واژه‌ی فریلنسر از کجا میاد. 🗡️</p>
        <PoweredBy />
      </Screen>
    </>
  )
}

