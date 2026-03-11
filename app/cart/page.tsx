"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  isEnergised?: boolean
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Brass Ganesha Idol - Energised",
    price: 2999,
    originalPrice: 3999,
    image: "/images/product-1.jpg",
    quantity: 1,
    isEnergised: true,
  },
  {
    id: "2",
    name: "5 Mukhi Rudraksha Mala - 108 Beads",
    price: 1499,
    originalPrice: 1999,
    image: "/images/product-2.jpg",
    quantity: 2,
  },
  {
    id: "3",
    name: "Complete Puja Thali Set - Premium",
    price: 1299,
    image: "/images/product-3.jpg",
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal - discount + shipping

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      setCouponApplied(true)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Looks like you have not added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
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
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shopping Cart" },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-4 mb-8">
            Shopping Cart ({cartItems.length} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-lg border border-border p-4 md:p-6"
                >
                  <div className="flex gap-4">
                    <Link href={`/product/${item.id}`} className="shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-md overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {item.isEnergised && (
                        <span className="text-xs text-primary font-medium">Energised</span>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-foreground">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:block text-right">
                      <span className="font-semibold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={couponApplied}
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-green-600 mt-2">
                      Coupon WELCOME10 applied! You save ₹{discount.toLocaleString('en-IN')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: WELCOME10 for 10% off
                  </p>
                </div>

                {/* Summary Lines */}
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
                    <span className="text-foreground">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-foreground">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inclusive of all taxes
                    </p>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {shipping > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-md mt-4">
                    <Truck className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE shipping
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Button asChild className="w-full mt-6 gap-2">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground mb-2">We accept</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium">UPI</div>
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium">VISA</div>
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium">MC</div>
                    <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium">COD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
