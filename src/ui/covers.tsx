import type { Piece } from '../data/market'

/**
 * Generated covers for showcase pieces: geometric compositions in the piece's hue,
 * drawn in SVG so the gallery stays crisp and contains no stock or generated imagery.
 */
export function Cover({ piece, className, fill }: { piece: Piece; className?: string; fill?: boolean }) {
  const h = piece.hue
  const a = `hsl(${h} 70% 62%)`
  const b = `hsl(${h} 45% 22%)`
  const c = `hsl(${h} 35% 14%)`
  const paper = `hsl(${h} 25% 92%)`
  // fill: crop to the frame (like object-fit: cover) instead of letterboxing.
  const common = { viewBox: '0 0 320 240', className, role: 'img', 'aria-label': piece.title.en, preserveAspectRatio: fill ? 'xMidYMid slice' : 'xMidYMid meet' } as const

  switch (piece.cover) {
    case 'app':
      return (
        <svg {...common}>
          <rect width="320" height="240" fill={c} />
          <rect x="110" y="24" width="100" height="200" rx="18" fill={b} stroke={a} strokeOpacity=".5" />
          <rect x="122" y="48" width="76" height="10" rx="5" fill={a} />
          <rect x="122" y="70" width="76" height="46" rx="8" fill={`hsl(${h} 40% 30%)`} />
          <rect x="122" y="126" width="52" height="8" rx="4" fill="#ffffff" opacity=".5" />
          <rect x="122" y="140" width="36" height="8" rx="4" fill="#ffffff" opacity=".3" />
          <rect x="122" y="184" width="76" height="22" rx="11" fill={a} />
          <rect x="30" y="70" width="60" height="100" rx="12" fill={b} opacity=".6" />
          <rect x="230" y="70" width="60" height="100" rx="12" fill={b} opacity=".6" />
        </svg>
      )
    case 'type':
      return (
        <svg {...common}>
          <rect width="320" height="240" fill={paper} />
          <text x="36" y="166" fontSize="112" fontFamily="Vazirmatn Variable" fontWeight="800" fill={b} direction="rtl" unicodeBidi="bidi-override">
            خط
          </text>
          <text x="196" y="160" fontSize="96" fontFamily="Inter Variable" fontWeight="650" fill={`hsl(${h} 55% 42%)`}>
            Aa
          </text>
          <rect x="40" y="196" width="240" height="2" fill={b} opacity=".3" />
        </svg>
      )
    case 'grid':
      return (
        <svg {...common}>
          <rect width="320" height="240" fill={c} />
          <rect x="24" y="24" width="272" height="192" rx="10" fill={b} />
          <rect x="40" y="40" width="80" height="8" rx="4" fill={a} />
          <rect x="40" y="64" width="150" height="16" rx="4" fill="#fff" opacity=".85" />
          <rect x="40" y="88" width="120" height="8" rx="4" fill="#fff" opacity=".35" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={40 + i * 84} y="124" width="72" height="72" rx="8" fill={`hsl(${h} 40% ${30 + i * 6}%)`} />
          ))}
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <rect width="320" height="240" fill={c} />
          {[60, 110, 80, 150, 125, 170, 140].map((v, i) => (
            <rect key={i} x={36 + i * 38} y={200 - v} width="22" height={v} rx="3" fill={i === 5 ? a : `hsl(${h} 30% 34%)`} />
          ))}
          <rect x="28" y="200" width="264" height="1.5" fill="#fff" opacity=".3" />
        </svg>
      )
    case 'film':
      return (
        <svg {...common}>
          <rect width="320" height="240" fill="#0d0d10" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={24 + i * 96} y="58" width="80" height="124" rx="6" fill={`hsl(${h + i * 18} 55% ${34 + i * 8}%)`} />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i} fill="#fff" opacity=".25">
              <rect x={20 + i * 21} y="32" width="10" height="10" rx="2" />
              <rect x={20 + i * 21} y="198" width="10" height="10" rx="2" />
            </g>
          ))}
        </svg>
      )
    case 'brand':
    default:
      return (
        <svg {...common}>
          <rect width="320" height="240" fill={paper} />
          <circle cx="104" cy="120" r="56" fill={b} />
          <path d="M104 82c18 14 18 62 0 76-18-14-18-62 0-76z" fill={a} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x="192" y={74 + i * 34} width="88" height="24" rx="4" fill={`hsl(${h} ${50 - i * 10}% ${28 + i * 18}%)`} />
          ))}
        </svg>
      )
  }
}
