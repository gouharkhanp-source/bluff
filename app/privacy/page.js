'use client'
import SiteShell from '@/components/exit52/SiteShell'

export default function Privacy() {
  return (
    <SiteShell tone="#CFEDE4">
      <section className="pt-32 pb-28">
        <div className="container max-w-3xl">
          <h1 className="font-display text-5xl md:text-6xl mb-8">PRIVACY</h1>
          <div className="space-y-5 text-exit-cream/65">
            <p>This is a pre-launch concept experience for EXIT 52™. We collect only the information you voluntarily provide through the pre-book form (such as name, email and shipping details) to manage reservations and send launch updates.</p>
            <p>Gameplay in the Play Free prototype runs in your browser. We do not sell your personal data. Analytics events are used in aggregate to improve the experience.</p>
            <p>You may request deletion of your reservation data at any time by contacting the team. A full privacy policy will be published ahead of general release.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
