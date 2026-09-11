'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PlayingCard from '@/components/exit52/PlayingCard'
import { ASSETS } from '@/lib/exit52/images'
import { playFlip, playShuffle } from '@/lib/exit52/sound'
import { track, EVENTS } from '@/lib/exit52/analytics'

const DECK = [
  ASSETS.cardCover, ASSETS.s1, ASSETS.a1, ASSETS.s2, ASSETS.a2, ASSETS.s3,
  ASSETS.a3, ASSETS.s4, ASSETS.a4, ASSETS.s5, ASSETS.a5,
]

export default function EntryGate() {
  const router = useRouter()
  const [boom, setBoom] = useState(false)
  const [ready, setReady] = useState(false)
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  const explode = () => {
    if (boom) return
    playFlip()
    setTimeout(playShuffle, 120)
    setTimeout(playShuffle, 420)

    const W = typeof window !== 'undefined' ? window.innerWidth : 1200
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    const N = 40
    const arr = Array.from({ length: N }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 140 + Math.random() * (Math.max(W, H) * 0.45)
      const bx = Math.cos(angle) * dist
      const by = Math.sin(angle) * dist * 0.75 - 80 // slight upward bias on burst
      return {
        id: i,
        img: DECK[i % DECK.length],
        size: 66 + Math.random() * 70,
        bx,
        by,
        fx: bx + (Math.random() * 280 - 140),
        fy: H * 0.55 + Math.random() * H * 0.6, // gravity: fall toward / below bottom
        rot1: Math.random() * 220 - 110,
        rot2: Math.random() * 900 - 450,
        delay: Math.random() * 0.14,
        dur: 1.5 + Math.random() * 0.8,
      }
    })
    setPieces(arr)
    setBoom(true)
    track(EVENTS.entryGate, { action: 'explode' })
    setTimeout(() => router.push('/home'), 2050)
  }

  return (
    <div className="relative min-h-screen text-exit-cream overflow-hidden grid place-items-center" style={{ backgroundColor: '#0b0713' }}>
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-exit-red/10 blur-[120px]" />
      </div>

      {/* skip */}
      <button
        onClick={() => { track(EVENTS.entryGate, { action: 'skip' }); router.push('/home') }}
        className="absolute top-6 right-6 z-40 label text-[10px] text-exit-cream/50 hover:text-exit-cream transition-colors"
      >
        SKIP INTRO →
      </button>

      <div className="relative z-20 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: boom ? 0 : 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label text-[11px] md:text-xs text-exit-cream/50 max-w-xs leading-relaxed"
        >
          SOMEWHERE BETWEEN LUCK<br />AND STRATEGY...
        </motion.p>

        {/* The card */}
        <div className="relative my-10" style={{ width: 176, height: 248 }}>
          <motion.button
            onClick={explode}
            aria-label="Explode the deck and enter EXIT 52"
            drag={!boom}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 80 || Math.abs(info.offset.y) > 80) explode() }}
            className="relative w-full h-full cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={boom ? { opacity: 0, scale: 1.15, transition: { duration: 0.18 } } : ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 anim-breathe">
              <PlayingCard back className="w-full h-full" />
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: boom ? 0 : 1 } : {}}
          transition={{ duration: boom ? 0.2 : 1, delay: boom ? 0 : 0.5 }}
          className="space-y-3"
        >
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">
            THERE&apos;S AN <span className="text-exit-red text-glow">EXIT</span>.
          </h1>
          <p className="label text-[10px] text-exit-cream/45 anim-flicker">CLICK THE CARD TO EXPLODE THE DECK</p>
        </motion.div>
      </div>

      {/* EXPLOSION */}
      {boom && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {pieces.map((p) => (
            <motion.img
              key={p.id}
              src={p.img}
              alt=""
              className="absolute left-1/2 top-1/2 drop-shadow-2xl select-none"
              style={{ width: p.size, marginLeft: -p.size / 2, marginTop: -(p.size * 1.55) / 2 }}
              initial={{ x: 0, y: 0, rotate: 0, scale: 0.5, opacity: 1 }}
              animate={{
                x: [0, p.bx, p.fx],
                y: [0, p.by, p.fy],
                rotate: [0, p.rot1, p.rot2],
                scale: [0.5, 1, 1],
                opacity: [1, 1, 0.85],
              }}
              transition={{ duration: p.dur, delay: p.delay, times: [0, 0.32, 1], ease: ['easeOut', 'easeIn'] }}
            />
          ))}
        </div>
      )}

      {/* flash */}
      <AnimatePresence>
        {boom && (
          <motion.div
            className="absolute inset-0 z-[35] bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.4, times: [0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
