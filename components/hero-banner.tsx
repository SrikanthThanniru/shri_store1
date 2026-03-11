"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Divine Blessings Await",
    subtitle: "Discover our collection of authentic spiritual products",
    cta: "Shop Now",
    href: "/category/puja-items",
    image: "/images/hero-1.jpg",
  },
  {
    id: 2,
    title: "Sacred Idols & Murtis",
    subtitle: "Handcrafted with devotion, blessed with divinity",
    cta: "Explore Collection",
    href: "/category/idols",
    image: "/images/hero-2.jpg",
  },
  {
    id: 3,
    title: "Energised Gemstones",
    subtitle: "Authentic rudraksha and crystal malas for spiritual growth",
    cta: "View Gemstones",
    href: "/category/gemstones",
    image: "/images/hero-3.jpg",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-foreground/40 z-10" />
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="relative z-20 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-background mb-4 text-balance">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl text-background/90 mb-8">
                  {banner.subtitle}
                </p>
                <Button asChild size="lg" className="text-base">
                  <Link href={banner.href}>{banner.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-background/20 hover:bg-background/40 backdrop-blur rounded-full flex items-center justify-center text-background transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 bg-background/20 hover:bg-background/40 backdrop-blur rounded-full flex items-center justify-center text-background transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-background" : "bg-background/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
