import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import defaultAvatar from '../../assets/brand/avatar-default.svg'
import { Icon } from './Icon'

type Props = {
  name: string
  src?: string
  size?: number
  online?: boolean
  verified?: boolean
  ring?: boolean
  className?: string
}

const palette = ['#ff7fe3', '#7fbdff', '#7fffbf', '#ffe57f', '#c9a7ff']

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

/**
 * Avatar with graceful fallbacks: photo → brand mark (as in Figma) → initials.
 * Online dot and verified badge are part of the component instead of loose layers.
 */
export function Avatar({ name, src, size = 48, online, verified, ring, className }: Props) {
  const color = palette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length]
  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      {src === 'brand' ? (
        <img src={defaultAvatar} alt={name} width={size} height={size} className={cn('rounded-full', ring && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-bg')} />
      ) : src ? (
        <img src={src} alt={name} width={size} height={size} loading="lazy" className={cn('size-full rounded-full object-cover', ring && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-bg')} />
      ) : (
        <span
          aria-label={name}
          role="img"
          className={cn('grid size-full place-items-center rounded-full font-extrabold', ring && 'ring-2 ring-primary/40 ring-offset-2 ring-offset-bg')}
          style={{ background: `${color}26`, color, fontSize: size * 0.36 }}
        >
          {initials(name)}
        </span>
      )}
      {online && (
        <span className="absolute bottom-0 end-0 size-3.5 rounded-full border-[3px] border-bg bg-success" aria-label="آنلاین" role="img" />
      )}
      {verified && (
        <span className="absolute -bottom-0.5 -start-0.5 grid place-items-center rounded-full bg-bg text-primary" aria-label="تأیید شده" role="img">
          <Icon icon={CheckmarkBadge01Icon} size={Math.max(16, size * 0.34)} />
        </span>
      )}
    </span>
  )
}

export function AvatarStack({ names, max = 3, size = 28 }: { names: string[]; max?: number; size?: number }) {
  const shown = names.slice(0, max)
  return (
    <span className="flex items-center">
      {shown.map((n, i) => (
        <span key={n} className="-ms-2 first:ms-0 rounded-full ring-2 ring-surface" style={{ zIndex: shown.length - i }}>
          <Avatar name={n} size={size} />
        </span>
      ))}
      {names.length > max && (
        <span className="ms-2 text-xs text-fg-muted">+{new Intl.NumberFormat('fa-IR').format(names.length - max)} نفر</span>
      )}
    </span>
  )
}
