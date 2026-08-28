'use client'
import { useMemo } from 'react'

// Ambient falling-card background. Cheap CSS animation, decorative only.
export default function FallingCards({ count = 14, className = '' }) {
  const cards = useMemo(() => {
    const suits = ['\u2660', '\u2665', '\u2666', '\u2663']
    // Deterministic pseudo-random so SSR and client output match (no hydration mismatch).
    const rand = (s) => {
      const x = Math.sin(s * 99.73) * 10000
      return x - Math.floor(x)
    }
    return Array.from({ length: count }).map((_, i) => {
      const suit = suits[i % 4]
      const red = suit === '\u2665' || suit === '\u2666'
      return {
        id: i,
        left: rand(i + 1) * 100,
        delay: rand(i + 1.5) * 8,
        dur: 9 + rand(i + 2.5) * 9,
        size: 22 + rand(i + 3.5) * 26,
        suit,
        red,
        op: 0.12 + rand(i + 4.5) * 0.22,
      }
    })
  }, [count])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {cards.map((c) => (
        <span
          key={c.id}
          className="absolute select-none"
          style={{
            left: `${c.left}%`,
            top: '-10%',
            fontSize: `${c.size}px`,
            color: c.red ? '#e63946' : '#f4f1ea',
            opacity: c.op,
            animation: `cardfall ${c.dur}s linear ${c.delay}s infinite`,
          }}
        >
          {c.suit}
        </span>
      ))}
    </div>
  )
}
