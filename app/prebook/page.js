'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import PlayingCard from '@/components/exit52/PlayingCard'
import { IMAGES, ASSETS } from '@/lib/exit52/images'
import { EDITIONS, PERKS } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = ['CHOOSE YOUR EDITION', 'ENTER YOUR DETAILS', 'SHIPPING', 'DEPOSIT / PAYMENT', 'CONFIRM YOUR EXIT']

export default function PreBook() {
  const [cfg, setCfg] = useState(null)
  const [barPct, setBarPct] = useState(0)
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ edition: EDITIONS[1].id, name: '', email: '', address: '', city: '', country: '', deposit: 5 })

  const loadCfg = () => fetch('/api/config').then((r) => r.json()).then((c) => { setCfg(c); setTimeout(() => setBarPct(c.percent), 300) }).catch(() => {})

  useEffect(() => {
    loadCfg()
    const q = new URLSearchParams(window.location.search).get('edition')
    if (q && EDITIONS.find((e) => e.id === q)) setForm((f) => ({ ...f, edition: q }))
    track(EVENTS.reservationStart)
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const selEd = EDITIONS.find((e) => e.id === form.edition)

  const canNext = () => {
    if (step === 0) return !!form.edition
    if (step === 1) return form.name.trim() && /.+@.+\..+/.test(form.email)
    if (step === 2) return form.address.trim() && form.city.trim() && form.country.trim()
    return true
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edition: form.edition, name: form.name, email: form.email, shipping: { address: form.address, city: form.city, country: form.country }, deposit: form.deposit }),
      })
      const data = await res.json()
      setDone(data.reservation)
      if (data.config) { setCfg(data.config); setBarPct(data.config.percent) }
      track(EVENTS.reservationComplete, { edition: form.edition })
    } catch (e) { /* noop */ } finally { setSubmitting(false) }
  }

  return (
    <SiteShell tone="#fffaf0">
      <section className="pt-28 pb-12 relative overflow-hidden">
        <img src={IMAGES.prebook} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-exit-black/70 to-exit-black" />
        <div className="container relative text-center">
          <Reveal>
            <span className="label text-[10px] text-exit-red">PRE-BOOK / RESERVATION</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[1.05]">YOUR EXIT IS <span className="text-exit-red text-glow">WAITING.</span></h1>
            <p className="mt-4 text-exit-cream/60">Reserve your place in the first production batch.</p>
          </Reveal>

          {cfg && (
            <Reveal delay={0.1}>
              <div className="mt-10 max-w-xl mx-auto rounded-2xl border border-slate-900/10 bg-exit-charcoal/60 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="label text-xs text-exit-amber">{cfg.batchLabel}</span>
                  <span className="font-display text-2xl text-exit-red">{cfg.percent}% RESERVED</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/10 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-exit-red to-exit-orange" initial={{ width: 0 }} animate={{ width: `${barPct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
                <p className="mt-2 text-[11px] text-exit-cream/40">{cfg.reservedCount} of {cfg.batchGoal} reserved</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* DECK PACK */}
      <section className="relative py-16 bg-white">
        <div className="container">
          <Reveal>
            <div className="text-center mb-8">
              <span className="label text-[10px] text-exit-red">FUN EDITION</span>
              <h2 className="font-display text-4xl md:text-6xl mt-2 text-exit-ink">WHAT&apos;S IN THE <span className="text-exit-red">PACK.</span></h2>
              <p className="mt-3 text-exit-ink/50">110 cards · 2–6 players · Ages 16+ · Game Modes, Sabotage &amp; Accelerator cards.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative rounded-2xl border border-slate-900/10 bg-[#f7f8fb] p-4 md:p-8 shadow-[0_30px_70px_-30px_rgba(58,48,184,0.4)]">
              <img src={ASSETS.deckPack} alt="EXIT 52 Fun Edition deck pack — 110 cards, game modes, sabotage and accelerator cards, gameplay instructions" loading="lazy" className="w-full h-auto rounded-xl" />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['110 CARDS', 'PLAYERS 2–6', 'AGES 16+', '₹399'].map((t) => (
                <span key={t} className="label text-[10px] px-4 py-2 rounded-full border border-slate-900/15 text-exit-ink/70">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PERKS */}
      <section className="py-16 border-y border-slate-900/10 bg-exit-charcoal/20">
        <div className="container grid gap-5 md:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="rounded-xl border border-slate-900/10 bg-exit-charcoal/40 p-6 h-full">
                <div className="text-3xl text-exit-red mb-3">{p.glyph}</div>
                <div className="font-cond font-bold">{p.title}</div>
                <p className="text-sm text-exit-cream/55 mt-1">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESERVATION FLOW */}
      <section className="py-20">
        <div className="container max-w-3xl">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <h2 className="font-display text-5xl md:text-7xl text-exit-red text-glow">YOU&apos;RE IN.</h2>
              <div className="mt-8 mx-auto max-w-sm rounded-2xl border border-exit-red/40 bg-exit-charcoal/60 p-8">
                <div className="flex justify-center mb-6"><PlayingCard back className="w-24 h-36" /></div>
                <div className="label text-[10px] text-exit-cream/50">CONFIRMATION</div>
                <div className="font-display text-3xl text-exit-amber mt-1">{done.code}</div>
                <div className="mt-4 text-sm text-exit-cream/60">{EDITIONS.find((e) => e.id === done.edition)?.title}</div>
                <div className="text-xs text-exit-cream/40 mt-1">Confirmation sent to {done.email}</div>
              </div>
              <p className="mt-6 label text-[10px] text-exit-cream/40">DEPOSIT IS A PROTOTYPE — NO REAL CHARGE WAS MADE</p>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-slate-900/10 bg-exit-charcoal/40 p-6 md:p-10">
              {/* progress */}
              <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= step ? 'bg-exit-red' : 'bg-slate-900/10'}`} />
                    <div className={`mt-2 label text-[8px] hidden sm:block ${i === step ? 'text-exit-red' : 'text-exit-cream/30'}`}>{s}</div>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div className="label text-[10px] text-exit-amber mb-1">STEP {step + 1} / 5</div>
                  <h3 className="font-display text-3xl mb-6">{STEPS[step]}</h3>

                  {step === 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {EDITIONS.map((e) => (
                        <button key={e.id} onClick={() => set('edition', e.id)} className={`text-left rounded-xl border p-4 transition-all ${form.edition === e.id ? 'border-exit-red bg-exit-red/10' : 'border-slate-900/10 hover:border-slate-900/20'}`}>
                          <div className="font-cond font-bold text-sm">{e.title}</div>
                          <div className="font-display text-2xl mt-1">${e.price}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div><label className="label text-[10px] text-exit-cream/50">FULL NAME</label><input value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" placeholder="Jane Doe" /></div>
                      <div><label className="label text-[10px] text-exit-cream/50">EMAIL</label><input value={form.email} onChange={(e) => set('email', e.target.value)} className="mt-1 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" placeholder="jane@example.com" /></div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div><label className="label text-[10px] text-exit-cream/50">ADDRESS</label><input value={form.address} onChange={(e) => set('address', e.target.value)} className="mt-1 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" placeholder="1 Highway Rd" /></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="label text-[10px] text-exit-cream/50">CITY</label><input value={form.city} onChange={(e) => set('city', e.target.value)} className="mt-1 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" /></div>
                        <div><label className="label text-[10px] text-exit-cream/50">COUNTRY</label><input value={form.country} onChange={(e) => set('country', e.target.value)} className="mt-1 w-full rounded-md bg-exit-black border border-slate-900/10 px-4 py-3 outline-none focus:border-exit-red" /></div>
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div>
                      <p className="text-exit-cream/60 mb-4">Secure your <span className="text-exit-cream">{selEd?.title}</span> with a small refundable deposit.</p>
                      <div className="flex gap-3">
                        {[5, 10, 20].map((d) => (
                          <button key={d} onClick={() => set('deposit', d)} className={`flex-1 rounded-xl border py-6 font-display text-3xl transition-all ${form.deposit === d ? 'border-exit-red bg-exit-red/10 text-exit-red' : 'border-slate-900/10 hover:border-slate-900/20'}`}>${d}</button>
                        ))}
                      </div>
                      <p className="mt-4 label text-[10px] text-exit-cream/40">PROTOTYPE CHECKOUT — NO REAL PAYMENT IS PROCESSED</p>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-3 text-sm">
                      {[['Edition', selEd?.title], ['Name', form.name], ['Email', form.email], ['Ship to', `${form.address}, ${form.city}, ${form.country}`], ['Deposit', `$${form.deposit} (prototype)`]].map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-slate-900/10 pb-2"><span className="text-exit-cream/50">{k}</span><span className="text-right">{v}</span></div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex justify-between">
                <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-2 label text-[11px] px-5 py-3 rounded-md border border-slate-900/10 disabled:opacity-30"><ArrowLeft size={14} /> BACK</button>
                {step < 4 ? (
                  <button onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()} className="inline-flex items-center gap-2 label text-[11px] font-semibold px-6 py-3 btn-pop bg-exit-red text-white disabled:opacity-40">NEXT <ArrowRight size={14} /></button>
                ) : (
                  <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 label text-[11px] font-semibold px-6 py-3 btn-pop bg-exit-red text-white disabled:opacity-60">{submitting ? 'RESERVING...' : 'CONFIRM YOUR EXIT'} <Check size={14} /></button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}
