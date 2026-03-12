"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  MessageCircle,
  Smartphone,
  Package,
  ArrowRight,
  Copy,
  Truck,
  Shield,
} from "lucide-react"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "SA-ORD-10300"
  const mode = searchParams.get("mode") || "guest"
  const total = searchParams.get("total") || "7,296"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground">
                Thank you for shopping with Shri Aaum. May divine blessings be with you.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Order Details</h2>
                <button
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                  onClick={() => navigator.clipboard.writeText(orderId)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy ID
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold text-foreground">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-foreground">₹{Number(total).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className="text-green-600 font-medium">Confirmed</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium text-foreground">5–7 business days</p>
                </div>
              </div>
            </div>

            {/* Notification Info */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                You will receive updates via
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">WhatsApp (via Interakt)</p>
                    <p className="text-xs text-green-700">
                      Order confirmation, shipping updates with AWB number & Shiprocket tracking link,
                      delivery confirmation & review request, return pickup confirmation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">SMS</p>
                    <p className="text-xs text-blue-700">
                      Order confirmation, payment alerts, shipping updates,
                      out-for-delivery notification, refund initiated alerts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Order Processing</p>
                    <p className="text-sm text-muted-foreground">We are preparing your items for shipment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Shipped via Shiprocket</p>
                    <p className="text-sm text-muted-foreground">
                      You will receive AWB number + tracking link via WhatsApp & SMS
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Delivered to your doorstep. You will receive a WhatsApp confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Registration Prompt */}
            {mode === "guest" && (
              <div className="bg-primary/5 rounded-lg border border-primary/20 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Create an account to track your orders
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Set a password to create your Shri Aaum account. You will be able to track all your orders,
                  manage addresses, save to wishlist, and checkout faster next time.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regPassword">Create Password</Label>
                      <Input id="regPassword" type="password" placeholder="Min 8 characters" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regConfirm">Confirm Password</Label>
                      <Input id="regConfirm" type="password" placeholder="Confirm password" />
                    </div>
                  </div>
                  <Button className="gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Your order details (name, email, phone, address) will be saved to your new account.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 gap-2">
                <Link href="/track-order">
                  <Package className="h-4 w-4" />
                  Track Your Order
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 gap-2">
                <Link href="/">
                  <Truck className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
