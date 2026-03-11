"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
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
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className={cn("group relative bg-card rounded-lg overflow-hidden border border-border", className)}>
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isEnergised && (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Sparkles className="h-3 w-3" />
              Energised
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">
              {discount}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`}>
          <span className="text-xs text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors">
            {product.category}
          </span>
        </Link>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.floor(product.rating)
                    ? "text-accent fill-accent"
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-semibold text-foreground">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button 
          className="w-full gap-2" 
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  )
}
