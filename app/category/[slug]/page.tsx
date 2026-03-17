"use client"

import { useState, useEffect, use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { productsApi, getProductImage, type Product } from "@/lib/api"
import { getDummyProductsByCategory, dummyProducts } from "@/lib/dummy-data"

const categoryData: Record<string, { name: string; description: string; apiCategory: string }> = {
  "puja-items": {
    name: "Puja Items",
    description: "Sacred essentials for daily worship and rituals",
    apiCategory: "puja-items",
  },
  "idols": {
    name: "Idols & Murtis",
    description: "Divine forms crafted with devotion for your altar",
    apiCategory: "idols-murtis",
  },
  "idols-murtis": {
    name: "Idols & Murtis",
    description: "Divine forms crafted with devotion for your altar",
    apiCategory: "idols-murtis",
  },
  "gemstones": {
    name: "Gemstones & Malas",
    description: "Spiritual adornments for meditation and healing",
    apiCategory: "gemstones-malas",
  },
  "gemstones-malas": {
    name: "Gemstones & Malas",
    description: "Spiritual adornments for meditation and healing",
    apiCategory: "gemstones-malas",
  },
  "books": {
    name: "Books & Scriptures",
    description: "Sacred wisdom and teachings for spiritual growth",
    apiCategory: "books-scriptures",
  },
  "books-scriptures": {
    name: "Books & Scriptures",
    description: "Sacred wisdom and teachings for spiritual growth",
    apiCategory: "books-scriptures",
  },
}

function mapProduct(p: Product) {
  return {
    id: p._id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    image: getProductImage(p),
    category: p.category,
    rating: p.ratingsAverage || 0,
    reviewCount: p.ratingsCount || 0,
    isEnergised: p.isEnergised,
    inStock: p.stockStatus === "in-stock",
    description: p.description,
    dimensionsText: p.dimensions
      ? `Size: ${p.dimensions.length ?? "-"}×${p.dimensions.breadth ?? "-"}×${p.dimensions.height ?? "-"} cm · Weight: ${
          p.dimensions.weight ?? "-"
        } kg`
      : undefined,
  }
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params)
  const category = categoryData[slug] || {
    name: "All Products",
    description: "Browse our complete collection of spiritual products",
    apiCategory: "",
  }

  const [products, setProducts] = useState<ReturnType<typeof mapProduct>[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("featured")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 15000],
    inStock: false,
    energised: false,
    onSale: false,
  })

  useEffect(() => {
    setLoading(true)

    const activeCategory = filters.categories.length > 0
      ? filters.categories[0]
      : category.apiCategory || undefined

    productsApi.list({
      category: activeCategory,
      sort,
      page,
      limit: 12,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < 15000 ? filters.priceRange[1] : undefined,
      inStock: filters.inStock || undefined,
    })
      .then((data) => {
        let mapped = data.products.map(mapProduct)

        if (filters.energised) {
          mapped = mapped.filter((p) => p.isEnergised)
        }
        if (filters.onSale) {
          mapped = mapped.filter((p) => p.originalPrice && p.originalPrice > p.price)
        }

        if (mapped.length > 0) {
          setProducts(mapped)
          setTotalPages(data.pages)
          setTotal(filters.energised || filters.onSale ? mapped.length : data.total)
        } else {
          let fallback = category.apiCategory
            ? getDummyProductsByCategory(category.apiCategory).map(mapProduct)
            : dummyProducts.map(mapProduct)

          if (filters.priceRange[0] > 0 || filters.priceRange[1] < 15000) {
            fallback = fallback.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
          }
          if (filters.inStock) fallback = fallback.filter((p) => p.inStock)
          if (filters.energised) fallback = fallback.filter((p) => p.isEnergised)
          if (filters.onSale) fallback = fallback.filter((p) => p.originalPrice && p.originalPrice > p.price)

          setProducts(fallback)
          setTotal(fallback.length)
          setTotalPages(1)
        }
      })
      .catch(() => {
        let fallback = category.apiCategory
          ? getDummyProductsByCategory(category.apiCategory).map(mapProduct)
          : dummyProducts.map(mapProduct)

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 15000) {
          fallback = fallback.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
        }
        if (filters.inStock) fallback = fallback.filter((p) => p.inStock)
        if (filters.energised) fallback = fallback.filter((p) => p.isEnergised)
        if (filters.onSale) fallback = fallback.filter((p) => p.originalPrice && p.originalPrice > p.price)

        setProducts(fallback)
        setTotal(fallback.length)
        setTotalPages(1)
      })
      .finally(() => setLoading(false))
  }, [category.apiCategory, sort, page, filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary py-4 sm:py-8 lg:py-12 border-b border-border">
          <div className="container mx-auto px-3 sm:px-4">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: category.name },
              ]}
            />
            <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 sm:mt-4 mb-1 sm:mb-2">
              {category.name}
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground">{category.description}</p>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <ProductFilters
                filters={filters}
                onChange={handleFilterChange}
                currentCategory={category.apiCategory}
              />
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{total}</span> products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="rating">Best Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-20">No products found in this category.</p>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 text-sm rounded-md ${
                        page === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-secondary transition-colors"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
