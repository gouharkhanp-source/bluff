'use client'
import Link from 'next/link'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import { HOW_TO_STEPS, CARD_TYPES } from '@/lib/exit52/data'
import { ArrowRight } from 'lucide-react'

export default function Rules() {
  return (
    <SiteShell>
      <section className="pt-32 pb-10 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">THE RULEBOOK</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3">RULES</h1>
            <p className="mt-4 text-exit-cream/60">Everything you need at the table. Play your cards. Find your EXIT.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-3xl space-y-10">
          <Reveal>
            <h2 className="font-display text-3xl mb-4">OBJECTIVE</h2>
            <p className="text-exit-cream/70">Be the first to complete the required formation set by the Game Selector and reveal your EXIT. In 2-player games the loser faces the Challenge; in 3–6 player games the final two face it.</p>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-3xl mb-4">TURN SEQUENCE</h2>
            <ol className="space-y-3">
              {HOW_TO_STEPS.map((s) => (
                <li key={s.no} className="flex gap-4"><span className="font-display text-2xl text-exit-red">{s.no}</span><span className="text-exit-cream/70 pt-1">{s.body}</span></li>
              ))}
            </ol>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-3xl mb-4">THE CARDS</h2>
            <div className="space-y-3">
              {CARD_TYPES.map((c) => (
                <div key={c.key} className="rounded-xl border border-white/10 bg-exit-charcoal/40 p-4">
                  <div className="font-cond font-bold" style={{ color: c.color }}>{c.title}</div>
                  <p className="text-sm text-exit-cream/60 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-2xl border border-exit-red/30 bg-exit-red/5 p-8 text-center">
              <div className="label text-[10px] text-exit-red">THE GOLDEN RULE</div>
              <p className="font-display text-2xl md:text-3xl mt-2">PLAY YOUR CARDS. COMPLETE YOUR FORMATION. REACH THE EXIT.</p>
              <Link href="/play" className="mt-6 inline-flex items-center gap-2 label text-xs font-semibold px-7 py-3 rounded-md bg-exit-red text-white hover:bg-exit-crimson transition-colors">PLAY NOW <ArrowRight size={15} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
