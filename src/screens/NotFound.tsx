import { Search01Icon } from '@hugeicons/core-free-icons'
import { ButtonLink, EmptyState } from '../components/ui'

export function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <EmptyState
        icon={Search01Icon}
        title="این صفحه پیدا نشد"
        description="شاید لینک اشتباه باشه یا صفحه جابه‌جا شده."
        action={<ButtonLink to="/">بازگشت به خانه</ButtonLink>}
      />
    </main>
  )
}
