"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Loader2 } from "lucide-react"
import { couponsApi, getProductImage } from "@/lib/api"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

export default function CartPage() {
  const { items, loading, updateItem, removeItem } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingId(itemId)
    try {
      await updateItem(itemId, newQuantity)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update quantity")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingId(itemId)
    try {
      await removeItem(itemId)
      toast.success("Item removed from cart")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove item")
    } finally {
      setUpdatingId(null)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  // Testing phase: shipping is always free (₹0)
  const shipping = 0
  const total = subtotal - discount + shipping

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const data = await couponsApi.validate(couponCode, subtotal)
      setDiscount(data.discount)
      setCouponApplied(true)
      toast.success(`Coupon applied! You save ₹${data.discount.toLocaleString('en-IN')}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid coupon code")
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you have not added any items to your cart yet.</p>
            <Button asChild><Link href="/">Continue Shopping</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 lg:py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]} />
          <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 sm:mt-4 mb-4 sm:mb-8">
            Cart ({items.length} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-2 sm:space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-card rounded-lg border border-border p-2.5 sm:p-4 md:p-6">
                  <div className="flex gap-2.5 sm:gap-4">
                    <Link href={`/product/${item.product.slug || item.product._id}`} className="shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative rounded-md overflow-hidden bg-muted">
                        <Image src={getProductImage(item.product)} alt={item.product.name} fill className="object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.slug || item.product._id}`}>
                        <h3 className="text-xs sm:text-base font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">{item.product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                        <span className="text-xs sm:text-base font-semibold text-foreground">₹{item.product.price.toLocaleString('en-IN')}</span>
                        {item.product.originalPrice && (
                          <span className="text-[10px] sm:text-sm text-muted-foreground line-through">₹{item.product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 sm:mt-4">
                        <div className="flex items-center border border-border rounded-md">
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} disabled={updatingId === item._id} className="p-1.5 sm:p-2 hover:bg-secondary transition-colors" aria-label="Decrease">
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <span className="w-7 sm:w-10 text-center font-medium text-xs sm:text-sm">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} disabled={updatingId === item._id} className="p-1.5 sm:p-2 hover:bg-secondary transition-colors" aria-label="Increase">
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                        <button onClick={() => handleRemoveItem(item._id)} disabled={updatingId === item._id} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 sm:p-2" aria-label="Remove">
                          {updatingId === item._id ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <span className="font-semibold text-foreground">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" asChild><Link href="/">Continue Shopping</Link></Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-3 sm:p-6 sticky top-16 sm:top-24">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-6">Order Summary</h2>
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Have a coupon?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="pl-9" />
                    </div>
                    <Button variant="outline" onClick={applyCoupon} disabled={couponApplied}>{couponApplied ? "Applied" : "Apply"}</Button>
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-green-600 mt-2">Coupon applied! You save ₹{discount.toLocaleString('en-IN')}</p>
                  )}
                </div>
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-foreground">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
                {/* Free‑shipping upsell hidden during testing while shipping is always free */}
                <Button asChild className="w-full mt-6 gap-2">
                  <Link href="/checkout">Proceed to Checkout<ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
