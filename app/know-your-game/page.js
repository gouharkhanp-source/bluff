'use client'
import Link from 'next/link'
import SiteShell from '@/components/exit52/SiteShell'
import SpecialCard from '@/components/exit52/SpecialCard'
import Reveal from '@/components/exit52/Reveal'
import { HOW_TO_STEPS, SPECIAL_CARDS, POWER_CARDS } from '@/lib/exit52/data'
import { ASSETS } from '@/lib/exit52/images'
import { ArrowRight } from 'lucide-react'

export default function KnowYourGame() {
  return (
    <SiteShell tone="#f3f2fc">
      <section className="pt-32 pb-14 text-center">
        <div className="container">
          <Reveal>
            <span className="sticker inline-block label text-[10px] bg-exit-yellow text-exit-ink px-4 py-1.5 mb-5">KNOW YOUR GAME</span>
            <h1 className="font-display text-5xl md:text-7xl text-exit-ink">HOW EXIT 52 <span className="text-exit-red">WORKS.</span></h1>
            <p className="mt-3 text-exit-ink/60">3 steps. One goal. Find your EXIT.</p>
          </Reveal>
        </div>
      </section>

      {/* STEPS */}
      <section className="pb-20">
        <div className="container grid md:grid-cols-3 gap-6">
          {HOW_TO_STEPS.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08}>
              <div className="h-full rounded-3xl border-2 border-slate-900/10 bg-white p-7">
                <div className="font-display text-5xl text-exit-red">{s.no}</div>
                <h3 className="font-cond text-xl mt-2 text-exit-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-exit-ink/60">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SABOTAGE */}
      <section className="py-20 bg-[#16171b]">
        <div className="container">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl text-white">THE <span className="text-exit-red">SABOTAGE CARDS.</span></h2>
          </Reveal>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {SPECIAL_CARDS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="snap-center shrink-0 w-[210px] md:w-auto"><SpecialCard card={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POWER */}
      <section className="py-20 bg-[#211a5e]">
        <div className="container">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl text-white">THE <span className="text-[#b9b2ff]">POWER CARDS.</span></h2>
          </Reveal>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {POWER_CARDS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="snap-center shrink-0 w-[210px] md:w-auto"><SpecialCard card={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WIN RULES */}
      <section className="py-20 bg-white">
        <div className="container text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl text-exit-ink">KNOW YOUR <span className="text-exit-red">WIN RULES.</span></h2>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={ASSETS.gameModesFan} alt="EXIT 52 win rules: Power Pair, Trio, Sequence and Pair" loading="lazy" className="mt-10 w-full max-w-5xl mx-auto h-auto" />
          </Reveal>
        </div>
      </section>

      {/* GOLDEN RULE */}
      <section className="py-24 text-center bg-[#f3f2fc]">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">THE GOLDEN RULE</span>
            <h2 className="font-display text-4xl md:text-6xl mt-3 text-exit-ink leading-[1.08]">PLAY YOUR CARDS.<br />COMPLETE YOUR FORMATION.<br /><span className="text-exit-red">REACH THE EXIT.</span></h2>
            <Link href="/play" className="mt-8 inline-flex items-center gap-2 label text-xs font-semibold px-8 py-4 btn-pop bg-exit-red text-white">LET&apos;S PLAY <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
