import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { useLocale, type Bi } from '../i18n/locale'
import { cn, Icon } from '../ui/core'

type Door = { to: string; name: Bi; line: Bi }

/**
 * The portico: five fluted columns under one pediment. Each column is a door into one of the
 * five intents (Hick's law: five clear choices). The LED sweep runs up the column you point at.
 * Loops pause off-screen; reduced motion shows a steady glow instead.
 */
export function Portico({ doors }: { doors: Door[] }) {
  const { t, to, lang } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('relative', !visible && 'paused')}>
      {/* pediment */}
      <svg viewBox="0 0 1000 90" preserveAspectRatio="none" className="hidden h-[72px] w-full md:block" aria-hidden>
        <path d="M8 88 L500 8 L992 88" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M8 88 L500 8 L992 88" fill="none" stroke="var(--cobalt)" strokeWidth="1.5" strokeDasharray="6 994" className="breathe" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* entablature with the inscription */}
      <div className="hidden items-center justify-center border-y border-line-strong py-3 md:flex">
        <span className="numeral text-[13px] text-ink-subtle" dir="ltr">
          {lang === 'fa' ? 'LANCE · لنس' : 'LANCE · MMXXVI'}
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-4 md:pt-4">
        {doors.map((d, i) => (
          <li key={d.to}>
            <Link
              to={to(d.to)}
              className="group relative flex h-full flex-row items-center gap-4 overflow-hidden rounded-md border border-line bg-surface px-5 py-5 outline-none md:h-[360px] md:flex-col md:items-stretch md:rounded-t-[6px] md:rounded-b-none md:px-0 md:py-0"
            >
              {/* capital */}
              <span aria-hidden className="hidden h-3 border-b border-line-strong bg-raised md:block" />
              {/* shaft with flutes and the sweep */}
              <span aria-hidden className="relative hidden flex-1 overflow-hidden md:block">
                <span className="flutes absolute inset-0 opacity-70" />
                <span
                  className="sweep absolute inset-x-0 h-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background: 'linear-gradient(to top, transparent, color-mix(in oklab, var(--cobalt) calc(55% * var(--glow)), transparent), transparent)',
                    animationDelay: `${i * -1.2}s`,
                    maskImage: 'repeating-linear-gradient(90deg,#000 0 1px,transparent 1px 14px)',
                    WebkitMaskImage: 'repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 14px)',
                  }}
                />
              </span>
              {/* plinth: the label */}
              <span className="relative flex flex-1 flex-col gap-1 md:h-[132px] md:flex-none md:border-t md:border-line-strong md:px-5 md:py-5">
                <span className="hidden numeral text-[12px] text-ink-subtle md:block">{lang === 'fa' ? ['۱', '۲', '۳', '۴', '۵'][i] : ['I', 'II', 'III', 'IV', 'V'][i]}</span>
                <span className="heading text-[22px]">{t(d.name)}</span>
                <span className="text-[14px] leading-snug text-ink-muted">{t(d.line)}</span>
              </span>
              <Icon icon={ArrowRight01Icon} size={20} directional className="text-ink-subtle md:hidden" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-cobalt shadow-[0_0_12px_var(--cobalt)] transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
      {/* stylobate */}
      <div aria-hidden className="mt-0 hidden h-3 border-x border-b border-line-strong md:block" />
    </div>
  )
}
