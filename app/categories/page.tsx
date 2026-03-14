"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { productsApi } from "@/lib/api"
import { dummyCategoryCounts } from "@/lib/dummy-data"

const categoryMeta: Record<string, { displayName: string; description: string; image: string }> = {
  "puja-items": {
    displayName: "Puja Items",
    description: "Sacred essentials for daily worship and rituals",
    image: "/images/category-puja.jpg",
  },
  "idols-murtis": {
    displayName: "Idols & Murtis",
    description: "Divine forms crafted with devotion for your altar",
    image: "/images/category-idols.jpg",
  },
  "gemstones-malas": {
    displayName: "Gemstones & Malas",
    description: "Spiritual adornments for meditation and healing",
    image: "/images/category-gemstones.jpg",
  },
  "books-scriptures": {
    displayName: "Books & Scriptures",
    description: "Sacred wisdom and teachings for spiritual growth",
    image: "/images/category-books.jpg",
  },
}

interface CategoryItem {
  slug: string
  name: string
  description: string
  image: string
  productCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(
    Object.entries(categoryMeta).map(([slug, meta]) => ({
      slug,
      name: meta.displayName,
      description: meta.description,
      image: meta.image,
      productCount: dummyCategoryCounts[slug] || 0,
    }))
  )

  useEffect(() => {
    productsApi
      .getCategories()
      .then((data) => {
        const bySlug = new Map(data.categories?.map((c) => [c.slug, c.productCount]) ?? [])
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            productCount: bySlug.get(cat.slug) ?? dummyCategoryCounts[cat.slug] ?? cat.productCount,
          }))
        )
      })
      .catch(() => {
        // Fallback: keep initial counts from dummyCategoryCounts (already set)
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

          <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 sm:mt-4 mb-1 sm:mb-2">
            All Categories
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-8">
            Explore our curated collection of authentic spiritual products
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h2 className="text-sm sm:text-lg font-serif font-bold text-background leading-tight">
                      {category.name}
                    </h2>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                    {category.description}
                  </p>
                  <span className="text-[10px] sm:text-xs font-medium text-primary">
                    {category.productCount} Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
