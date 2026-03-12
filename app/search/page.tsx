"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2 } from "lucide-react"
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

const categoryFilters = ["All", "puja-items", "idols-murtis", "gemstones-malas", "books-scriptures"]
const categoryLabels: Record<string, string> = {
  "All": "All",
  "puja-items": "Puja Items",
  "idols-murtis": "Idols & Murtis",
  "gemstones-malas": "Gemstones & Malas",
  "books-scriptures": "Books & Scriptures",
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState<ReturnType<typeof mapProduct>[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!searchTerm && selectedCategory === "All") {
      setProducts([])
      setTotal(0)
      return
    }
    setLoading(true)
    productsApi.list({
      search: searchTerm || undefined,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      limit: 20,
    })
      .then((data) => {
        const mapped = data.products.map(mapProduct)
        if (mapped.length > 0) {
          setProducts(mapped)
          setTotal(data.total)
        } else {
          const fallback = dummyProducts
            .filter((p) => {
              const matchCat = selectedCategory === "All" || p.category === selectedCategory
              const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
              return matchCat && matchSearch
            })
            .map(mapProduct)
          setProducts(fallback)
          setTotal(fallback.length)
        }
      })
      .catch(() => {
        const fallback = dummyProducts
          .filter((p) => {
            const matchCat = selectedCategory === "All" || p.category === selectedCategory
            const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
            return matchCat && matchSearch
          })
          .map(mapProduct)
        setProducts(fallback)
        setTotal(fallback.length)
      })
      .finally(() => setLoading(false))
  }, [searchTerm, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(query)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: searchTerm ? `Search: "${searchTerm}"` : "Search" },
            ]}
          />

          <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 sm:mt-4 mb-3 sm:mb-6">
            {searchTerm ? `Results for "${searchTerm}"` : "Search Products"}
          </h1>

          <div className="max-w-2xl mb-4 sm:mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10 text-xs sm:text-sm"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(""); setSearchTerm("") }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button type="submit" className="gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Search
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-8">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <p className="text-[10px] sm:text-sm text-muted-foreground">
              {total} product{total !== 1 ? "s" : ""} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (searchTerm || selectedCategory !== "All") ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Try searching with different keywords or browse our categories.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {categoryFilters.filter(c => c !== "All").map((cat) => (
                  <Button key={cat} variant="outline" size="sm" onClick={() => { setSelectedCategory(cat); setSearchTerm(""); setQuery("") }}>
                    {categoryLabels[cat] || cat}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
