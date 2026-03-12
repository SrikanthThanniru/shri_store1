"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isEnergised?: boolean
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const productHref = `/product/${product.slug || product.id}`

  const handleAddToCart = async () => {
    try {
      await addItem({
        _id: product.id,
        name: product.name,
        slug: product.slug || "",
        description: "",
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        primaryImage: { public_id: "", url: product.image },
        isEnergised: product.isEnergised || false,
        stockStatus: product.inStock ? "in-stock" : "out-of-stock",
        sku: "",
      }, 1)
      toast.success(`${product.name} added to cart`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart")
    }
  }

  return (
    <div className={cn("group relative bg-card rounded-lg overflow-hidden border border-border", className)}>
      <Link href={productHref} className="block relative aspect-square sm:aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {product.isEnergised && (
            <Badge className="bg-primary text-primary-foreground gap-0.5 text-[9px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              Energised
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="text-[9px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5">
              {discount}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="text-[9px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5">
              Out of Stock
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </Link>

      <div className="p-2 sm:p-4">
        <Link href={productHref}>
          <h3 className="text-[11px] sm:text-sm font-medium text-foreground leading-snug line-clamp-1 sm:line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="hidden sm:flex items-center gap-1 mt-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "text-accent fill-accent"
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-0 mb-1.5 sm:mb-3">
          <span className="text-[13px] sm:text-lg font-bold text-foreground">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-[9px] sm:text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <Button
          className="w-full gap-1 sm:gap-2 text-[10px] sm:text-sm h-7 sm:h-10 rounded-md"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  )
}
