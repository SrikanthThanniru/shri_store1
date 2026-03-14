"use client"

import { Shield, RotateCcw, Headphones, Sparkles } from "lucide-react"

const badges = [
  { icon: Sparkles, title: "Authentic Products", description: "100% genuine & energised items" },
  { icon: RotateCcw, title: "Easy Returns", description: "14-day hassle-free returns" },
  { icon: Shield, title: "Secure Payments", description: "UPI, Cards, COD available" },
  { icon: Headphones, title: "24/7 Support", description: "WhatsApp & call support" },
]

function BadgeItem({ badge, showDot }: { badge: (typeof badges)[0]; showDot?: boolean }) {
  const Icon = badge.icon
  return (
    <>
      {showDot && <span className="shrink-0 w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-muted-foreground/50 mx-2 sm:mx-3 lg:mx-6" aria-hidden />}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 min-w-[100px] sm:min-w-[140px] lg:min-w-[220px] px-1 sm:px-2">
        <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-primary" />
        </div>
        <span className="text-[10px] sm:text-xs lg:text-base text-foreground whitespace-nowrap">{badge.title}</span>
      </div>
    </>
  )
}

export function TrustBadges() {
  const repeated = [...badges, ...badges, ...badges]
  return (
    <section className="py-1.5 sm:py-2.5 bg-muted border-y border-border overflow-hidden">
      <div className="flex items-center animate-scroll">
        {repeated.map((badge, i) => (
          <BadgeItem key={`${badge.title}-${i}`} badge={badge} showDot={i > 0} />
        ))}
      </div>
    </section>
  )
}
