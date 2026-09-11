'use client'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteShell({ children, tone = '#0b1020' }) {
  return (
    <div className="min-h-screen text-exit-cream selection:bg-exit-red/40" style={{ backgroundColor: tone }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
