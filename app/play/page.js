'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import PlayingCard from '@/components/exit52/PlayingCard'
import ChallengeWheel from '@/components/exit52/ChallengeWheel'
import { IMAGES } from '@/lib/exit52/images'
import { AVATARS, GAME_MODES } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { playShuffle } from '@/lib/exit52/sound'

const BOTS = ['ACE', 'RAZE', 'NOVA', 'KILO', 'VEGA']

export default function Play() {
  const [joined, setJoined] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [showChallenge, setShowChallenge] = useState(false)
  const [turn, setTurn] = useState(0)

  const join = () => {
    if (code.length !== 4 || !name.trim()) return
    track(EVENTS.roomCode, { code })
    playShuffle()
    setJoined(true)
  }

  const players = [{ name: name || 'YOU', avatar, you: true }, ...BOTS.slice(0, 3).map((b, i) => ({ name: b, avatar: AVATARS[(i + 3) % AVATARS.length], you: false }))]

  return (
    <SiteShell tone="#86E8B0">
      {!joined ? (
        <section className="pt-32 pb-24 min-h-[80vh] flex items-center">
          <div className="container max-w-md">
            <div className="text-center mb-8">
              <span className="label text-[10px] text-exit-red">PLAY FREE ONLINE</span>
              <h1 className="font-display text-4xl md:text-6xl mt-2">JOIN A ROOM</h1>
            </div>
            <div className="rounded-2xl border border-slate-900/10 bg-exit-charcoal/40 p-8 space-y-6">
              <div>
                <label className="label text-[10px] text-exit-cream/50">4-DIGIT ROOM CODE</label>
                <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="0000"
                  className="mt-2 w-full text-center font-display text-4xl tracking-[0.4em] rounded-md bg-exit-black border border-slate-900/10 py-4 outline-none focus:border-exit-red" />
              </div>
              <div>
                <label className="label text-[10px] text-exit-cream/50">PLAYER NAME</label>
                <input value={name} onChange={(e) => setName(e.target.value.slice(0, 12))} placeholder="Enter your name"
                  className="mt-2 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" />
              </div>
              <div>
                <label className="label text-[10px] text-exit-cream/50">CHOOSE AVATAR</label>
                <div className="mt-2 grid grid-cols-8 gap-2">
                  {AVATARS.map((a) => (
                    <button key={a} onClick={() => setAvatar(a)} className={`aspect-square rounded-md border text-xl grid place-items-center transition-all ${avatar === a ? 'border-exit-red bg-exit-red/15 text-exit-red' : 'border-slate-900/10 text-exit-cream/60 hover:border-slate-900/20'}`}>{a}</button>
                  ))}
                </div>
              </div>
              <button onClick={join} disabled={code.length !== 4 || !name.trim()} className="w-full label text-xs font-semibold py-4 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors disabled:opacity-40">JOIN LOBBY</button>
              <p className="text-center label text-[9px] text-exit-cream/30">FRONT-END PROTOTYPE — REAL-TIME MULTIPLAYER CONNECTS LATER</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-24 pb-20">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="label text-[10px] text-exit-cream/50">EXIT 52 GAME ROOM</div>
                <div className="font-display text-3xl">ROOM <span className="text-exit-red">{code}</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="label text-[10px] text-exit-cream/50">MODE: <span className="text-exit-amber">{GAME_MODES[0].title}</span></div>
                <div className="label text-[10px] text-exit-cream/50">TURN: <span className="text-exit-red">{players[turn % players.length]?.name}</span></div>
              </div>
            </div>

            {/* table */}
            <div className="relative rounded-[40px] border border-slate-900/10 overflow-hidden min-h-[460px] grid place-items-center">
              <img src={IMAGES.lobby} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.14]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,78,216,0.10),rgba(255,255,255,0.86))]" />

              {/* center piles */}
              <div className="relative z-10 flex items-center gap-6">
                <div className="text-center">
                  <PlayingCard back className="w-20 h-28 mx-auto" />
                  <div className="label text-[9px] text-exit-cream/50 mt-2">DRAW</div>
                </div>
                <div className="text-center">
                  <PlayingCard rank="9" suit="♦" red className="w-20 h-28 mx-auto" />
                  <div className="label text-[9px] text-exit-cream/50 mt-2">DISCARD</div>
                </div>
              </div>

              {/* players around */}
              {players.map((p, i) => {
                const pos = [
                  'bottom-4 left-1/2 -translate-x-1/2',
                  'top-1/2 left-4 -translate-y-1/2',
                  'top-4 left-1/2 -translate-x-1/2',
                  'top-1/2 right-4 -translate-y-1/2',
                ][i]
                return (
                  <div key={i} className={`absolute z-10 ${pos} flex flex-col items-center`}>
                    <div className={`h-11 w-11 rounded-full grid place-items-center text-xl border-2 ${p.you ? 'border-exit-red bg-exit-red/20 text-exit-red anim-pulseglow' : 'border-slate-900/15 bg-exit-black/70 text-exit-cream/70'}`}>{p.avatar}</div>
                    <div className={`mt-1 label text-[9px] ${p.you ? 'text-exit-red' : 'text-exit-cream/60'}`}>{p.name}</div>
                    <div className="flex -space-x-3 mt-1">
                      {[0,1,2].map((c)=>(<PlayingCard key={c} back className="w-6 h-9" />))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button onClick={() => { setTurn((t) => t + 1); playShuffle() }} className="label text-[11px] px-6 py-3 rounded-md border border-slate-900/10 hover:border-slate-900/25 transition-colors">END TURN</button>
              <button onClick={() => setShowChallenge(true)} className="label text-[11px] font-semibold px-6 py-3 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors">TRIGGER CHALLENGE</button>
            </div>
          </div>

          <AnimatePresence>
            {showChallenge && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm grid place-items-center p-6" onClick={() => setShowChallenge(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="rounded-2xl border border-slate-900/10 bg-exit-charcoal p-8">
                  <h3 className="font-display text-3xl text-center mb-4">THE CHALLENGE</h3>
                  <ChallengeWheel />
                  <button onClick={() => setShowChallenge(false)} className="mt-6 w-full label text-[10px] py-3 rounded-md border border-slate-900/10">CLOSE</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </SiteShell>
  )
}
