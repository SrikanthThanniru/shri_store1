"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    image: "/images/testimonial-1.jpg",
    rating: 5,
    text: "The energised Ganesha idol I received is absolutely divine. The quality and craftsmanship exceeded my expectations. Shri Aaum truly delivers authentic spiritual products.",
    product: "Brass Ganesha Idol",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi",
    image: "/images/testimonial-2.jpg",
    rating: 5,
    text: "I've been searching for authentic rudraksha malas and finally found the genuine ones here. The energy is palpable. Highly recommend for serious spiritual seekers.",
    product: "5 Mukhi Rudraksha Mala",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Ahmedabad, Gujarat",
    image: "/images/testimonial-3.jpg",
    rating: 5,
    text: "Fast delivery, beautiful packaging, and the products are exactly as described. The puja thali set I ordered is now a centerpiece of my daily worship.",
    product: "Premium Puja Thali Set",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-5 sm:py-12 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-5">
        <div className="text-center mb-4 sm:mb-10 lg:mb-12">
          <h2 className="text-base sm:text-2xl md:text-4xl font-serif font-bold text-foreground mb-1 sm:mb-4">
            What Our Devotees Say
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of devotees across India for authentic spiritual products
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-1 sm:px-4">
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-8 md:p-12">
                    <Quote className="h-7 w-7 sm:h-12 sm:w-12 text-primary/20 mb-2 sm:mb-6" />
                    
                    <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${
                            i < testimonial.rating ? "text-accent fill-accent" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm sm:text-base md:text-xl text-foreground leading-snug sm:leading-relaxed mb-4 sm:mb-8">
                      {`"${testimonial.text}"`}
                    </p>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-muted shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                        <p className="text-[11px] sm:text-sm text-muted-foreground">{testimonial.location}</p>
                        <p className="text-[10px] sm:text-xs text-primary mt-0.5 sm:mt-1">Purchased: {testimonial.product}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-primary/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
