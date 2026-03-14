"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { productsApi } from "@/lib/api"
import { dummyCategoryCounts } from "@/lib/dummy-data"

const categoryMeta: Record<string, { displayName: string; description: string; image: string; href: string }> = {
  "puja-items": {
    displayName: "Puja Items",
    description: "Sacred essentials for daily worship",
    image: "/images/category-puja.jpg",
    href: "/category/puja-items",
  },
  "idols-murtis": {
    displayName: "Idols & Murtis",
    description: "Divine forms for your altar",
    image: "/images/category-idols.jpg",
    href: "/category/idols-murtis",
  },
  "gemstones-malas": {
    displayName: "Gemstones & Malas",
    description: "Spiritual adornments for meditation",
    image: "/images/category-gemstones.jpg",
    href: "/category/gemstones-malas",
  },
  "books-scriptures": {
    displayName: "Books & Scriptures",
    description: "Sacred wisdom and teachings",
    image: "/images/category-books.jpg",
    href: "/category/books-scriptures",
  },
}

const fallbackCategories = Object.entries(categoryMeta).map(([slug, meta]) => ({
  name: meta.displayName,
  slug,
  productCount: 0,
  description: meta.description,
  image: meta.image,
  href: meta.href,
}))

export function CategoriesSection() {
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    const slugs = Object.keys(categoryMeta)
    Promise.all(
      slugs.map((slug) =>
        productsApi.list({ category: slug, limit: 1 })
          .then((res) => ({ slug, total: res.total || 0 }))
          .catch(() => ({ slug, total: dummyCategoryCounts[slug] || 0 }))
      )
    ).then((counts) => {
      setCategories((prev) =>
        prev.map((cat) => {
          const found = counts.find((c) => c.slug === cat.slug)
          const count = found?.total || dummyCategoryCounts[cat.slug] || 0
          return { ...cat, productCount: count }
        })
      )
    })
  }, [])

  return (
    <section className="py-6 sm:py-10 md:py-12 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-5">
        <div className="text-center mb-4 sm:mb-8 lg:mb-12">
          <h2 className="text-lg sm:text-2xl md:text-4xl font-serif font-bold text-foreground mb-2 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-1">
            Explore our curated collection of authentic spiritual products
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug || category.name || index}
              href={category.href}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[4/5] bg-muted shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name || "Category"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                <h3 className="text-xs sm:text-xl font-serif font-semibold text-background leading-tight drop-shadow-sm">
                  {category.name}
                </h3>
                <span className="text-[9px] sm:text-xs text-background/90 font-medium">
                  {category.productCount} Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
