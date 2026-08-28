'use client'
import { useMemo } from 'react'
import { Skull, Lock, Crown, Heart, Zap, Repeat, Shield, Star, Expand, HeartHandshake } from 'lucide-react'

// Ambient floating EXIT 52 card icons. Cheap CSS animation, decorative only.
const ICONS = [Skull, Lock, Crown, Heart, Zap, Repeat, Shield, Star, Expand, HeartHandshake]
const COLORS = ['#e8232b', '#3a30b8']

export default function FallingCards({ count = 14, className = '' }) {
  const items = useMemo(() => {
    // Deterministic pseudo-random so SSR and client output match (no hydration mismatch).
    const rand = (s) => {
      const x = Math.sin(s * 99.73) * 10000
      return x - Math.floor(x)
    }
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      Icon: ICONS[i % ICONS.length],
      color: COLORS[i % COLORS.length],
      left: rand(i + 1) * 100,
      delay: rand(i + 1.5) * 8,
      dur: 9 + rand(i + 2.5) * 9,
      size: 22 + rand(i + 3.5) * 30,
      op: 0.1 + rand(i + 4.5) * 0.2,
    }))
  }, [count])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((c) => {
        const Icon = c.Icon
        return (
          <Icon
            key={c.id}
            size={c.size}
            color={c.color}
            strokeWidth={2.1}
            style={{
              position: 'absolute',
              left: `${c.left}%`,
              top: '-10%',
              opacity: c.op,
              animation: `cardfall ${c.dur}s linear ${c.delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}
