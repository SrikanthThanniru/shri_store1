import { Shield, Truck, RotateCcw, Headphones, Sparkles } from "lucide-react"

const badges = [
  {
    icon: Sparkles,
    title: "Authentic Products",
    description: "100% genuine & energised items",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "14-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "UPI, Cards, COD available",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "WhatsApp & call support",
  },
]

export function TrustBadges() {
  return (
    <section className="py-12 lg:py-16 bg-muted border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
