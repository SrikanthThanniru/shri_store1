import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"

const featuredProducts = [
  {
    id: "1",
    name: "Brass Ganesha Idol - Energised",
    price: 2999,
    originalPrice: 3999,
    image: "/images/product-1.jpg",
    category: "Idols & Murtis",
    rating: 4.8,
    reviewCount: 124,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "2",
    name: "5 Mukhi Rudraksha Mala - 108 Beads",
    price: 1499,
    originalPrice: 1999,
    image: "/images/product-2.jpg",
    category: "Gemstones & Malas",
    rating: 4.9,
    reviewCount: 89,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Complete Puja Thali Set - Premium",
    price: 1299,
    image: "/images/product-3.jpg",
    category: "Puja Items",
    rating: 4.7,
    reviewCount: 156,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "4",
    name: "Bhagavad Gita - Sanskrit & Hindi",
    price: 499,
    originalPrice: 699,
    image: "/images/product-4.jpg",
    category: "Books & Scriptures",
    rating: 4.9,
    reviewCount: 312,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "5",
    name: "Pure Silver Lakshmi Idol",
    price: 8999,
    originalPrice: 10999,
    image: "/images/product-5.jpg",
    category: "Idols & Murtis",
    rating: 5.0,
    reviewCount: 45,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Natural Camphor - 100g Pack",
    price: 199,
    image: "/images/product-6.jpg",
    category: "Puja Items",
    rating: 4.6,
    reviewCount: 234,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "7",
    name: "Crystal Sphatik Mala",
    price: 899,
    originalPrice: 1299,
    image: "/images/product-7.jpg",
    category: "Gemstones & Malas",
    rating: 4.7,
    reviewCount: 78,
    isEnergised: false,
    inStock: false,
  },
  {
    id: "8",
    name: "Brass Diya Set - Pack of 5",
    price: 599,
    image: "/images/product-8.jpg",
    category: "Puja Items",
    rating: 4.5,
    reviewCount: 189,
    isEnergised: false,
    inStock: true,
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Handpicked spiritual essentials, blessed with authenticity and crafted with devotion
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link href="/products" className="gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
