'use client'
import Link from 'next/link'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import { EDITIONS, COMPARISON_ROWS } from '@/lib/exit52/data'
import { track, EVENTS } from '@/lib/exit52/analytics'
import { Check, X } from 'lucide-react'

const badgeColor = {
  DIGITAL: 'text-exit-amber border-exit-amber/40',
  'BEST VALUE': 'text-exit-red border-exit-red/40',
  'MOST CHAOS': 'text-exit-orange border-exit-orange/40',
  COLLECTOR: 'text-exit-silver border-exit-silver/40',
}

export default function Editions() {
  return (
    <SiteShell>
      <section className="pt-32 pb-14 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">GAME EDITIONS</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3 leading-[1.05]">HOW DO YOU WANT TO <span className="text-exit-red">EXIT?</span></h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {EDITIONS.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-slate-900/10 bg-exit-charcoal/40 p-6 flex flex-col hover:border-exit-red/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl text-exit-cream/20">{e.no}</span>
                  <span className={`label text-[9px] border rounded-full px-2 py-1 ${badgeColor[e.badge] || 'text-exit-cream/60 border-slate-900/15'}`}>{e.badge}</span>
                </div>
                <h3 className="font-cond font-bold text-lg mt-4 min-h-[56px]">{e.title}</h3>
                <p className="text-xs text-exit-cream/50 mt-1">{e.tagline}</p>
                <div className="mt-4 font-display text-4xl">${e.price}</div>
                <ul className="mt-4 space-y-2 flex-1">
                  {e.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-exit-cream/70">
                      <Check size={15} className="text-exit-red mt-0.5 shrink-0" /> {inc}
                    </li>
                  ))}
                </ul>
                <Link href={`/prebook?edition=${e.id}`} onClick={() => track(EVENTS.editionSelect, { edition: e.id })}
                  className="mt-6 text-center label text-[11px] font-semibold py-3 btn-pop bg-exit-red text-white hover:bg-exit-crimson transition-colors">
                  {e.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-28">
        <div className="container">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl mb-8 text-center">COMPARE THE DECKS</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-900/10">
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
                    <tr key={row.label} className={ri % 2 ? 'bg-slate-900/[0.03]' : ''}>
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
    </SiteShell>
  )
}
