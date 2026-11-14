import { useId, type ReactNode } from 'react'

/**
 * The Round Table: seven agents, drawn by hand in one construction.
 * Bust in an arched niche (160 × 200). Armour and cloth in a fixed palette so the
 * portraits read the same in day and night. The only light is cobalt: eyes, visors,
 * lantern tips. Heraldry is gilt. No gradients except the light itself.
 */
export type KnightId = 'merlin' | 'scout' | 'herald' | 'smith' | 'steward' | 'scribe' | 'sentinel'

const P = {
  steelHi: '#DCE0E8',
  steel: '#AEB5C2',
  steelLo: '#767E8C',
  steelDk: '#454B57',
  navy: '#2A3352',
  wine: '#5C2B37',
  moss: '#3F4A35',
  umber: '#4F3B2B',
  skin: '#D8B597',
  skinLo: '#BE9475',
  hair: '#4A372A',
  beard: '#E8E3DA',
  gilt: '#E2B65C',
  led: '#5B7CFF',
  ledHi: '#B9C8FF',
}

function Niche({ id, children, label }: { id: string; children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 160 200" role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className="h-full w-full">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d="M8 200V76a72 72 0 0 1 144 0v124z" />
        </clipPath>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#232833" />
          <stop offset="1" stopColor="#14171d" />
        </linearGradient>
        <radialGradient id={`${id}-halo`} cx="80" cy="96" r="70" gradientUnits="userSpaceOnUse">
          <stop stopColor={P.led} stopOpacity="0.32" />
          <stop offset="1" stopColor={P.led} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="160" height="200" fill={`url(#${id}-bg)`} />
        {/* fluting inside the niche */}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={20 + i * 15} y="0" width="1" height="200" fill="#ffffff" opacity="0.035" />
        ))}
        <circle cx="80" cy="96" r="70" fill={`url(#${id}-halo)`} />
        {children}
      </g>
      {/* lit rim of the arch */}
      <path d="M8 200V76a72 72 0 0 1 144 0v124" fill="none" stroke={P.led} strokeOpacity="0.55" strokeWidth="1.2" />
    </svg>
  )
}

/** Glowing element helper. */
const Lit = ({ id, children }: { id: string; children: ReactNode }) => <g filter={`url(#${id}-glow)`}>{children}</g>

/* Shared armoured shoulders with a surcoat in the given colour. */
function Shoulders({ coat, sigil }: { coat: string; sigil?: ReactNode }) {
  return (
    <g>
      <path d="M18 200c0-30 22-50 62-50s62 20 62 50z" fill={coat} />
      <path d="M20 196c0-24 12-38 34-42l6 22c-14 2-24 10-28 22z" fill={P.steel} />
      <path d="M140 196c0-24-12-38-34-42l-6 22c14 2 24 10 28 22z" fill={P.steel} />
      <path d="M24 186c4-12 14-20 30-23" stroke={P.steelHi} strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M136 186c-4-12-14-20-30-23" stroke={P.steelDk} strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M60 146h40v10c0 6-9 10-20 10s-20-4-20-10z" fill={P.steelLo} />
      {sigil}
    </g>
  )
}

const ShieldSigil = ({ y = 172 }: { y?: number }) => <path d={`M72 ${y}h16v8c0 6-4 10-8 12-4-2-8-6-8-12z`} fill={P.gilt} />

function Sentinel({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.navy} sigil={<ShieldSigil />} />
      {/* great helm */}
      <path d="M52 148V90c0-20 12-30 28-30s28 10 28 30v58z" fill={P.steel} />
      <path d="M52 148V90c0-20 12-30 28-30v88z" fill={P.steelHi} opacity="0.35" />
      <rect x="79" y="60" width="2" height="88" fill={P.steelLo} />
      <rect x="52" y="112" width="56" height="3" fill={P.steelLo} />
      {[[66, 124], [71, 131], [89, 124], [94, 131], [66, 138], [94, 138]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill={P.steelDk} />
      ))}
      <Lit id={id}>
        <rect x="56" y="94" width="48" height="5" rx="2.5" fill={P.led} />
        <rect x="58" y="95.5" width="44" height="1.6" rx="0.8" fill={P.ledHi} />
      </Lit>
    </>
  )
}

