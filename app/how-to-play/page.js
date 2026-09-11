'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import PlayingCard from '@/components/exit52/PlayingCard'
import Reveal from '@/components/exit52/Reveal'
import { HOW_TO_STEPS } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { ArrowRight } from 'lucide-react'

export default function HowToPlay() {
  const [step, setStep] = useState(0)
  const active = HOW_TO_STEPS[step]

  const visuals = [
    <div key="v0" className="flex gap-2 justify-center">
      {[0,1,2,3].map((i)=>(<PlayingCard key={i} back className="w-16 h-24 anim-floaty" style={{ animationDelay: `${i*0.2}s`, transform:`rotate(${(i-1.5)*8}deg)` }} />))}
    </div>,
    <div key="v1" className="flex gap-4 justify-center items-center">
      <PlayingCard back className="w-16 h-24" />
      <ArrowRight className="text-exit-red" />
      <PlayingCard rank="7" suit="♥" red className="w-16 h-24" />
    </div>,
    <div key="v2" className="flex gap-1 justify-center">
      {['10','J','Q','K','A'].map((r,i)=>(<PlayingCard key={i} rank={r} suit="♠" className="w-12 h-20" style={{ transform:`translateY(${Math.abs(i-2)*6}px)` }} />))}
    </div>,
  ]

  return (
    <SiteShell tone="#0c2018">
      <section className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(230,57,70,0.12),transparent_60%)]" />
        <div className="container relative">
          <Reveal>
            <span className="label text-[10px] text-exit-red">RULES OF THE ROAD</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[1.05]">HOW EXIT 52 WORKS</h1>
            <p className="mt-4 label text-xs text-exit-cream/50">3 STEPS. ONE GOAL. FIND YOUR EXIT.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-stretch">
          <div className="flex flex-col gap-3">
            {HOW_TO_STEPS.map((s, i) => {
              const on = i === step
              return (
                <button key={s.no} onClick={() => { setStep(i); track(EVENTS.howToStep, { step: s.no }) }}
                  className={`text-left rounded-xl border p-6 transition-all ${on ? 'border-exit-red bg-exit-red/10' : 'border-slate-900/10 hover:border-slate-900/20 bg-exit-charcoal/40'}`}>
                  <div className="flex items-baseline gap-4">
                    <span className={`font-display text-4xl ${on ? 'text-exit-red' : 'text-exit-cream/25'}`}>{s.no}</span>
                    <span className="font-cond font-bold text-xl">{s.title}</span>
                  </div>
                  {on && <p className="mt-3 text-sm text-exit-cream/60">{s.body}</p>}
                </button>
              )
            })}
          </div>
          <div className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-exit-charcoal to-exit-black p-10 flex flex-col items-center justify-center min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="w-full text-center">
                <div className="label text-[10px] text-exit-amber mb-2">STEP {active.no}</div>
                <h2 className="font-display text-4xl mb-8">{active.title}</h2>
                <div className="mb-8">{visuals[step]}</div>
                <p className="max-w-md mx-auto text-exit-cream/65">{active.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-20 text-center relative overflow-hidden border-y border-slate-900/10 bg-exit-charcoal/30">
        <div className="container relative">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl">BUT THERE&apos;S A CATCH...</h2>
            <p className="mt-4 text-xl text-exit-cream/70">Win the cards — or <span className="text-exit-red">face the Challenge.</span></p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-32 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">THE GOLDEN RULE</span>
            <h2 className="font-display text-4xl md:text-7xl mt-4 leading-[1.08]">
              PLAY YOUR CARDS.<br />COMPLETE YOUR FORMATION.<br /><span className="text-exit-red text-glow">REACH THE EXIT.</span>
            </h2>
            <p className="mt-8 text-exit-cream/60">Think you&apos;ve got it?</p>
            <Link href="/play" onClick={() => track(EVENTS.playFree, { from: 'how_to_play' })} className="mt-4 inline-flex items-center gap-2 label text-xs font-semibold px-8 py-4 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors">
              LET&apos;S PLAY <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
