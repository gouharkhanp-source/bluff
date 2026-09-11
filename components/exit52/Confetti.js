'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#e8232b', '#ffd23f', '#3a30b8', '#ff5da2', '#1fc3b6', '#4b3fd6', '#ffffff']

// A lightweight, self-contained confetti burst using framer-motion.
// Pass a changing `fireKey` (e.g. an incrementing number) to trigger a new burst.
export default function Confetti({ fireKey = 0, count = 110 }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!fireKey) return
    const W = typeof window !== 'undefined' ? window.innerWidth : 1200
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: `${fireKey}-${i}`,
      x: (Math.random() * 2 - 1) * W * 0.55,
      y: H * (0.35 + Math.random() * 0.55),
      rot: Math.random() * 900 - 450,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 7 + Math.random() * 9,
      h: 10 + Math.random() * 16,
      delay: Math.random() * 0.18,
      dur: 1.5 + Math.random() * 1.1,
      round: Math.random() > 0.6,
    }))
    setPieces(arr)
    const t = setTimeout(() => setPieces([]), 3000)
    return () => clearTimeout(t)
  }, [fireKey, count])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 z-[120] pointer-events-none overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
              transition={{ duration: p.dur, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '40%',
                width: p.w,
                height: p.h,
                backgroundColor: p.color,
                borderRadius: p.round ? '50%' : 2,
                boxShadow: '0 1px 2px rgba(15,30,61,0.15)',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
