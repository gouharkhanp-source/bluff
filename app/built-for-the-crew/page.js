'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import FallingCards from '@/components/exit52/FallingCards'
import ChallengeWheel from '@/components/exit52/ChallengeWheel'
import Reveal from '@/components/exit52/Reveal'
import { ASSETS } from '@/lib/exit52/images'
import { GAME_MODES } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { ArrowRight, Star, Sparkles, PartyPopper, Car, Beer, Home as HomeIcon, Users, Clock, ShieldCheck } from 'lucide-react'

const OCCASIONS = [
  { icon: PartyPopper, label: 'GAME NIGHTS', color: '#e8232b' },
  { icon: Beer, label: 'HOUSE PARTIES', color: '#3a30b8' },
  { icon: Car, label: 'ROAD TRIPS', color: '#1fc3b6' },
  { icon: HomeIcon, label: 'FAMILY CHAOS', color: '#ff5da2' },
]
const STATS = [
  { icon: Users, big: '2–6', small: 'PLAYERS' },
  { icon: Clock, big: '15', small: 'MINUTES' },
  { icon: ShieldCheck, big: '16+', small: 'AGES' },
]

export default function HomePage() {
  const [mode, setMode] = useState(GAME_MODES[0].key)
  const active = GAME_MODES.find((m) => m.key === mode)

  return (
    <SiteShell tone="#241436">
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-16">
        <FallingCards count={12} />
        <Star className="absolute top-28 right-12 text-exit-yellow anim-wiggle hidden md:block z-[1]" size={44} fill="#ffd23f" strokeWidth={1.5} />
        <Sparkles className="absolute bottom-28 left-8 text-exit-pink anim-bobble hidden md:block z-[1]" size={38} />

        <div className="container relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center py-20">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="sticker inline-block label text-[10px] bg-exit-yellow text-exit-cream px-4 py-1.5 mb-6">THE BLUFFING CARD GAME</span>
              <h1 className="font-display text-6xl sm:text-6xl md:text-7xl leading-[1.05]">
                PLAY YOUR<br /><span className="marker">CARDS.</span><br />
                <span className="text-exit-red text-glow">FIND YOUR EXIT.</span>
              </h1>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/play" onClick={() => track(EVENTS.playFree, { from: 'hero' })} className="group inline-flex items-center gap-2 label text-xs font-semibold px-7 py-4 btn-pop bg-exit-red text-white">
                  PLAY FREE ONLINE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/editions" onClick={() => track(EVENTS.preBook, { from: 'hero' })} className="inline-flex items-center label text-xs px-7 py-4 btn-pop bg-exit-yellow text-exit-cream">
                  SHOP THE DECK
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[480px]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img src={ASSETS.s1} alt="Game Changer card" className="w-44 absolute -left-44 top-8 drop-shadow-2xl anim-floaty" style={{ ['--r']: '-16deg' }} />
              <img src={ASSETS.a1} alt="Lucky Joker card" className="w-40 absolute -left-16 top-24 drop-shadow-2xl anim-floaty" style={{ animationDelay: '1.1s', ['--r']: '-6deg' }} />
              <img src={ASSETS.a3} alt="Ultimate Victor card" className="w-52 relative z-10 drop-shadow-2xl anim-floaty" style={{ animationDelay: '0.6s' }} />
              <img src={ASSETS.s2} alt="Virus Attacker card" className="w-40 absolute -right-16 top-24 drop-shadow-2xl anim-floaty" style={{ animationDelay: '1.4s', ['--r']: '8deg' }} />
              <img src={ASSETS.a5} alt="Exit Phantom card" className="w-44 absolute -right-44 top-8 drop-shadow-2xl anim-floaty" style={{ animationDelay: '0.9s', ['--r']: '16deg' }} />
            </div>
          </div>
        </div>
      </section>

      {/* WHO & WHEN — audience via animation */}
      <section className="relative py-24 bg-exit-charcoal border-y-2 border-white/10 overflow-hidden">
        <div className="container text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl text-exit-cream">BUILT FOR <span className="text-exit-red">YOUR CREW.</span></h2>
            <p className="mt-3 text-exit-cream/55">Whip it out anywhere the vibe needs a shake-up.</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {OCCASIONS.map((o, i) => {
              const Icon = o.icon
              return (
                <motion.div key={o.label} initial={{ opacity: 0, scale: 0.6, rotate: -8 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 220, damping: 12, delay: i * 0.1 }}>
                  <div className="rounded-3xl border-2 border-white/10 bg-exit-charcoal p-6 shadow-[4px_4px_0_0_#000000] hover-wiggle">
                    <div className="h-16 w-16 mx-auto rounded-full grid place-items-center" style={{ backgroundColor: o.color + '22' }}>
                      <Icon size={30} style={{ color: o.color }} />
                    </div>
                    <div className="mt-4 font-display text-lg text-exit-cream">{o.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-6 md:gap-14">
            {STATS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={s.small} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 + i * 0.12 }} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-exit-yellow grid place-items-center border-2 border-exit-ink anim-bobble">
                    <Icon size={22} className="text-exit-cream" />
                  </div>
                  <div className="text-left">
                    <div className="font-display text-4xl md:text-5xl text-exit-cream leading-none">{s.big}</div>
                    <div className="label text-[10px] text-exit-cream/50">{s.small}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* THE HOOK */}
      <section className="relative py-24 md:py-28 overflow-hidden bg-[#fff7f7]">
        <div className="container relative">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl text-center text-exit-cream leading-[1.08]">WIN THE CARDS.<br /><span className="text-exit-red text-glow">OR FACE THE CHALLENGE.</span></h2>
          </Reveal>
          <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <Reveal><div className="rounded-3xl border-2 border-white/10 bg-exit-charcoal p-6"><div className="label text-xs text-exit-blue">2 PLAYERS</div><p className="mt-1 text-exit-cream/70">One player wins. The other faces the Challenge.</p></div></Reveal>
              <Reveal delay={0.1}><div className="rounded-3xl border-2 border-white/10 bg-exit-charcoal p-6"><div className="label text-xs text-exit-blue">3–6 PLAYERS</div><p className="mt-1 text-exit-cream/70">The final two players face the Challenge.</p></div></Reveal>
            </div>
            <Reveal delay={0.15}><ChallengeWheel /></Reveal>
          </div>
        </div>
      </section>

      {/* GAME MODES */}
      <section className="relative py-24 bg-[#eef7f6] border-y-2 border-white/10">
        <div className="container">
          <Reveal><h2 className="font-display text-4xl md:text-6xl text-exit-cream">PICK YOUR <span className="text-exit-red">MODE.</span></h2></Reveal>
          <div className="mt-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="flex flex-col gap-3">
              {GAME_MODES.map((m) => {
                const on = m.key === mode
                return (
                  <button key={m.key} onClick={() => setMode(m.key)} className={`text-left rounded-3xl border-2 p-5 transition-all ${on ? 'border-exit-red bg-exit-charcoal shadow-[4px_4px_0_0_#000000]' : 'border-white/10 hover:border-white/25 bg-exit-charcoal/60'}`}>
                    <span className="font-cond font-bold text-exit-cream">{m.title}</span>
                    <p className="text-xs text-exit-cream/55 mt-1">{m.short}</p>
                  </button>
                )
              })}
            </div>
            <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl border-2 border-white/10 bg-exit-charcoal p-8 flex flex-col justify-center">
              <div className="label text-[10px] text-exit-red">SELECTED MODE</div>
              <h3 className="font-display text-4xl md:text-5xl mt-2 text-exit-cream">{active.title}</h3>
              <p className="mt-4 text-exit-cream/60 max-w-md">{active.desc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-28 text-center overflow-hidden bg-exit-charcoal">
        <FallingCards count={10} />
        <div className="container relative">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl text-exit-cream">READY TO <span className="text-exit-red text-glow">EXIT?</span></h2>
            <p className="mt-4 text-exit-cream/60 max-w-lg mx-auto">Grab a deck, or jump into a free browser game right now.</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/editions" onClick={() => track(EVENTS.preBook, { from: 'cta_band' })} className="label text-xs font-semibold px-8 py-4 btn-pop bg-exit-red text-white">SHOP THE DECK</Link>
              <Link href="/play" onClick={() => track(EVENTS.playFree, { from: 'cta_band' })} className="label text-xs px-8 py-4 btn-pop bg-exit-yellow text-exit-cream">PLAY FREE ONLINE</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
