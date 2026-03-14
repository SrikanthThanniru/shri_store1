"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { bannersApi, type Banner } from "@/lib/api"

const fallbackBanners = [
  {
    _id: "1",
    title: "Divine Blessings Await",
    subtitle: "Discover our collection of authentic spiritual products",
    cta: "Shop Now",
    link: "/category/puja-items",
    image: "/images/hero-1.jpg",
    position: 1,
    isActive: true,
  },
  {
    _id: "2",
    title: "Sacred Idols & Murtis",
    subtitle: "Handcrafted with devotion, blessed with divinity",
    cta: "Explore Collection",
    link: "/category/idols",
    image: "/images/hero-2.jpg",
    position: 2,
    isActive: true,
  },
  {
    _id: "3",
    title: "Energised Gemstones",
    subtitle: "Authentic rudraksha and crystal malas for spiritual growth",
    cta: "View Gemstones",
    link: "/category/gemstones",
    image: "/images/hero-3.jpg",
    position: 3,
    isActive: true,
  },
]

export function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    bannersApi.getActive()
      .then((data) => {
        if (data.banners?.length) setBanners(data.banners)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  return (
    <section className="relative min-h-[38vh] h-[44vh] sm:h-[50vh] sm:min-h-[280px] md:h-[60vh] lg:h-[72vh] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-foreground/40 z-10" />
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover object-center sm:object-left"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="relative z-20 h-full flex items-end sm:items-center">
            <div className="container mx-auto px-4 sm:px-5 w-full">
              <div className="max-w-xl pb-7 sm:pb-0">
                <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-background mb-2 sm:mb-4 leading-tight">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-xs sm:text-base md:text-xl text-background/90 mb-3 sm:mb-8 line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link && (
                  <Button
                    asChild
                    size="sm"
                    className="w-auto h-9 sm:h-11 px-5 sm:px-8 text-xs sm:text-base"
                  >
                    <Link href={banner.link}>{banner.cta || "Shop Now"}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                  index === currentSlide ? "bg-background" : "bg-background/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
      )}
    </section>
  )
}
