"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % banners.length)

  return (
    <section className="relative min-h-[calc(100dvh-10rem-env(safe-area-inset-bottom,0px))] h-[calc(100dvh-10rem-env(safe-area-inset-bottom,0px))] sm:min-h-[280px] sm:h-[50vh] md:h-[60vh] lg:min-h-[72vh] lg:h-[72vh] overflow-hidden bg-[#3d0f0f]">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Mobile: image top (no overlay), content below — image clearly visible */}
          <div className="absolute inset-0 lg:hidden flex flex-col min-h-0">
            {/* Div 1: Image — light bottom overlay to hide partition line */}
            <div className="flex-1 min-h-[55%] relative bg-[#3d0f0f]">
              <Image
                src={banner.image}
                alt=""
                fill
                className="object-cover object-center"
                priority={index === 0}
                sizes="100vw"
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                style={{
                  background: `linear-gradient(to top,
                    #3d0f0f 0%,
                    rgba(61,15,15,0.4) 50%,
                    transparent 100%
                  )`,
                }}
              />
            </div>
            {/* Div 2: Content */}
            <div className="flex-shrink-0 relative z-10 px-4 pt-4 pb-4 bg-[#3d0f0f] flex flex-col items-start gap-2 text-left">
              <h1 className="text-xl font-serif font-bold text-amber-300 leading-tight">{banner.title}</h1>
              {banner.subtitle && <p className="text-sm text-white/90 leading-snug line-clamp-2">{banner.subtitle}</p>}
              {banner.link && (
                <Button asChild className="h-10 px-5 rounded-lg bg-white text-gray-900 hover:bg-white/95 font-semibold text-sm shrink-0 ">
                  <Link href={banner.link}>{banner.cta || "Shop Now"}</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Desktop: same structure as mobile — left content, right image, gradient left-to-right */}
          <div className="hidden lg:flex absolute inset-0">
            {/* Left div: Content */}
            <div className="flex-1 min-w-0 flex flex-col items-start justify-center px-8 xl:px-12 bg-[#3d0f0f] relative z-30">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-amber-300 mb-3 sm:mb-4 leading-tight">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-5 sm:mb-6 lg:mb-8 leading-relaxed max-w-xl">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <Button
                  asChild
                  size="lg"
                  className="w-fit bg-white text-gray-900 hover:bg-white/95 hover:text-gray-900 font-semibold h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base rounded-lg"
                >
                  <Link href={banner.link}>{banner.cta || "Shop Now"}</Link>
                </Button>
              )}
            </div>
            {/* Right div: Image — gradient overlay on image to hide partition line */}
            <div className="flex-1 min-w-0 relative bg-[#3d0f0f] overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
                sizes="50vw"
              />
              {/* Gradient left-to-right on image — hides partition at junction */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to right,
                    #3d0f0f 0%,
                    rgba(61,15,15,0.92) 15%,
                    rgba(61,15,15,0.7) 28%,
                    rgba(61,15,15,0.4) 42%,
                    rgba(61,15,15,0.15) 58%,
                    transparent 75%,
                    transparent 100%
                  )`,
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Carousel arrows — desktop only, like 3rd UI */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goNext}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots — bottom center */}
      {banners.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 lg:bottom-6">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all ${
                index === currentSlide
                  ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-amber-300"
                  : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
