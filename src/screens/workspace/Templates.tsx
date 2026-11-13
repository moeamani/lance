import { useState } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Accordion, Button, Icon, useToast } from '../../components/ui'
import { categories } from '../../data/catalog'
import { templates } from '../../data/mock'
import { formatNumber } from '../../lib/format'
import { useApp } from '../../store/AppStore'
import { useNavigate } from 'react-router-dom'

const templateTasks: Record<string, string[]> = {
  ui: ['دریافت نیازمندی و تحقیق اولیه', 'وایرفریم', 'طراحی UI', 'پروتوتایپ', 'هندآف'],
  app: ['نیازسنجی', 'معماری', 'طراحی', 'پیاده‌سازی', 'تست', 'انتشار بتا', 'رفع باگ', 'انتشار'],
  web: ['نیازسنجی', 'وایرفریم', 'طراحی', 'پیاده‌سازی', 'سئو پایه', 'انتشار'],
  branding: ['کشف برند', 'کانسپت لوگو', 'نهایی‌سازی', 'راهنمای برند'],
}

/** «10 · Modal / Template» — ready-made task lists, applied to a project in one tap. */
export function Templates() {
  const { projects, updateProject } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [applied, setApplied] = useState<string | null>(null)
  const target = projects.find((p) => p.status === 'active')

  return (
    <>
      <AppHeader title="قالب‌های آماده" subtitle="برای شروع سریع‌تر" />
      <Screen title="قالب‌های آماده">
        <Accordion
          items={templates.map((t) => {
            const cat = categories.find((c) => c.slug === t.icon)
            const tasks = templateTasks[t.icon] ?? []
            return {
              id: t.id,
              leading: cat ? (
                <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon icon={cat.icon} size={20} />
                </span>
              ) : undefined,
              title: (
                <span>
                  {t.title}
                  <span className="ms-2 text-xs font-normal text-fg-subtle">{formatNumber(tasks.length)} تسک</span>
                </span>
              ),
              content: (
                <div>
                  <ol className="flex flex-col gap-2">
                    {tasks.map((task, i) => (
                      <li key={task} className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-surface-sunken text-[11px]">{formatNumber(i + 1)}</span>
                        {task}
                      </li>
                    ))}
                  </ol>
                  {target && (
                    <Button
                      className="mt-4"
                      block
                      variant={applied === t.id ? 'success-soft' : 'primary'}
                      iconStart={applied === t.id ? Tick02Icon : undefined}
                      onClick={() => {
                        updateProject(target.id, (p) => ({ ...p, tasks: [...p.tasks, ...tasks.map((title, i) => ({ id: `tpl${Date.now()}${i}`, title, done: false }))] }))
                        setApplied(t.id)
                        toast.show(`قالب به «${target.title}» اضافه شد.`, { action: { label: 'مشاهده', onClick: () => navigate(`/app/projects/${target.id}`) } })
                      }}
                    >
                      {applied === t.id ? 'اضافه شد' : `افزودن به «${target.title}»`}
                    </Button>
                  )}
                </div>
              ),
            }
          })}
        />
      </Screen>
    </>
  )
}
