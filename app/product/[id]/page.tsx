"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  Loader2,
} from "lucide-react"
import { productsApi, getProductImage, getProductImages, type Product } from "@/lib/api"
import { dummyProducts } from "@/lib/dummy-data"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

function mapCardProduct(p: Product) {
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

export default function ProductPage() {
  const params = useParams()
  const slugOrId = params.id as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<ReturnType<typeof mapCardProduct>[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setLoading(true)
    productsApi.getBySlugOrId(slugOrId)
      .then((data) => {
        setProduct(data.product)
        return productsApi.list({ category: data.product.category, limit: 4 })
      })
      .then((data) => {
        setRelated(data.products.filter((p) => p._id !== product?._id).slice(0, 4).map(mapCardProduct))
      })
      .catch(() => {
        const dummy = dummyProducts.find((p) => p.slug === slugOrId || p._id === slugOrId)
        if (dummy) {
          setProduct(dummy)
          setRelated(dummyProducts.filter((p) => p.category === dummy.category && p._id !== dummy._id).slice(0, 4).map(mapCardProduct))
        } else {
          setProduct(dummyProducts[0])
          setRelated(dummyProducts.slice(1, 5).map(mapCardProduct))
        }
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugOrId])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addItem(product, quantity)
      toast.success(`${product.name} added to cart`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you are looking for does not exist.</p>
            <Button asChild><Link href="/">Go Home</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const images = getProductImages(product)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: `/category/${product.category}` },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 mt-3 sm:mt-6">
            {/* Images */}
            <div className="space-y-2 sm:space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                <Image
                  src={images[selectedImage]}
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
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <Link
                href={`/category/${product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="text-[10px] sm:text-sm text-primary hover:underline"
              >
                {product.category}
              </Link>

              <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-1 mb-2 sm:mt-2 sm:mb-4 leading-tight">
                {product.name}
              </h1>

              {(product.ratingsAverage ?? 0) > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${i < Math.floor(product.ratingsAverage!) ? "text-accent fill-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-sm text-muted-foreground">
                    {product.ratingsAverage} ({product.ratingsCount || 0} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <span className="text-xl sm:text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm sm:text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <Badge variant="destructive" className="text-[10px] sm:text-xs">{discount}% OFF</Badge>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-6">
                {product.stockStatus === "in-stock" ? (
                  <>
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
                    <span className="text-xs sm:text-sm text-green-600 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" />
                    <span className="text-xs sm:text-sm text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
                <span className="text-[10px] sm:text-sm text-muted-foreground ml-1 sm:ml-2">SKU: {product.sku}</span>
              </div>

              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                {product.description?.split('\n')[0]}
              </p>

              {product.features && product.features.length > 0 && (
                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-8">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center border border-border rounded-md">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 sm:p-3 hover:bg-secondary transition-colors" aria-label="Decrease quantity">
                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <span className="w-8 sm:w-12 text-center font-medium text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 sm:p-3 hover:bg-secondary transition-colors" aria-label="Increase quantity">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <Button className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-11 text-xs sm:text-base" onClick={handleAddToCart} disabled={product.stockStatus !== "in-stock"}>
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 sm:h-11 sm:w-11"><Share2 className="h-4 w-4 sm:h-5 sm:w-5" /></Button>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2.5 sm:p-4 bg-secondary rounded-lg">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-4 w-4 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium">Free Delivery</span>
                  <span className="text-[8px] sm:text-[10px] text-muted-foreground">Above ₹999</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium">Secure Payment</span>
                  <span className="text-[8px] sm:text-[10px] text-muted-foreground">100% Protected</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="h-4 w-4 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <span className="text-[10px] sm:text-xs font-medium">Easy Returns</span>
                  <span className="text-[8px] sm:text-[10px] text-muted-foreground">14 Day Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Description
              </TabsTrigger>
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Specifications
                </TabsTrigger>
              )}
              <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <div className="prose prose-neutral max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-6 mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>

            {product.specifications && (
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
            )}

            <TabsContent value="shipping" className="py-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Free shipping on orders above ₹999</li>
                      <li>Standard delivery: 5-7 business days</li>
                      <li>Tracking via Shiprocket — updates sent via WhatsApp & SMS</li>
                      <li>We ship to all pincodes across India</li>
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
                      <li>Refund within 5–7 business days after item reaches us</li>
                      <li>COD orders: refund via bank transfer (NEFT)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-8 sm:mt-16">
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-foreground mb-4 sm:mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
