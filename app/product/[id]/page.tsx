"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
  Sparkles,
  Check,
} from "lucide-react"

const product = {
  id: "1",
  name: "Brass Ganesha Idol - Energised",
  price: 2999,
  originalPrice: 3999,
  images: [
    "/images/product-1.jpg",
    "/images/product-5.jpg",
    "/images/product-3.jpg",
    "/images/product-8.jpg",
  ],
  category: "Idols & Murtis",
  rating: 4.8,
  reviewCount: 124,
  isEnergised: true,
  inStock: true,
  sku: "SA-IDOL-001",
  description: `This beautifully crafted Brass Ganesha Idol is made by skilled artisans using traditional techniques passed down through generations. Lord Ganesha, the remover of obstacles and the deity of beginnings, brings prosperity and good fortune to your home.

Each idol is individually energised through sacred Vedic rituals performed by learned priests, infusing divine energy that amplifies the spiritual benefits of worship.`,
  features: [
    "Handcrafted by skilled artisans",
    "Made from pure brass with antique finish",
    "Energised through Vedic rituals",
    "Height: 8 inches, Weight: 1.2 kg",
    "Suitable for home temple and office",
    "Comes with authenticity certificate",
  ],
  specifications: {
    Material: "Pure Brass",
    Height: "8 inches (20 cm)",
    Width: "5 inches (12.5 cm)",
    Weight: "1.2 kg",
    Finish: "Antique Gold",
    Origin: "Moradabad, India",
  },
}

const relatedProducts = [
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
    id: "9",
    name: "Brass Shiva Lingam Set",
    price: 1799,
    image: "/images/product-1.jpg",
    category: "Idols & Murtis",
    rating: 4.8,
    reviewCount: 67,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Complete Puja Thali Set",
    price: 1299,
    image: "/images/product-3.jpg",
    category: "Puja Items",
    rating: 4.7,
    reviewCount: 156,
    isEnergised: false,
    inStock: true,
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

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "February 15, 2026",
    verified: true,
    comment: "Absolutely beautiful idol! The craftsmanship is exceptional and you can feel the divine energy. The packaging was also very secure. Highly recommended!",
  },
  {
    id: 2,
    name: "Rajesh Patel",
    rating: 5,
    date: "February 10, 2026",
    verified: true,
    comment: "This is my second purchase from Shri Aaum. The quality is consistently excellent. The energisation certificate adds authenticity.",
  },
  {
    id: 3,
    name: "Anita Gupta",
    rating: 4,
    date: "January 28, 2026",
    verified: true,
    comment: "Good quality brass idol with nice finish. Delivery was on time. The only reason for 4 stars is that I expected it to be slightly bigger.",
  },
]

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: "/category/idols" },
              { label: product.name },
            ]}
          />

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isEnergised && (
                  <Badge className="absolute top-4 left-4 gap-1 bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                    Energised
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <Link
                href={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category}
              </Link>
              
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <Badge variant="destructive">{discount}% OFF</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.inStock ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
                <span className="text-sm text-muted-foreground ml-2">SKU: {product.sku}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description.split('\n')[0]}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button size="lg" className="flex-1 gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Buy Now */}
              <Button size="lg" variant="secondary" className="w-full mb-8">
                Buy Now
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary rounded-lg">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs font-medium">Free Delivery</span>
                  <span className="text-[10px] text-muted-foreground">Above ₹999</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs font-medium">Secure Payment</span>
                  <span className="text-[10px] text-muted-foreground">100% Protected</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs font-medium">Easy Returns</span>
                  <span className="text-[10px] text-muted-foreground">14 Day Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-border">
                    <span className="font-medium text-foreground">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{review.name}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-accent fill-accent" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="py-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Free shipping on orders above ₹999</li>
                      <li>Standard delivery: 5-7 business days</li>
                      <li>Express delivery: 2-3 business days (additional charges apply)</li>
                      <li>We ship to all pincodes across India</li>
                      <li>Tracking information will be sent via WhatsApp and SMS</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns">
                  <AccordionTrigger>Returns & Exchange Policy</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>14-day hassle-free returns for non-energised products</li>
                      <li>Energised products are non-returnable (all sales final)</li>
                      <li>Products must be unused and in original packaging</li>
                      <li>Refund will be initiated within 5-7 business days after item reaches us</li>
                      <li>COD orders: refund via bank transfer</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
