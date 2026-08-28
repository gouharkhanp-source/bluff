'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import PlayingCard from '@/components/exit52/PlayingCard'
import { ASSETS } from '@/lib/exit52/images'
import { playFlip, playShuffle } from '@/lib/exit52/sound'
import { track, EVENTS } from '@/lib/exit52/analytics'

export default function EntryGate() {
  const router = useRouter()
  const [flipped, setFlipped] = useState(false)
  const [entering, setEntering] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  const enter = () => {
    if (entering) return
    setFlipped(true)
    playFlip()
    setTimeout(playShuffle, 300)
    track(EVENTS.entryGate, { action: 'enter' })
    setEntering(true)
    setTimeout(() => router.push('/home'), 1150)
  }

  const flyCards = [
    { x: -320, y: -180, r: -40 }, { x: 320, y: -160, r: 38 },
    { x: -360, y: 120, r: -28 }, { x: 360, y: 140, r: 30 },
    { x: -180, y: 260, r: -18 }, { x: 200, y: 260, r: 20 },
  ]

  return (
    <div className="relative min-h-screen bg-exit-black text-exit-cream overflow-hidden grid place-items-center">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-exit-red/10 blur-[120px]" />
      </div>

      {/* skip */}
      <button
        onClick={() => { track(EVENTS.entryGate, { action: 'skip' }); router.push('/home') }}
        className="absolute top-6 right-6 z-30 label text-[10px] text-exit-cream/50 hover:text-exit-cream transition-colors"
      >
        SKIP INTRO →
      </button>

      <div className="relative z-20 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="label text-[11px] md:text-xs text-exit-cream/50 max-w-xs leading-relaxed"
        >
          SOMEWHERE BETWEEN LUCK<br />AND STRATEGY...
        </motion.p>

        {/* Card */}
        <div className="relative my-10 perspective" style={{ width: 176, height: 248 }}>
          {/* fly-out cards */}
          {flyCards.map((f, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={entering ? { opacity: [0, 0.9, 0], x: f.x, y: f.y, rotate: f.r, scale: 0.8 } : { opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <PlayingCard back className="w-full h-full" />
            </motion.div>
          ))}

          <motion.button
            onClick={enter}
            aria-label="Enter EXIT 52"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 90 || Math.abs(info.offset.y) > 90) enter() }}
            className="relative w-full h-full cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full h-full preserve-3d transition-transform duration-700" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              <div className="absolute inset-0 backface-hidden anim-breathe">
                <PlayingCard back className="w-full h-full" />
              </div>
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <img src={ASSETS.a3} alt="EXIT 52 Ultimate Victor card" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-3"
        >
          <h1 className="font-display text-4xl md:text-6xl leading-none">
            THERE&apos;S AN <span className="text-exit-red text-glow">EXIT</span>.
          </h1>
          <p className="label text-[10px] text-exit-cream/45 anim-flicker">CLICK THE CARD TO ENTER</p>
        </motion.div>
      </div>

      {/* flash */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.5, times: [0, 0.4, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
