"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { productsApi, getProductImage, type Product } from "@/lib/api"
import { dummyProducts } from "@/lib/dummy-data"

function mapProduct(p: Product) {
  return {
    id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    image: getProductImage(p),
    category: p.category,
    rating: p.ratingsAverage || 0,
    reviewCount: p.ratingsCount || 0,
    isEnergised: p.isEnergised,
    inStock: p.stockStatus === "in-stock",
  }
}

function pickFeatured(all: ReturnType<typeof mapProduct>[]) {
  const energised = all.filter((p) => p.isEnergised).slice(0, 2)
  const normal = all.filter((p) => !p.isEnergised).slice(0, 2)
  const picked = [...energised, ...normal]
  if (picked.length < 4) {
    const ids = new Set(picked.map((p) => p.id))
    for (const p of all) {
      if (picked.length >= 4) break
      if (!ids.has(p.id)) picked.push(p)
    }
  }
  return picked.slice(0, 4)
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<ReturnType<typeof mapProduct>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.list({ limit: 20, sort: "featured" })
      .then((data) => {
        const mapped = data.products.map(mapProduct)
        setProducts(pickFeatured(mapped.length > 0 ? mapped : dummyProducts.map(mapProduct)))
      })
      .catch(() => setProducts(pickFeatured(dummyProducts.map(mapProduct))))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-6 sm:py-10 md:py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-4 sm:px-5">
        <div className="mb-4 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-2xl md:text-4xl font-serif font-bold text-foreground mb-1 sm:mb-2">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl hidden sm:block">
            Handpicked spiritual essentials, blessed with authenticity and crafted with devotion
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
                <div className="aspect-[5/4] sm:aspect-square bg-muted" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-7 sm:h-10 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex justify-center mt-6 sm:mt-8">
              <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4">
                <Link href="/categories" className="gap-1 sm:gap-2">
                  View All
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No products available. Check back soon!
          </p>
        )}
      </div>
    </section>
  )
}
