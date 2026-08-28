'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import PlayingCard from '@/components/exit52/PlayingCard'
import FallingCards from '@/components/exit52/FallingCards'
import ChallengeWheel from '@/components/exit52/ChallengeWheel'
import Reveal from '@/components/exit52/Reveal'
import { IMAGES, ASSETS } from '@/lib/exit52/images'
import { CARD_TYPES, GAME_MODES, SPECIAL_CARDS, POWER_CARDS, WIN_RULES } from '@/lib/exit52/data'
import SpecialCard from '@/components/exit52/SpecialCard'
import WinRuleCard from '@/components/exit52/WinRuleCard'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { ArrowRight, Zap, Users, Wifi } from 'lucide-react'

function FlowStep({ label, sub }) {
  return (
    <div className="text-center">
      <div className="label text-xs md:text-sm text-exit-cream font-semibold">{label}</div>
      {sub && <div className="text-[11px] text-exit-cream/40 mt-1">{sub}</div>}
    </div>
  )
}

export default function HomePage() {
  const [mode, setMode] = useState(GAME_MODES[0].key)
  const active = GAME_MODES.find((m) => m.key === mode)
  const modeIcon = { tabletop: Users, remote: Wifi, digital: Zap }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-exit-black/80 via-exit-black/70 to-exit-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-exit-black via-exit-black/40 to-transparent" />
        <FallingCards count={12} />

        <div className="container relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center py-20">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block label text-[10px] text-exit-red border border-exit-red/40 rounded-full px-3 py-1 mb-6">THE BLUFFING CARD GAME</span>
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.86]">
                PLAY YOUR<br />CARDS.<br />
                <span className="text-exit-red text-glow">FIND YOUR EXIT.</span>
              </h1>
              <p className="mt-6 max-w-md text-base md:text-lg text-exit-cream/60">
                A fast-paced bluffing card game where you match your way out — or face the Challenge.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/play" onClick={() => track(EVENTS.playFree, { from: 'hero' })} className="group inline-flex items-center gap-2 label text-xs font-semibold px-7 h-13 py-4 rounded-md bg-exit-red text-white hover:bg-exit-crimson transition-colors">
                  PLAY FREE ONLINE <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/prebook" onClick={() => track(EVENTS.preBook, { from: 'hero' })} className="inline-flex items-center label text-xs px-7 py-4 rounded-md border border-exit-cream/30 text-exit-cream hover:border-exit-cream hover:bg-slate-900/[0.03] transition-colors">
                  PRE-BOOK THE DECK
                </Link>
              </div>
            </motion.div>
          </div>

          {/* floating real-deck cluster */}
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

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 label text-[9px] text-exit-cream/40">SCROLL TO DISCOVER</div>
      </section>

      {/* WHAT IS EXIT 52 */}
      <section className="relative py-24 md:py-32">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">WHAT IS EXIT 52?</span>
            <h2 className="font-display text-4xl md:text-6xl mt-3 max-w-3xl leading-none">
              A CARD GAME WITH A <span className="text-exit-amber">DIGITAL TWIST.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-exit-cream/60">
              EXIT 52 combines the familiarity of a physical card game with optional digital browser interaction. Play with a physical deck, sync your game using a browser room, trigger digital events, play remotely — or play entirely online.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-slate-900/10 bg-exit-charcoal/50 p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <FlowStep label="PHYSICAL DECK" sub="Deal & play" />
                <ArrowRight className="text-exit-red rotate-90 md:rotate-0" size={20} />
                <FlowStep label="ROOM CODE" sub="QR / NFC" />
                <ArrowRight className="text-exit-red rotate-90 md:rotate-0" size={20} />
                <FlowStep label="DIGITAL GAME ROOM" sub="Browser lobby" />
                <ArrowRight className="text-exit-red rotate-90 md:rotate-0" size={20} />
                <FlowStep label="LIVE EVENTS" sub="Challenge time" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-10 font-display text-2xl md:text-4xl text-center leading-tight">
              NO APP. <span className="text-exit-cream/30">NO COMPLEX HARDWARE.</span><br />
              JUST <span className="text-exit-red">DEAL, PLAY &amp; EXIT.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* CARD SHOWCASE */}
      <section className="relative py-24 bg-exit-charcoal/30 border-y border-slate-900/10">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-display text-4xl md:text-6xl leading-none">KNOW YOUR <span className="text-exit-red">CARDS.</span></h2>
              <p className="label text-[10px] text-exit-cream/40">HOVER · TILT · REVEAL</p>
            </div>
          </Reveal>

          <div className="mt-12 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible">
            {CARD_TYPES.map((c, i) => (
              <Reveal key={c.key} delay={i * 0.06} className="snap-center shrink-0 w-[220px] md:w-auto">
                <div className="group [perspective:1200px]">
                  <div className="relative transition-transform duration-500 group-hover:[transform:rotateY(8deg)_rotateX(6deg)_translateY(-8px)]" style={{ transformStyle: 'preserve-3d' }}>
                    <PlayingCard
                      faceContent={<span className="sr-only">{c.title}</span>}
                      tag={c.tag}
                      title={c.title}
                      glyph={c.glyph}
                      accent={c.color}
                      className="w-full aspect-[3/4.4] transition-shadow duration-500"
                      style={{ boxShadow: `0 20px 50px -20px ${c.color}80` }}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="font-cond font-bold text-sm" style={{ color: c.color }}>{c.title}</div>
                    <p className="text-xs text-exit-cream/55 mt-1 min-h-[48px]">{c.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SABOTAGE CARDS */}
      <section className="relative py-24 bg-[#16171b]">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-display text-4xl md:text-6xl leading-none text-white">THE <span className="text-exit-red">SABOTAGE CARDS.</span></h2>
              <p className="label text-[10px] text-white/40">DISRUPT · INFECT · STEAL · SEAL</p>
            </div>
          </Reveal>
          <div className="mt-12 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {SPECIAL_CARDS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="snap-center shrink-0 w-[220px] md:w-auto"><SpecialCard card={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POWER CARDS */}
      <section className="relative py-24 bg-[#211a5e]">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-display text-4xl md:text-6xl leading-none text-white">THE <span className="text-[#b9b2ff]">POWER CARDS.</span></h2>
              <p className="label text-[10px] text-white/40">YOUR ESCAPE PLAN</p>
            </div>
          </Reveal>
          <div className="mt-12 flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {POWER_CARDS.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="snap-center shrink-0 w-[220px] md:w-auto"><SpecialCard card={c} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WIN RULES */}
      <section className="relative py-24 bg-white">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="font-display text-4xl md:text-6xl leading-none text-exit-ink">KNOW YOUR <span className="text-exit-red">WIN RULES.</span></h2>
              <p className="label text-[10px] text-exit-ink/40">THE GAME SELECTOR DECIDES</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <img src={ASSETS.gameModesFan} alt="EXIT 52 win rules: Power Pair, Trio, Sequence and Pair game selector cards" loading="lazy" className="mt-12 w-full max-w-5xl mx-auto h-auto" />
          </Reveal>
        </div>
      </section>

      {/* THE HOOK */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,57,70,0.12),transparent_65%)]" />
        <div className="container relative">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl text-center leading-[0.9]">
              WIN THE CARDS.<br /><span className="text-exit-red text-glow">OR FACE THE CHALLENGE.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-8">
              <Reveal>
                <div className="rounded-xl border border-slate-900/10 bg-exit-charcoal/50 p-6">
                  <div className="label text-xs text-exit-amber">2 PLAYERS</div>
                  <p className="mt-2 text-exit-cream/70">One player wins. The other faces the Challenge.</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="rounded-xl border border-slate-900/10 bg-exit-charcoal/50 p-6">
                  <div className="label text-xs text-exit-amber">3–6 PLAYERS</div>
                  <p className="mt-2 text-exit-cream/70">The final two players face the Challenge.</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <ChallengeWheel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* GAME MODES */}
      <section className="relative py-24 bg-exit-charcoal/30 border-y border-slate-900/10">
        <div className="container">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-none">PICK YOUR <span className="text-exit-red">MODE.</span></h2>
          </Reveal>
          <div className="mt-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="flex flex-col gap-3">
              {GAME_MODES.map((m) => {
                const Icon = modeIcon[m.key]
                const on = m.key === mode
                return (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`text-left rounded-xl border p-5 transition-all ${on ? 'border-exit-red bg-exit-red/10' : 'border-slate-900/10 hover:border-slate-900/20 bg-exit-charcoal/40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={on ? 'text-exit-red' : 'text-exit-cream/50'} />
                      <span className="font-cond font-bold">{m.title}</span>
                    </div>
                    <p className="text-xs text-exit-cream/50 mt-1">{m.short}</p>
                  </button>
                )
              })}
            </div>
            <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-exit-charcoal to-exit-black p-8 flex flex-col justify-center">
              <div className="label text-[10px] text-exit-red">SELECTED MODE</div>
              <h3 className="font-display text-4xl md:text-5xl mt-2">{active.title}</h3>
              <p className="mt-4 text-exit-cream/60 max-w-md">{active.desc}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <FallingCards count={10} />
        <div className="container relative">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl leading-none">READY TO <span className="text-exit-red text-glow">EXIT?</span></h2>
            <p className="mt-4 text-exit-cream/60 max-w-lg mx-auto">Jump into a free browser game, or reserve your deck from the first production batch.</p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/play" onClick={() => track(EVENTS.playFree, { from: 'cta_band' })} className="label text-xs font-semibold px-8 py-4 rounded-md bg-exit-red text-white hover:bg-exit-crimson transition-colors">PLAY FREE ONLINE</Link>
              <Link href="/editions" className="label text-xs px-8 py-4 rounded-md border border-exit-cream/30 hover:border-exit-cream transition-colors">VIEW EDITIONS</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
