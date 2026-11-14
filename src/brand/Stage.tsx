import { useEffect, useRef, useState } from 'react'
import { cn } from '../ui/core'
import { CHARACTERS, LANCER, type KnightId } from './Knights'

/**
 * The LED stage, from the brand guidelines' event and "colours" sheets: a dark stage, an LED wall
 * behind it, and pink beams. The Figma file drew this as a flat field of dots; here the wall is a
 * real LED matrix. Pixels inside the figure are lit with a soft bloom, the rest sit dim, and one
 * slow scan passes over the wall. Static under reduced motion and paused off-screen.
 */

const MARK = ['M125 0L0 461.663H125V348.03C125 348.03 171.176 461.663 195.154 461.663H250L125 0Z', 'M128.05 660.439L167.684 489.707H125.001L125.001 526.672C125.001 526.672 118.464 508.342 107.592 499.024C96.7204 489.707 82.3185 489.707 82.3185 489.707L128.05 660.439Z']

type Figure = 'lancer' | 'mark' | KnightId

function figure(f: Figure): { paths: string[]; w: number; h: number } {
  if (f === 'lancer') return { paths: LANCER, w: 636, h: 863 }
  if (f === 'mark') return { paths: MARK, w: 250, h: 661 }
  return { paths: [CHARACTERS[f].d], w: 400, h: 500 }
}

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, set] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

/**
 * Draws `figure` as lit LEDs inside the canvas box. `fit` is the share of the box height the figure
 * takes; `align` places it horizontally (0 = start, 0.5 = centre, 1 = end, mirrored in RTL).
 */
export function LedWall({
  figure: f = 'lancer',
  color = '#FF7FE3',
  pitch = 9,
  fit = 0.86,
  align = 0.72,
  className,
}: {
  figure?: Figure
  color?: string
  pitch?: number
  fit?: number
  align?: number
  className?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [box, inView] = useInView<HTMLDivElement>()

  useEffect(() => {
    const el = canvas.current
    const host = box.current
    if (!el || !host) return
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const W = host.clientWidth
      const H = host.clientHeight
      if (!W || !H) return
      el.width = Math.round(W * dpr)
      el.height = Math.round(H * dpr)
      el.style.width = `${W}px`
      el.style.height = `${H}px`
      const ctx = el.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Rasterise the figure into a mask at LED resolution.
      const { paths, w, h } = figure(f)
      const cols = Math.ceil(W / pitch)
      const rows = Math.ceil(H / pitch)
      const mask = document.createElement('canvas')
      mask.width = cols
      mask.height = rows
      const m = mask.getContext('2d', { willReadFrequently: true })
      if (!m) return
      const s = (rows * fit) / h
      const rtl = getComputedStyle(host).direction === 'rtl'
      const a = rtl ? 1 - align : align
      const ox = (cols - w * s) * a
      const oy = (rows - h * s) / 2 + rows * 0.02
      m.setTransform(s, 0, 0, s, ox, oy)
      m.fillStyle = '#fff'
      for (const d of paths) m.fill(new Path2D(d), 'evenodd')
      const px = m.getImageData(0, 0, cols, rows).data

      const r = pitch * 0.22
      const ink = getComputedStyle(host).getPropertyValue('--ink').trim() || '#ffffff'
      // Dim pixels first, then the lit figure with bloom on top.
      ctx.fillStyle = ink
      ctx.globalAlpha = 0.075
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (px[(y * cols + x) * 4 + 3] > 96) continue
          ctx.beginPath()
          ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = pitch * 1.1
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const alpha = px[(y * cols + x) * 4 + 3]
          if (alpha <= 96) continue
          ctx.globalAlpha = 0.55 + (alpha / 255) * 0.45
          ctx.beginPath()
          ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, r * 1.25, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(host)
    return () => ro.disconnect()
  }, [f, color, pitch, fit, align, box])

  return (
    <div ref={box} aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', !inView && 'paused', className)}>
      <canvas ref={canvas} className="absolute inset-0" />
      {/* the scan: a soft band that drifts down the wall */}
      <span
        className="led-scan absolute inset-x-0 h-1/3"
        style={{ background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${color} 10%, transparent), transparent)` }}
      />
    </div>
  )
}

/**
 * Stage beams: the pink light lines that cross the guideline's LED wall. Thin, angled, slow.
 * Decorative; they never sit behind body text at full strength.
 */
export function Beams({ color = 'var(--pink)', className }: { color?: string; className?: string }) {
  const lines = [
    { x: 8, a: -14, d: 0 },
    { x: 22, a: -9, d: -2.2 },
    { x: 64, a: 10, d: -1.1 },
    { x: 80, a: 15, d: -3.4 },
  ]
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {lines.map((l, i) => (
        <span
          key={i}
          className="beam absolute -top-[10%] h-[130%] w-px origin-top"
          style={{
            insetInlineStart: `${l.x}%`,
            transform: `rotate(${l.a}deg)`,
            animationDelay: `${l.d}s`,
            background: `linear-gradient(to bottom, transparent, ${color} 30%, color-mix(in oklab, ${color} 30%, transparent) 75%, transparent)`,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

/** The brand's four-point pattern (guideline sheet 16): two hooked strokes that make a spark. */
export function Spark({ size = 48, className, color = 'currentColor' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path d="M2 46H48V2C48 30 60 46 98 46" stroke={color} strokeWidth="3" />
      <path d="M98 54H52V98C52 70 40 54 2 54" stroke={color} strokeWidth="3" />
    </svg>
  )
}
