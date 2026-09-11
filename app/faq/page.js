'use client'
import SiteShell from '@/components/exit52/SiteShell'
import Reveal from '@/components/exit52/Reveal'
import { FAQS } from '@/lib/exit52/data'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function FAQ() {
  return (
    <SiteShell tone="#0c1730">
      <section className="pt-32 pb-10 text-center">
        <div className="container">
          <Reveal>
            <span className="label text-[10px] text-exit-red">QUESTIONS</span>
            <h1 className="font-display text-5xl md:text-7xl mt-3">FAQ</h1>
          </Reveal>
        </div>
      </section>
      <section className="pb-28">
        <div className="container max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="rounded-xl border border-slate-900/10 bg-exit-charcoal/40 px-5">
                <AccordionTrigger className="text-left font-cond font-semibold text-base hover:no-underline hover:text-exit-red">{f.q}</AccordionTrigger>
                <AccordionContent className="text-exit-cream/60">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteShell>
  )
}
