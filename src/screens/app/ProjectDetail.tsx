import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Briefcase01Icon, Calendar03Icon, CheckmarkCircle02Icon, Download01Icon, File01Icon, Image01Icon, Money03Icon, Share08Icon, UserIcon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { BookmarkButton } from '../../components/domain/Cards'
import { Button, Icon, IconButton, Sheet, StaggerItem, StaggerList, Tag, TextArea, TextField, useToast } from '../../components/ui'
import { projects } from '../../data/mock'
import { formatDays, formatFileSize, formatNumber, formatRelative, formatToman, toEnDigits } from '../../lib/format'
import { useApp } from '../../store/AppStore'

function InfoTile({ icon, value, label }: { icon: typeof UserIcon; value: string; label: string }) {
  return (
    <div className="rounded-[14px] border border-stroke bg-surface p-3">
      <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon icon={icon} size={16} />
      </span>
      <p className="mt-2 truncate text-sm font-extrabold tabular">{value}</p>
      <p className="text-xs text-fg-subtle">{label}</p>
    </div>
  )
}

/** «09 · Project single page» + «10 · Modal» (proposal sheet). */
export function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { sentProposals, sendProposal, role } = useApp()
  const p = projects.find((x) => x.id === id) ?? projects[0]
  const sent = sentProposals.includes(p.id)
  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState(String(p.budget))
  const [days, setDays] = useState(String(p.days))
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)

  const priceN = Number(toEnDigits(price).replace(/\D/g, ''))
  const daysN = Number(toEnDigits(days).replace(/\D/g, ''))
  const fee = Math.round(priceN * 0.1)
  const errs = {
    price: !priceN ? 'قیمت پیشنهادی را وارد کنید.' : priceN < 500_000 ? 'حداقل ۵۰۰ هزار تومان' : '',
    days: !daysN ? 'زمان تحویل را وارد کنید.' : '',
    note: note.trim().length < 20 ? 'حداقل ۲۰ کاراکتر — بگو چرا برای این پروژه مناسبی.' : '',
  }

  const submit = () => {
    setTouched(true)
    if (Object.values(errs).some(Boolean)) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setOpen(false)
      sendProposal(p.id)
      toast.show('پیشنهاد شما ارسال شد. نتیجه رو در اعلان‌ها می‌بینی.')
    }, 800)
  }

  return (
    <>
      <AppHeader
        title="پروژه"
        backTo="/app/discover"
        actions={
          <IconButton
            icon={Share08Icon}
            label="اشتراک‌گذاری"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(location.href)
                toast.show('لینک پروژه کپی شد.')
              } catch {
                toast.show('کپی لینک ممکن نشد.', { tone: 'error' })
              }
            }}
          />
        }
      />
      <Screen
        title={p.title}
        footer={
          role === 'freelancer' ? (
            <div className="flex gap-2">
              <Button block size="lg" disabled={sent} iconStart={sent ? CheckmarkCircle02Icon : undefined} onClick={() => setOpen(true)}>
                {sent ? 'پیشنهاد ارسال شد' : 'ارسال پیشنهاد'}
              </Button>
              <BookmarkButton id={p.id} kind="project" className="size-14 border border-stroke bg-surface" />
            </div>
          ) : (
            <Button block size="lg" variant="secondary" onClick={() => navigate('/app/projects')}>
              مدیریت پروژه‌های من
            </Button>
          )
        }
      >
        <StaggerList className="flex flex-col gap-5">
          <StaggerItem className="grid grid-cols-2 gap-3">
            <InfoTile icon={UserIcon} value={p.employer} label="کارفرما" />
            <InfoTile icon={Briefcase01Icon} value={p.category} label="نوع پروژه" />
            <InfoTile icon={Money03Icon} value={formatToman(p.budget)} label="بودجه پیشنهادی" />
            <InfoTile icon={Calendar03Icon} value={formatDays(p.days)} label="زمان پیشنهادی" />
          </StaggerItem>

          <StaggerItem className="rounded-[18px] border border-stroke bg-surface p-5">
            <h1 className="text-xl font-extrabold leading-9">{p.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag tone="neutral">{formatRelative(p.postedAt)}</Tag>
              <Tag tone="neutral">{formatNumber(p.proposals)} پیشنهاد</Tag>
              {p.urgent && <Tag tone="danger">فوری</Tag>}
            </div>

            <h2 className="mt-6 text-lg font-extrabold">شرح پروژه</h2>
            <p className="mt-2 text-sm leading-7 text-fg-muted">{p.description}</p>

            <h2 className="mt-6 text-lg font-extrabold">شرح وظایف و مسئولیت‌ها</h2>
            <ul className="mt-2 flex flex-col gap-2">
              {p.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm leading-6 text-fg-muted">
                  <Icon icon={CheckmarkCircle02Icon} size={18} className="mt-0.5 text-primary" />
                  {r}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-lg font-extrabold">مهارت‌های مورد نیاز</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            {p.attachments.length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-extrabold">فایل‌های ضمیمه پروژه</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {p.attachments.map((a) => (
                    <li key={a.name}>
                      <button
                        type="button"
                        onClick={() => toast.show(`دانلود ${a.name} شروع شد.`, { tone: 'info' })}
                        className="flex w-full items-center gap-3 rounded-[12px] bg-surface-sunken p-3 text-start hover:bg-surface-raised"
                      >
                        <span className="grid size-10 place-items-center rounded-[10px] bg-primary-soft text-primary">
                          <Icon icon={a.kind === 'image' ? Image01Icon : File01Icon} size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span dir="ltr" className="block truncate text-start text-sm font-bold">
                            {a.name}
                          </span>
                          <span className="text-xs text-fg-subtle">
                            {a.kind === 'pdf' ? 'PDF' : 'JPG'} · {formatFileSize(a.size)}
                          </span>
                        </span>
                        <Icon icon={Download01Icon} size={20} className="text-fg-muted" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </StaggerItem>
        </StaggerList>
      </Screen>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="ارسال پیشنهاد"
        footer={
          <Button block size="lg" loading={loading} onClick={submit}>
            ارسال پیشنهاد
          </Button>
        }
      >
        <div className="flex flex-col gap-5 pt-1">
          <TextField
            label="قیمت پیشنهادی شما (تومان)"
            inputMode="numeric"
            dir="ltr"
            className="text-left tabular"
            value={priceN ? formatNumber(priceN) : ''}
            onChange={(e) => setPrice(e.target.value)}
            error={touched && errs.price}
            hint={priceN ? `دریافتی شما بعد از کارمزد ۱۰٪: ${formatToman(priceN - fee)}` : `بودجه کارفرما: ${formatToman(p.budget)}`}
          />
          <TextField
            label="زمان تحویل (روز)"
            inputMode="numeric"
            dir="ltr"
            className="text-left tabular"
            value={daysN ? formatNumber(daysN) : ''}
            onChange={(e) => setDays(e.target.value)}
            error={touched && errs.days}
          />
          <TextArea
            label="توضیحات"
            placeholder="چند نکته کلیدی رو بیان کن: چرا تو؟ اولین قدمت چیه؟"
            value={note}
            maxChars={800}
            onChange={(e) => setNote(e.target.value)}
            error={touched && errs.note}
            hint="نکته: با یک مایلستون کوچک و مشخص شروع کن تا کارفرما راحت‌تر قبول کنه."
          />
          <motion.div layout className="rounded-[14px] border border-stroke bg-surface p-4 text-xs leading-6 text-fg-muted">
            مبلغ پس از پذیرش در <b className="text-primary">ضمانت لنس</b> نگه‌داری می‌شود و با تأیید تحویل برای شما آزاد می‌شود.
          </motion.div>
        </div>
      </Sheet>
    </>
  )
}
