'use client'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteShell({ children }) {
  return (
    <div className="min-h-screen bg-exit-black text-exit-cream selection:bg-exit-red/40">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
