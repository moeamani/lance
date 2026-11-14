import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { useLocale, type Bi } from '../i18n/locale'
import { cn, Icon } from '../ui/core'
import { Mark } from './Logo'

export type DoorTone = 'pink' | 'sky' | 'mint' | 'sun' | 'ember'
type Door = { to: string; name: Bi; line: Bi; tone: DoorTone }

/**
 * Five doors, one per intent (Hick's law: five clear choices). Each wears one of the five lance
 * tips from the brand file's presentation sheet (pink, blue, mint, yellow, red) on a tile that
 * fades its colour into black. The tip lights up on hover or focus.
 */
export function Doors({ doors }: { doors: Door[] }) {
  const { t, to } = useLocale()
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {doors.map((d, i) => (
        <li key={d.to} className={cn(i === 0 && 'sm:col-span-2 lg:col-span-1')}>
          <Link
            to={to(d.to)}
            style={{ ['--tint' as string]: `var(--${d.tone})` }}
            className="tile group relative flex h-full items-center gap-5 overflow-hidden rounded-lg border border-white/10 p-5 text-white lg:min-h-[300px] lg:flex-col lg:items-start lg:justify-between lg:p-6"
          >
            <span aria-hidden className="led absolute inset-0 opacity-60" />
            <Mark
              size={56}
              color={`var(--${d.tone})`}
              className="relative shrink-0 transition-[filter,transform] duration-200 group-hover:-translate-y-1 group-hover:[filter:drop-shadow(0_0_14px_var(--tint))] group-focus-visible:[filter:drop-shadow(0_0_14px_var(--tint))] lg:h-[88px] lg:w-auto"
            />
            <span className="relative flex min-w-0 flex-1 flex-col gap-1 lg:flex-none">
              <span className="heading text-[22px]">{t(d.name)}</span>
              <span className="text-[14px] leading-snug text-white/70">{t(d.line)}</span>
            </span>
            <Icon icon={ArrowRight01Icon} size={20} directional className="relative text-white/60 lg:hidden" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