function Scout({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.moss} sigil={<path d="M74 176l6-10 6 10-6 10z" fill={P.gilt} />} />
      {/* plume */}
      <path d="M88 62c10-26 34-34 50-24-14 0-28 8-38 26z" fill={P.wine} />
      <path d="M90 60c12-18 28-22 40-18" stroke="#7a3a49" strokeWidth="2" fill="none" />
      {/* sallet with tail */}
      <path d="M50 116c0-34 14-52 34-52 22 0 34 16 36 36l16 22c-14 4-24 2-32-2v4H50z" fill={P.steel} />
      <path d="M50 116c0-34 14-52 34-52v58H50z" fill={P.steelHi} opacity="0.3" />
      {/* bevor */}
      <path d="M54 118h50l-4 24c-8 8-34 8-42 0z" fill={P.steelLo} />
      <Lit id={id}>
        <rect x="56" y="100" width="44" height="5" rx="2.5" fill={P.led} />
        <rect x="58" y="101.5" width="40" height="1.6" rx="0.8" fill={P.ledHi} />
      </Lit>
    </>
  )
}

function Face({ id, cy = 104 }: { id: string; cy?: number }) {
  return (
    <>
      <rect x="72" y={cy + 18} width="16" height="22" fill={P.skinLo} />
      <ellipse cx="80" cy={cy} rx="22" ry="27" fill={P.skin} />
      <path d={`M80 ${cy - 2}v12h-4`} stroke={P.skinLo} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Lit id={id}>
        <ellipse cx="71" cy={cy - 4} rx="3.4" ry="2.4" fill={P.led} />
        <ellipse cx="89" cy={cy - 4} rx="3.4" ry="2.4" fill={P.led} />
      </Lit>
    </>
  )
}

function Herald({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.wine} sigil={<path d="M62 168l18 12 18-12v8l-18 12-18-12z" fill={P.gilt} />} />
      <Face id={id} />
      <path d="M58 98c-4-10 0-20 8-22l-2 22z" fill={P.hair} />
      <path d="M102 98c4-10 0-20-8-22l2 22z" fill={P.hair} />
      <path d="M90 116c-3 4-17 4-20 0" stroke={P.skinLo} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* beret + feather */}
      <path d="M52 86c0-20 54-24 60-4-18-6-42-4-60 4z" fill={P.navy} />
      <path d="M104 74c8-22 20-30 30-30-6 8-14 20-22 32z" fill={P.gilt} />
      {/* proclamation scroll: the Herald writes your proposals */}
      <g transform="rotate(-14 128 168)">
        <rect x="114" y="150" width="28" height="36" rx="3" fill={P.beard} />
        <rect x="110" y="146" width="36" height="7" rx="3.5" fill={P.gilt} />
        <rect x="110" y="183" width="36" height="7" rx="3.5" fill={P.gilt} />
        <path d="M120 161h16M120 167h16M120 173h10" stroke="#9a9284" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </>
  )
}

function Smith({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.umber} />
      {/* apron */}
      <path d="M56 156h48l6 44H50z" fill="#6a5038" />
      <path d="M62 156l-10 -6M98 156l10 -6" stroke="#6a5038" strokeWidth="3" />
      <Face id={id} cy={102} />
      {/* headband + hair */}
      <path d="M58 92c0-16 10-24 22-24s22 8 22 24c-6-6-14-8-22-8s-16 2-22 8z" fill={P.hair} />
      <rect x="57" y="86" width="46" height="5" rx="2" fill={P.wine} />
      {/* beard */}
      <path d="M58 108c0 22 10 34 22 34s22-12 22-34c-6 8-14 10-22 10s-16-2-22-10z" fill={P.hair} />
      <path d="M72 116c4 2 12 2 16 0" stroke="#2e2218" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* hammer: the head glows like metal from the forge */}
      <path d="M118 198l14-44" stroke="#8b6a4a" strokeWidth="4" strokeLinecap="round" />
      <Lit id={id}>
        <rect x="120" y="140" width="26" height="12" rx="2" transform="rotate(18 133 146)" fill={P.gilt} />
      </Lit>
    </>
  )
}

