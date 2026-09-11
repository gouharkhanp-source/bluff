'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import { EDITIONS, COMPARISON_ROWS } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { playClick } from '@/lib/exit52/sound'
import { Check, X, ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react'

const badgeColor = {
  DIGITAL: 'text-exit-amber border-exit-amber/40',
  'BEST VALUE': 'text-exit-red border-exit-red/40',
  'MOST CHAOS': 'text-exit-orange border-exit-orange/40',
  COLLECTOR: 'text-exit-silver border-exit-silver/40',
}

export default function Editions() {
  const [cart, setCart] = useState({})

  const add = (id) => {
    playClick()
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
    track(EVENTS.editionSelect, { edition: id, action: 'add-to-cart' })
  }
  const dec = (id) =>
    setCart((c) => {
      const n = (c[id] || 0) - 1
      const next = { ...c }
      if (n <= 0) delete next[id]
      else next[id] = n
      return next
    })

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ ...EDITIONS.find((e) => e.id === id), qty }))
        .filter((e) => e.id),
    [cart]
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.qty * i.price, 0)
  const checkoutHref = items.length ? `/prebook?edition=${items[0].id}` : '/prebook'

  return (
    <SiteShell tone="#2a0b14">
      <section className="pt-32 pb-14 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">SHOP · GAME EDITIONS</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[1.05]">HOW DO YOU WANT TO <span className="text-exit-red">EXIT?</span></h1>
            <p className="mt-4 text-exit-cream/60 max-w-xl mx-auto">Pick your pack, add it to your cart and pre-book your place in the first batch.</p>
          </Reveal>
        </div>
      </section>

      <section className={`pb-20 ${count ? 'md:pb-24' : ''}`}>
        <div className="container grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {EDITIONS.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-white/10 bg-exit-charcoal p-5 flex flex-col neon-edge hover:border-exit-red/50 hover:-translate-y-1">
                {/* product photo */}
                <div className="relative rounded-xl overflow-hidden bg-[#f4f2fb] aspect-[4/3] grid place-items-center p-3">
                  {e.img ? (
                    <img
                      src={e.img}
                      alt={`${e.title} — EXIT 52 edition`}
                      loading="lazy"
                      className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.06] group-hover:-rotate-2"
                    />
                  ) : (
                    <span className="font-display text-5xl text-exit-cream/15">{e.no}</span>
                  )}
                  <span className={`absolute top-2 right-2 label text-[9px] border rounded-full px-2 py-1 bg-exit-charcoal/90 ${badgeColor[e.badge] || 'text-exit-cream/60 border-white/15'}`}>{e.badge}</span>
                </div>

                <h3 className="font-cond font-bold text-lg mt-4 min-h-[52px]">{e.title}</h3>
                <p className="text-xs text-exit-cream/50 -mt-1">{e.tagline}</p>
                <div className="mt-3 font-display text-4xl">${e.price}</div>
                <ul className="mt-4 space-y-2 flex-1">
                  {e.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-exit-cream/70">
                      <Check size={15} className="text-exit-red mt-0.5 shrink-0" /> {inc}
                    </li>
                  ))}
                </ul>

                {cart[e.id] ? (
                  <div className="mt-6 flex items-center justify-between rounded-full border-2 border-white/20/70 p-1">
                    <button onClick={() => dec(e.id)} aria-label="Remove one" className="grid place-items-center h-9 w-9 rounded-full bg-exit-charcoal hover:bg-exit-red hover:text-white transition-colors"><Minus size={15} /></button>
                    <span className="font-display text-lg">{cart[e.id]} in cart</span>
                    <button onClick={() => add(e.id)} aria-label="Add one" className="grid place-items-center h-9 w-9 rounded-full bg-exit-charcoal hover:bg-exit-red hover:text-white transition-colors"><Plus size={15} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => add(e.id)}
                    className="mt-6 inline-flex items-center justify-center gap-2 label text-[11px] font-semibold py-3 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors"
                  >
                    <ShoppingCart size={15} /> ADD TO CART
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-28">
        <div className="container">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl mb-8 text-center">COMPARE THE DECKS</h2>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-exit-charcoal">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-exit-charcoal/60">
                    <th className="text-left p-4 label text-[10px] text-exit-cream/50">FEATURE</th>
                    {EDITIONS.map((e) => (
                      <th key={e.id} className="p-4 font-cond font-bold text-xs">{e.title.split(' ')[0]}<br /><span className="text-exit-cream/40 font-normal">${e.price}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 ? 'bg-white/[0.03]' : ''}>
                      <td className="p-4 text-exit-cream/70">{row.label}</td>
                      {row.values.map((v, ci) => (
                        <td key={ci} className="p-4 text-center">
                          {v ? <Check size={18} className="text-exit-red mx-auto" /> : <X size={16} className="text-exit-cream/20 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sticky cart bar */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4"
          >
            <div className="container">
              <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-white/20 bg-exit-charcoal px-5 py-3.5 shadow-[6px_6px_0_0_#000000]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="relative grid place-items-center h-11 w-11 rounded-full bg-exit-red text-white shrink-0">
                    <ShoppingCart size={18} />
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-exit-ink text-white text-[10px] font-bold">{count}</span>
                  </span>
                  <div className="min-w-0">
                    <div className="font-cond font-bold text-sm truncate">{count} item{count > 1 ? 's' : ''} · ${total}</div>
                    <div className="label text-[9px] text-exit-cream/45 truncate">{items.map((i) => `${i.title.split(' ')[0]}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(' · ')}</div>
                  </div>
                </div>
                <Link
                  href={checkoutHref}
                  onClick={() => track(EVENTS.preBook, { from: 'cart', total })}
                  className="inline-flex items-center gap-2 label text-[11px] font-semibold px-5 h-11 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors shrink-0"
                >
                  PRE-BOOK <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  )
}
