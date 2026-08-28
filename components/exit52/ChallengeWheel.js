'use client'
import { useState } from 'react'
import { CHALLENGES } from '@/lib/exit52/data'
import { playWheel } from '@/lib/exit52/sound'
import { track, EVENTS } from '@/lib/exit52/analytics'

export default function ChallengeWheel() {
  const seg = 360 / CHALLENGES.length
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  const gradient = `conic-gradient(${CHALLENGES.map((c, i) => `${c.color} ${i * seg}deg ${(i + 1) * seg}deg`).join(',')})`

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    playWheel()
    const idx = Math.floor(Math.random() * CHALLENGES.length)
    const target = 360 * 5 + (360 - idx * seg - seg / 2)
    const next = rot - (rot % 360) + target
    setRot(next)
    track(EVENTS.challengeWheel, { result: CHALLENGES[idx].label })
    setTimeout(() => {
      setResult(CHALLENGES[idx].label)
      setSpinning(false)
    }, 4200)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 320, maxWidth: '82vw' }}>
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-exit-cream drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
        </div>
        <div
          className="relative aspect-square rounded-full border-4 border-slate-900/10 shadow-[0_0_60px_-10px_rgba(230,57,70,0.6)]"
          style={{ background: gradient, transform: `rotate(${rot}deg)`, transition: 'transform 4.1s cubic-bezier(0.16,1,0.3,1)' }}
        >
          {CHALLENGES.map((c, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-start justify-center"
              style={{ transform: `rotate(${i * seg + seg / 2}deg)` }}
            >
              <span className="mt-5 label text-[9px] font-bold text-white/90 max-w-[70px] text-center leading-tight" style={{ transform: 'translateY(6px)' }}>
                {c.label}
              </span>
            </div>
          ))}
          <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-exit-black border-4 border-slate-900/15 grid place-items-center">
            <span className="font-display text-exit-red text-lg">52</span>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-8 label text-xs font-semibold px-8 h-12 rounded-md bg-exit-red text-white hover:bg-exit-crimson transition-colors disabled:opacity-60"
      >
        {spinning ? 'SPINNING...' : 'SPIN THE CHALLENGE'}
      </button>

      <div className="h-10 mt-4">
        {result && (
          <div className="text-center">
            <span className="label text-[10px] text-exit-cream/50">CHALLENGE</span>
            <div className="font-display text-2xl text-exit-amber text-glow">{result}</div>
          </div>
        )}
      </div>
      <p className="label text-[9px] text-exit-cream/30 mt-1">PROTOTYPE MECHANIC · SCAN CHALLENGE QR</p>
    </div>
  )
}
