import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedProducts } from "@/components/featured-products"
import { TrustBadges } from "@/components/trust-badges"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TrustBadges />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoriesSection />
        <FeaturedProducts />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
