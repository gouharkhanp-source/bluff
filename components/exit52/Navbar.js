'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Volume2, VolumeX } from 'lucide-react'
import { NAV_LINKS } from '@/lib/exit52/data'
import { isSoundEnabled, setSoundEnabled, playClick } from '@/lib/exit52/sound'
import { track, EVENTS } from '@/lib/exit52/analytics'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    setSound(isSoundEnabled())
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleSound = () => {
    const next = !sound
    setSound(next)
    setSoundEnabled(next)
    if (next) playClick()
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-exit-black/85 backdrop-blur-md border-b border-slate-900/10' : 'bg-transparent'
      }`}
    >
      <nav className="container flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/home" className="group flex items-center gap-2" aria-label="EXIT 52 home">
          <span className="font-display text-xl md:text-2xl tracking-tight">
            EXIT <span className="text-exit-red">52</span>
            <sup className="text-[9px] text-exit-cream/50">™</sup>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="label text-[11px] text-exit-cream/70 hover:text-exit-cream transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleSound}
            aria-label={sound ? 'Sound on' : 'Sound off'}
            className="grid place-items-center h-9 w-9 rounded-md border border-slate-900/10 text-exit-cream/70 hover:text-exit-cream hover:border-exit-red/60 transition-colors"
          >
            {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <Link
            href="/play"
            onClick={() => track(EVENTS.playFree, { from: 'navbar' })}
            className="hidden sm:inline-flex items-center label text-[11px] font-semibold px-4 h-9 rounded-md bg-exit-red text-white hover:bg-exit-crimson transition-colors anim-pulseglow"
          >
            PLAY FREE
          </Link>
          <Link
            href="/prebook"
            onClick={() => track(EVENTS.preBook, { from: 'navbar' })}
            className="hidden lg:inline-flex items-center label text-[11px] px-4 h-9 rounded-md border border-exit-cream/30 text-exit-cream hover:border-exit-cream transition-colors"
          >
            PRE-BOOK DECK
          </Link>
          <button
            className="md:hidden grid place-items-center h-9 w-9 rounded-md border border-slate-900/10 text-exit-cream"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-exit-black/95 backdrop-blur-md border-b border-slate-900/10">
          <div className="container py-6 flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="label text-sm text-exit-cream/80"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/play" onClick={() => setOpen(false)} className="flex-1 text-center label text-xs font-semibold py-3 rounded-md bg-exit-red text-white">PLAY FREE</Link>
              <Link href="/prebook" onClick={() => setOpen(false)} className="flex-1 text-center label text-xs py-3 rounded-md border border-exit-cream/30 text-exit-cream">PRE-BOOK</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