function Steward({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.navy} />
      {/* chain of office */}
      <path d="M58 156c6 14 14 20 22 20s16-6 22-20" stroke={P.gilt} strokeWidth="3" fill="none" strokeDasharray="4 3" />
      <circle cx="80" cy="182" r="7" fill={P.gilt} />
      <circle cx="80" cy="182" r="3" fill={P.navy} />
      <Face id={id} />
      {/* moustache */}
      <path d="M70 114c4-4 8-4 10 0 2-4 6-4 10 0-4 4-16 4-20 0z" fill={P.hair} />
      {/* flat bonnet */}
      <path d="M52 88c2-14 14-20 28-20s26 6 28 20c-10-4-46-4-56 0z" fill={P.wine} />
      <rect x="50" y="86" width="60" height="6" rx="3" fill="#47212a" />
      {/* keys */}
      <g stroke={P.gilt} strokeWidth="2.4" fill="none">
        <circle cx="128" cy="160" r="5" />
        <path d="M128 165v20m0-6h5m-5 4h4" />
      </g>
    </>
  )
}

function Scribe({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.moss} />
      {/* hood */}
      <path d="M40 160c0-58 18-100 40-104 22 4 40 46 40 104z" fill={P.moss} />
      <path d="M58 150c0-40 10-66 22-68 12 2 22 28 22 68z" fill="#262d20" />
      <ellipse cx="80" cy="110" rx="18" ry="24" fill={P.skinLo} />
      <Lit id={id}>
        <ellipse cx="72" cy="106" rx="3" ry="2.2" fill={P.led} />
        <ellipse cx="88" cy="106" rx="3" ry="2.2" fill={P.led} />
      </Lit>
      {/* quill with a lit nib */}
      <path d="M100 196l30-62" stroke={P.beard} strokeWidth="2" />
      <path d="M130 134c2-14 10-24 18-28-2 10-6 22-14 32z" fill={P.beard} />
      <Lit id={id}>
        <circle cx="100" cy="196" r="3" fill={P.led} />
      </Lit>
    </>
  )
}

function Merlin({ id }: { id: string }) {
  return (
    <>
      <Shoulders coat={P.navy} />
      <Face id={id} cy={108} />
      {/* beard */}
      <path d="M58 112c0 40 10 74 22 84 12-10 22-44 22-84-6 10-14 14-22 14s-16-4-22-14z" fill={P.beard} />
      <path d="M70 120c4 3 16 3 20 0" stroke="#bdb6aa" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* hat */}
      <path d="M50 90L88 14l26 76z" fill={P.navy} />
      <ellipse cx="82" cy="90" rx="38" ry="6" fill="#222a45" />
      <path d="M82 52l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill={P.gilt} />
      <circle cx="74" cy="72" r="1.6" fill={P.gilt} />
      <circle cx="96" cy="66" r="1.4" fill={P.gilt} />
      {/* staff and its orb */}
      <path d="M130 200V96" stroke="#8b6a4a" strokeWidth="4" strokeLinecap="round" />
      <Lit id={id}>
        <circle cx="130" cy="88" r="9" fill={P.led} />
        <circle cx="127" cy="85" r="3" fill={P.ledHi} />
      </Lit>
    </>
  )
}

const CAST: Record<KnightId, (p: { id: string }) => ReactNode> = {
  merlin: Merlin,
  scout: Scout,
  herald: Herald,
  smith: Smith,
  steward: Steward,
  scribe: Scribe,
  sentinel: Sentinel,
}

export function Knight({ who, label, className }: { who: KnightId; label: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const Body = CAST[who]
  return (
    <div className={className}>
      <Niche id={id} label={label}>
        <Body id={id} />
      </Niche>
    </div>
  )
}
