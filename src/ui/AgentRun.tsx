import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckmarkCircle02Icon, PlayIcon, RefreshIcon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import type { Agent } from '../data/agents'
import { useLocale } from '../i18n/locale'
import { Button, cn, Icon, Pip } from './core'

type State = 'idle' | 'running' | 'review'

/**
 * A visible agent run. Plan first, then each step with its result, then a review gate.
 * Doherty threshold: every step answers within ~400ms of starting (we show the step immediately).
 */
export function AgentRun({ agent, result, cta, autoStart, className }: { agent: Agent; result?: ReactNode; cta?: ReactNode; autoStart?: boolean; className?: string }) {
  const { t, lang } = useLocale()
  const reduce = useReducedMotion()
  const [state, setState] = useState<State>('idle')
  const [done, setDone] = useState(0)
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const start = () => {
    clear()
    setDone(0)
    setState('running')
    const gap = reduce ? 120 : 900
    agent.run.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setDone(i + 1), gap * (i + 1)))
    })
    timers.current.push(window.setTimeout(() => setState('review'), gap * (agent.run.length + 0.6)))
  }
  useEffect(() => {
    if (autoStart) start()
    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, agent.id])

  return (
    <section aria-label={t({ en: `${agent.name.en} run`, fa: `اجرای ${agent.name.fa}` })} className={cn('rail overflow-hidden rounded-xl border border-line bg-surface', className)}>
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <Knight who={agent.id} label={t(agent.name)} className="size-11 shrink-0 overflow-hidden rounded-full" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">{t(agent.name)}</p>
          <p className="truncate text-[14px] text-ink-subtle">{t(agent.role)}</p>
        </div>
        <span className="flex items-center gap-2 text-[14px] text-ink-muted" aria-live="polite">
          <Pip tone={state === 'review' ? 'success' : 'cobalt'} pulse={state === 'running'} />
          {state === 'idle' && t({ en: 'Ready', fa: 'آماده' })}
          {state === 'running' && t({ en: 'Working', fa: 'در حال کار' })}
          {state === 'review' && t({ en: 'Waiting for you', fa: 'منتظر تأیید تو' })}
        </span>
      </header>

      <ol className="flex flex-col gap-0 px-5 py-4">
        {agent.run.map((s, i) => {
          const st = i < done ? 'done' : i === done && state === 'running' ? 'now' : 'next'
          return (
            <li key={i} className="flex gap-3 py-2.5">
              <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
                {st === 'done' ? (
                  <Icon icon={CheckmarkCircle02Icon} size={20} className="text-cobalt-ink" />
                ) : (
                  <span className={cn('size-2 rounded-full', st === 'now' ? 'breathe bg-cobalt shadow-[0_0_10px_var(--cobalt)]' : 'bg-line-strong')} />
                )}
              </span>
              <div className="min-w-0">
                <p className={cn('text-[15px]', st === 'next' ? 'text-ink-subtle' : 'text-ink')}>{t(s.step)}</p>
                <AnimatePresence>
                  {st === 'done' && (
                    <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="text-[14px] text-ink-muted">
                      {t(s.result)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>

      <AnimatePresence>
        {state === 'review' && result && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.22 }} className="overflow-hidden border-t border-line">
            <div className="p-5">{result}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
        <p className="text-[14px] text-ink-subtle">{t(agent.limit)}</p>
        <div className="flex gap-2">
          {state === 'idle' && (
            <Button size="sm" icon={PlayIcon} directional onClick={start}>
              {t({ en: 'Run example', fa: 'اجرای نمونه' })}
            </Button>
          )}
          {state === 'review' && (
            <>
              <Button size="sm" variant="ghost" icon={RefreshIcon} onClick={start}>
                {t({ en: 'Run again', fa: 'دوباره' })}
              </Button>
              {cta}
            </>
          )}
          {state === 'running' && (
            <Button size="sm" variant="outline" onClick={() => (clear(), setState('idle'), setDone(0))}>
              {lang === 'fa' ? 'توقف' : 'Stop'}
            </Button>
          )}
        </div>
      </footer>
    </section>
  )
}
