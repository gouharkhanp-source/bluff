'use client'
import { ASSETS } from '@/lib/exit52/images'

// Faithful recreation of the light "Game Selector / win rule" cards.
export default function WinRuleCard({ rule }) {
  return (
    <div className="relative w-full rounded-2xl bg-[#e9ecef] border border-black/5 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.35)] aspect-[2/3.05] px-4 pt-5 pb-4 flex flex-col items-center text-center text-exit-ink overflow-hidden">
      <div className="font-script text-2xl leading-[1.05] text-[#161616]">{rule.script}</div>
      <div className="font-display text-2xl md:text-[26px] leading-[1.05] text-[#161616]">{rule.bold}</div>

      <svg viewBox="0 0 300 70" className="w-full mt-2" aria-hidden="true">
        <defs>
          <path id={`wr-${rule.id}`} d="M16,66 A160,160 0 0,1 284,66" fill="none" />
        </defs>
        <text fill="#161616" className="font-cond" style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.3px' }}>
          <textPath href={`#wr-${rule.id}`} startOffset="50%" textAnchor="middle" textLength="272" lengthAdjust="spacingAndGlyphs">
            {rule.arc}
          </textPath>
        </text>
      </svg>

      <img src={ASSETS.gameModesFan} alt="" className="h-24 md:h-28 w-auto object-contain -mt-1" />

      <div className="mt-auto pt-2 space-y-0.5">
        {rule.lines.map((l, i) => (
          <p key={i} className="text-[10.5px] md:text-[11px] font-semibold leading-snug text-[#222]">{l}</p>
        ))}
      </div>
    </div>
  )
}
