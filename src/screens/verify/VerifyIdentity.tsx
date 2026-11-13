import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BankIcon, CheckmarkBadge01Icon, IdIcon, SecurityCheckIcon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, FileDrop, Icon, ProgressBar, TextField, type PickedFile } from '../../components/ui'
import { useToast } from '../../components/ui/Toast'
import { cn } from '../../lib/cn'
import { toFaDigits } from '../../lib/format'
import { bankFromSheba, validateNationalId, validateSheba } from '../../lib/validate'
import { useApp } from '../../store/AppStore'

const STEPS = [
  { id: 'national', title: 'شماره کارت ملی', icon: IdIcon },
  { id: 'upload', title: 'آپلود کارت ملی', icon: IdIcon },
  { id: 'sheba', title: 'شماره شبا', icon: BankIcon },
] as const

/**
 * «05 · Onboarding / Identity Verification» — 4 separate screens in Figma,
 * one stepped flow here with a progress bar, real کد ملی / شبا validation,
 * live bank detection from the SHEBA prefix, and an honest "what happens next".
 */
export function VerifyIdentity() {
  const navigate = useNavigate()
  const toast = useToast()
  const { setVerified } = useApp()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [nid, setNid] = useState('')
  const [files, setFiles] = useState<PickedFile[]>([])
  const [sheba, setSheba] = useState('')
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)

  const nidV = validateNationalId(nid)
  const shebaV = validateSheba(sheba)
  const bank = bankFromSheba(sheba)
  const uploaded = files.length > 0 && files.every((f) => f.progress >= 100)
  const canNext = [nidV.ok, uploaded, shebaV.ok][step]

  const next = () => {
    setTouched(true)
    if (!canNext) return
    setTouched(false)
    if (step < STEPS.length - 1) {
      setDir(1)
      setStep(step + 1)
    } else {
      setVerified(true)
      setDone(true)
    }
  }

  if (done) {
    return (
      <Screen
        title="احراز هویت"
        className="relative flex flex-col items-center justify-center text-center"
        footer={
          <Button block size="lg" onClick={() => navigate('/app', { replace: true })}>
            ادامه
          </Button>
        }
      >
        <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade" />
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="relative grid size-24 place-items-center rounded-full bg-success-soft text-success shadow-[0_0_40px_#7fffbf33]">
          <Icon icon={CheckmarkBadge01Icon} size={48} />
        </motion.span>
        <h1 className="relative mt-8 text-2xl font-extrabold">درخواست احراز هویت ثبت شد.</h1>
        <p className="relative mt-3 max-w-[300px] text-sm leading-7 text-fg-muted">نتیجه حداکثر تا ۲۴ ساعت کاری از طریق پیامک و اعلان‌ها به شما اطلاع داده می‌شود.</p>
      </Screen>
    )
  }

  return (
    <>
      <AppHeader
        leading={step === 0 ? 'close' : 'back'}
        onLeading={step === 0 ? undefined : () => (setDir(-1), setStep(step - 1))}
        title="احراز هویت"
        subtitle={`مرحله ${toFaDigits(step + 1)} از ${toFaDigits(STEPS.length)} · ${STEPS[step].title}`}
      />
      <div className="px-5">
        <ProgressBar value={((step + 1) / STEPS.length) * 100} label="پیشرفت احراز هویت" />
      </div>
      <Screen
        title="احراز هویت"
        className="pt-8"
        footer={
          <Button block size="lg" onClick={next}>
            {step === STEPS.length - 1 ? 'ثبت درخواست' : 'ادامه'}
          </Button>
        }
      >
        <div className="mb-6 flex items-center gap-3 rounded-[14px] border border-stroke bg-surface p-3 text-xs leading-5 text-fg-muted">
          <Icon icon={SecurityCheckIcon} size={22} className="text-success" />
          اطلاعات شما رمزنگاری شده و فقط برای احراز هویت و تسویه استفاده می‌شود.
        </div>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? 30 : -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <TextField
                label="شماره کارت ملی"
                placeholder="مثلاً ۰۰۱۲۳۴۵۶۷۸"
                inputMode="numeric"
                dir="ltr"
                maxLength={10}
                iconStart={IdIcon}
                className="text-left tracking-[0.2em] tabular placeholder:text-left placeholder:tracking-normal"
                value={toFaDigits(nid)}
                onChange={(e) => setNid(e.target.value.replace(/[^\d۰-۹]/g, ''))}
                error={(touched || nid.length === 10) && !nidV.ok && nidV.message}
                hint={nidV.ok ? '✓ کد ملی معتبر است' : 'کد ملی ۱۰ رقمی پشت کارت ملی'}
                autoFocus
              />
            )}
            {step === 1 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold">لطفاً عکس کارت ملی خود را آپلود کنید.</p>
                <p className="text-xs leading-5 text-fg-muted">عکس واضح، بدون فلاش و با هر چهار گوشه‌ی کارت در کادر.</p>
                <FileDrop label="بارگذاری فایل" accept="image/*" maxFiles={2} maxSizeMB={5} files={files} onChange={setFiles} onError={(m) => toast.show(m, { tone: 'error' })} />
                {touched && !uploaded && <p className="text-xs text-danger">تصویر کارت ملی را بارگذاری کنید.</p>}
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                <TextField
                  label="شماره شبا"
                  placeholder="IR00 0000 0000 0000 0000 0000 00"
                  dir="ltr"
                  iconStart={BankIcon}
                  className="text-left tracking-wider tabular placeholder:text-left"
                  value={sheba}
                  onChange={(e) => setSheba(e.target.value.toUpperCase())}
                  error={(touched || sheba.replace(/\s/g, '').length >= 26) && !shebaV.ok && shebaV.message}
                  hint="شبا باید به نام خود شما باشد تا تسویه انجام شود."
                  autoFocus
                />
                <AnimatePresence>
                  {bank && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className={cn('flex items-center gap-2 rounded-[12px] border p-3 text-sm', shebaV.ok ? 'border-success/40 bg-success-soft text-success' : 'border-stroke bg-surface')}>
                        <Icon icon={BankIcon} size={18} />
                        {bank}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[11px] text-fg-subtle">نمونه معتبر برای دمو (بانک سامان): IR750560611828001234567801</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Screen>
    </>
  )
}
