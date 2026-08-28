'use client'
import { cn } from '@/lib/utils'

// Reusable playing card. Modes:
//  - back: render EXIT 52 card back
//  - faceContent: custom center content (for card-type showcase)
//  - rank/suit: classic pip card
export default function PlayingCard({
  back = false,
  rank = 'A',
  suit = '\u2660',
  red = false,
  faceContent = null,
  tag,
  title,
  glyph,
  accent = '#e63946',
  className = '',
  style = {},
  children,
}) {
  if (back) {
    return (
      <div
        className={cn(
          'relative rounded-xl border border-white/15 card-back-pattern overflow-hidden shadow-2xl',
          className
        )}
        style={style}
      >
        <div className="absolute inset-[6px] rounded-lg border border-exit-red/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-display text-exit-red/90 leading-none text-2xl md:text-3xl">52</div>
            <div className="label text-[7px] md:text-[8px] text-white/60 mt-1">EXIT</div>
          </div>
        </div>
        {children}
      </div>
    )
  }

  const suitColor = red ? '#e11d2a' : '#0f1e3d'

  return (
    <div
      className={cn(
        'relative rounded-xl bg-gradient-to-b from-[#faf7f0] to-[#e9e4d8] text-exit-ink overflow-hidden shadow-2xl border border-black/10',
        className
      )}
      style={style}
    >
      {faceContent ? (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="label text-[7px] font-bold" style={{ color: accent }}>{tag}</span>
            <span className="text-lg leading-none" style={{ color: accent }}>{glyph}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-4xl md:text-5xl" style={{ color: accent }}>{glyph}</span>
          </div>
          <div className="px-2 pb-2 text-center">
            <div className="font-cond font-bold text-[10px] md:text-xs leading-tight">{title}</div>
          </div>
          {faceContent}
        </div>
      ) : (
        <>
          <div className="absolute top-1.5 left-2 flex flex-col items-center leading-none" style={{ color: suitColor }}>
            <span className="font-cond font-bold text-sm md:text-base">{rank}</span>
            <span className="text-xs md:text-sm">{suit}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-6xl" style={{ color: suitColor }}>{suit}</span>
          </div>
          <div className="absolute bottom-1.5 right-2 flex flex-col items-center leading-none rotate-180" style={{ color: suitColor }}>
            <span className="font-cond font-bold text-sm md:text-base">{rank}</span>
            <span className="text-xs md:text-sm">{suit}</span>
          </div>
        </>
      )}
    </div>
  )
}
