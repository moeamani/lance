import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase01Icon, Camera01Icon, Location01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Avatar, Button, Icon, ProgressBar, SelectSheet, TextArea, TextField, useToast } from '../../components/ui'
import { cities } from '../../data/catalog'
import { me } from '../../data/mock'
import { formatNumber, toEnDigits } from '../../lib/format'

/** «13/14 · Profile / Edit» — with a live completion meter so editing has a visible payoff. */
export function EditProfile() {
  const navigate = useNavigate()
  const toast = useToast()
  const [f, setF] = useState({ name: me.name, title: me.title, bio: me.bio, city: me.city as string | null, hourly: '450000' })
  const [saving, setSaving] = useState(false)
  const completion = Math.round((Object.values(f).filter((v) => v && String(v).trim()).length / 5) * 100)
  const set = (k: keyof typeof f) => (v: string | null) => setF((x) => ({ ...x, [k]: v }))

  return (
    <>
      <AppHeader title="ویرایش پروفایل" backTo="/app/profile" />
      <Screen
        title="ویرایش پروفایل"
        footer={
          <Button
            block
            size="lg"
            loading={saving}
            onClick={() => {
              setSaving(true)
              window.setTimeout(() => {
                toast.show('تغییرات ذخیره شد.')
                navigate('/app/profile')
              }, 600)
            }}
          >
            ذخیره تغییرات
          </Button>
        }
      >
        <div className="flex items-center gap-4">
          <button type="button" className="group relative rounded-full" aria-label="تغییر عکس پروفایل">
            <Avatar name={f.name} src="brand" size={80} />
            <span className="absolute inset-0 grid place-items-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Icon icon={Camera01Icon} size={24} />
            </span>
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold">تکمیل پروفایل {formatNumber(Math.max(completion, me.completion))}٪</p>
            <ProgressBar value={Math.max(completion, me.completion)} className="mt-2" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-5">
          <TextField label="نام و نام خانوادگی" iconStart={UserIcon} value={f.name} onChange={(e) => set('name')(e.target.value)} />
          <TextField label="عنوان شغلی" iconStart={Briefcase01Icon} value={f.title} onChange={(e) => set('title')(e.target.value)} />
          <TextArea label="درباره من" value={f.bio} maxChars={400} onChange={(e) => set('bio')(e.target.value)} hint="۲ تا ۳ جمله: چه کاری انجام می‌دی و برای چه کسانی." />
          <SelectSheet label="شهر" placeholder="انتخاب شهر" icon={Location01Icon} options={cities.map((c) => ({ value: c, label: c }))} value={f.city} onChange={set('city')} />
          <TextField
            label="نرخ ساعتی (تومان)"
            inputMode="numeric"
            dir="ltr"
            className="text-left tabular"
            value={formatNumber(Number(toEnDigits(f.hourly)) || 0)}
            onChange={(e) => set('hourly')(toEnDigits(e.target.value).replace(/\D/g, ''))}
          />
        </div>
      </Screen>
    </>
  )
}
