'use client'
import Link from 'next/link'

const COLS = [
  { title: 'GAME', links: [['How To Play', '/how-to-play'], ['Explainer', '/explainer'], ['Rules', '/rules'], ['Play Free', '/play']] },
  { title: 'SHOP', links: [['Editions', '/editions'], ['Pre-Book', '/prebook'], ['FAQ', '/faq']] },
  { title: 'LEGAL', links: [['Privacy', '/privacy'], ['Terms', '/terms']] },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-900/10 bg-exit-black">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-3xl">EXIT <span className="text-exit-red">52</span><sup className="text-xs text-exit-cream/50">™</sup></div>
            <p className="mt-3 max-w-xs text-sm text-exit-cream/50">
              Play your cards. Find your EXIT. A fast-paced bluffing card game with an optional digital world.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="label text-[10px] text-exit-cream/40 mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-exit-cream/65 hover:text-exit-red transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-exit-cream/40">© {new Date().getFullYear()} EXIT 52™. All rights reserved.</p>
          <p className="label text-[10px] text-exit-cream/40">PLAY YOUR CARDS · FIND YOUR EXIT</p>
        </div>
      </div>
    </footer>
  )
}
