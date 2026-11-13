import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Button, Chip, Icon, ProgressBar, SearchField, SegmentedControl, useToast } from '../../components/ui'
import { skillGroups } from '../../data/catalog'
import { formatNumber, toFaDigits } from '../../lib/format'

type Level = 'beginner' | 'mid' | 'pro'
const levelText: Record<Level, { label: string; hint: string }> = {
  beginner: { label: 'مبتدی', hint: 'اصول رو بلدی و پروژه‌های ساده رو انجام می‌دی.' },
  mid: { label: 'متوسط', hint: 'چند پروژه واقعی تحویل دادی و مستقل کار می‌کنی.' },
  pro: { label: 'پیشرفته', hint: 'پروژه‌های پیچیده رو رهبری می‌کنی و نمونه‌کار قوی داری.' },
}

/** «17–22 · Add Skill» + «Level Of Skill» — 6 frames in Figma, one 3-step flow here. */
export function AddSkill() {
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<(typeof skillGroups)[number] | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [level, setLevel] = useState<Level | null>(null)

  const groups = skillGroups.filter((g) => !q || g.title.includes(q) || g.skills.some((s) => s.includes(q)))

  const back = () => (step === 0 ? navigate(-1) : setStep(step - 1))

  return (
    <>
      <AppHeader onLeading={back} title="افزودن مهارت" subtitle={`مرحله ${toFaDigits(step + 1)} از ${toFaDigits(3)}`} />
      <div className="px-5">
        <ProgressBar value={((step + 1) / 3) * 100} label="پیشرفت" />
      </div>
      <Screen
        title="افزودن مهارت"
        className="pt-6"
        footer={
          step === 0 ? undefined : step === 1 ? (
            <Button block size="lg" disabled={!picked.length} onClick={() => setStep(2)}>
              {picked.length ? `ادامه با ${formatNumber(picked.length)} مهارت` : 'حداقل یک مهارت انتخاب کن'}
            </Button>
          ) : (
            <Button
              block
              size="lg"
              disabled={!level}
              onClick={() => {
                toast.show(`${formatNumber(picked.length)} مهارت به پروفایلت اضافه شد.`)
                navigate('/app/profile', { replace: true })
              }}
            >
              ادامه
            </Button>
          )
        }
      >
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.22 }}>
            {step === 0 && (
              <>
                <h1 className="text-xl font-extrabold">مهارت‌هاتون رو به ما بگید.</h1>
                <p className="mt-1 text-sm text-fg-muted">این به ما در پیدا کردن پروژه برای شما کمک می‌کنه.</p>
                <SearchField className="mt-5" value={q} onChange={setQ} placeholder="دنبال چه مهارتی هستی؟" />
                <h2 className="mt-6 mb-2 text-sm font-bold text-fg-muted">از موارد زیر انتخاب کنید:</h2>
                <ul className="flex flex-col divide-y divide-stroke">
                  {groups.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setGroup(g)
                          setPicked([])
                          setStep(1)
                        }}
                        className="flex h-16 w-full items-center gap-3 text-start transition-colors hover:text-primary"
                      >
                        <span className="grid size-10 place-items-center rounded-[12px] bg-primary-soft text-primary">
                          <Icon icon={g.icon} size={20} />
                        </span>
                        <span className="flex-1 font-bold">{g.title}</span>
                        <span className="text-xs text-fg-subtle">{formatNumber(g.skills.length)}</span>
                        <Icon icon={ArrowLeft01Icon} size={18} className="text-fg-subtle" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {step === 1 && group && (
              <>
                <span className="grid size-14 place-items-center rounded-[16px] bg-primary-soft text-primary">
                  <Icon icon={group.icon} size={28} />
                </span>
                <h1 className="mt-4 text-xl font-extrabold">{group.title}</h1>
                <p className="mt-1 text-sm text-fg-muted">مهارت‌هایی که داری رو انتخاب کن.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.skills.map((s) => (
                    <Chip key={s} selected={picked.includes(s)} onClick={() => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))} className="h-11 px-4 text-sm">
                      {s}
                    </Chip>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="pt-10 text-center text-xl font-extrabold">چقدر روی این مهارت تسلط دارید؟</h1>
                <p className="mt-2 text-center text-sm text-fg-muted">{picked.join('، ')}</p>
                <SegmentedControl
                  className="mt-8"
                  label="سطح مهارت"
                  value={level ?? ('' as Level)}
                  onChange={setLevel}
                  options={[
                    { value: 'beginner', label: 'مبتدی' },
                    { value: 'mid', label: 'متوسط' },
                    { value: 'pro', label: 'پیشرفته' },
                  ]}
                />
                <AnimatePresence mode="wait">
                  {level && (
                    <motion.p key={level} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-[12px] bg-surface p-4 text-center text-sm leading-6 text-fg-muted">
                      {levelText[level].hint}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Screen>
    </>
  )
}
