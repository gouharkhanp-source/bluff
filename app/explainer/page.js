'use client'
import { useEffect, useState } from 'react'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import { IMAGES } from '@/lib/exit52/images'
import { CHAPTERS } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { Play, Pause } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const DURATION = 125
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

const RULEBOOK = [
  ['Setup', 'Place the 4 Game Selector Cards face down. Pick one at random to set the mode, then deal the required cards to each player.'],
  ['Your Turn', 'Draw from the Draw Pile or take the top of the Discard Pile. Then play toward your formation or discard.'],
  ['Bluffing', 'You do not have to reveal your intentions. Mislead opponents and bait out their Sabotage cards.'],
  ['Formations', 'Combine Standard Cards into the formation your Game Selector demands. First to complete reveals their EXIT.'],
  ['The Challenge', 'The losing side (or final two in 3–6 players) spins the digital Challenge Wheel and faces the result.'],
]

export default function Explainer() {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setT((x) => {
        if (x >= DURATION) { clearInterval(id); setPlaying(false); track(EVENTS.videoComplete); return DURATION }
        return x + 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing])

  const activeChapter = [...CHAPTERS].reverse().find((c) => t >= c.seconds) || CHAPTERS[0]

  const toggle = () => {
    if (!started) { setStarted(true); track(EVENTS.videoPlay) }
    setPlaying((p) => !p)
  }
  const seek = (sec) => { setT(sec); if (!started) { setStarted(true); track(EVENTS.videoPlay) } }

  return (
    <SiteShell>
      <section className="pt-32 pb-14 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">AI VLOG EXPLAINER</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-none">WATCH IT.<br />GET IT. <span className="text-exit-red">PLAY IT.</span></h1>
            <p className="mt-4 text-exit-cream/60">Learn EXIT 52 in under two minutes.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-exit-black">
              <img src={IMAGES.neon} alt="AI host explaining EXIT 52" className="absolute inset-0 h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-exit-black via-exit-black/30 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="h-20 w-20 rounded-full bg-exit-red/90 hover:bg-exit-red grid place-items-center transition-transform hover:scale-105 anim-pulseglow">
                    {playing ? <Pause className="text-white" size={30} /> : <Play className="text-white ml-1" size={30} />}
                  </button>
                  <div className="mt-4 label text-[10px] text-exit-cream/70">{playing ? 'NOW PLAYING' : started ? 'PAUSED' : 'AI HOST · CHAPTER: ' + activeChapter.label}</div>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-16 font-display text-3xl md:text-5xl text-exit-cream/90 pointer-events-none">{activeChapter.label}</div>
              {/* controls */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center gap-3">
                  <span className="label text-[10px] text-exit-cream/70 tabular-nums">{fmt(t)}</span>
                  <div className="relative flex-1 h-1.5 rounded-full bg-white/15 cursor-pointer" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek(Math.round(((e.clientX - r.left) / r.width) * DURATION)) }}>
                    <div className="absolute inset-y-0 left-0 rounded-full bg-exit-red" style={{ width: `${(t / DURATION) * 100}%` }} />
                  </div>
                  <span className="label text-[10px] text-exit-cream/40 tabular-nums">{fmt(DURATION)}</span>
                </div>
              </div>
            </div>

            {/* chapters */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CHAPTERS.map((c) => {
                const on = c.label === activeChapter.label
                return (
                  <button key={c.label} onClick={() => seek(c.seconds)} className={`rounded-lg border p-3 text-left transition-all ${on ? 'border-exit-red bg-exit-red/10' : 'border-white/10 hover:border-white/25'}`}>
                    <div className="label text-[10px] text-exit-amber tabular-nums">{c.time}</div>
                    <div className="font-cond text-xs font-semibold mt-1">{c.label}</div>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 label text-[9px] text-exit-cream/30">PROTOTYPE PLAYER · AI HOST VIDEO CONNECTS AT LAUNCH</p>
          </div>

          <div>
            <h2 className="font-cond font-bold text-xl mb-4">QUICK-REFERENCE RULEBOOK</h2>
            <Accordion type="single" collapsible defaultValue="item-0" className="rounded-xl border border-white/10 bg-exit-charcoal/40 px-4">
              {RULEBOOK.map(([q, a], i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                  <AccordionTrigger className="text-left font-cond font-semibold hover:no-underline hover:text-exit-red">{q}</AccordionTrigger>
                  <AccordionContent className="text-exit-cream/60">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
