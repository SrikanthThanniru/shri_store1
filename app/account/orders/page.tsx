"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { ordersApi, type Order } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

function statusBadgeVariant(status: string) {
  switch (status) {
    case "delivered": return "default" as const
    case "shipped": case "dispatched": return "secondary" as const
    case "cancelled": return "destructive" as const
    default: return "outline" as const
  }
}

function OrderStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "delivered": return <CheckCircle className="h-5 w-5 text-green-600" />
    case "shipped": case "dispatched": return <Truck className="h-5 w-5 text-blue-600" />
    case "processing": case "confirmed": return <Clock className="h-5 w-5 text-amber-600" />
    default: return <Package className="h-5 w-5 text-muted-foreground" />
  }
}

export default function OrdersPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) { setLoading(false); return }
    ordersApi.getMyOrders()
      .then((data) => setOrders(data.orders))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [isLoggedIn, authLoading])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header /><main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main><Footer />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-6">Login to view your orders.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild><Link href="/login">Login / Sign Up</Link></Button>
              <Button variant="outline" asChild><Link href="/track-order">Track by Order ID</Link></Button>
            </div>
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
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "My Orders" }]} />
          <div className="flex items-center justify-between mt-4 mb-8">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground">My Orders</h1>
            <Button variant="outline" size="sm" asChild><Link href="/track-order">Track by Order ID</Link></Button>
          </div>

          <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-800">Order updates are sent via WhatsApp (Interakt) & SMS automatically.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Button asChild><Link href="/">Browse Products</Link></Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isDelivered = order.orderStatus === "delivered"
                const isShipped = ["shipped", "dispatched"].includes(order.orderStatus)
                const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : null
                const canReturn = isDelivered && order.deliveredAt && !order.returnRequest &&
                  (Date.now() - new Date(order.deliveredAt).getTime()) < 14 * 24 * 60 * 60 * 1000

                return (
                  <div key={order._id} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-medium">{order.orderId}</p></div>
                        <div className="hidden sm:block h-8 w-px bg-border" />
                        <div><p className="text-sm text-muted-foreground">Placed on</p><p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p></div>
                        <div className="hidden sm:block h-8 w-px bg-border" />
                        <div><p className="text-sm text-muted-foreground">Total</p><p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p></div>
                        <div className="hidden sm:block h-8 w-px bg-border" />
                        <div><p className="text-sm text-muted-foreground">Payment</p><p className="font-medium capitalize">{order.paymentMethod}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusIcon status={order.orderStatus} />
                        <Badge variant={statusBadgeVariant(order.orderStatus)} className="capitalize">{order.orderStatus}</Badge>
                      </div>
                    </div>

                    <div className="p-4 md:p-6">
                      <div className="space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <Link href={`/product/${item.product?.slug || item.product?._id}`} className="shrink-0">
                              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted">
                                <Image src={item.product?.images?.[0] || "/placeholder.svg"} alt={item.product?.name || "Product"} fill className="object-cover" />
                              </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground line-clamp-1">{item.product?.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                              <p className="font-medium mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-border">
                        {isDelivered && deliveredDate && (
                          <p className="text-sm text-green-600"><CheckCircle className="h-4 w-4 inline mr-1" />Delivered on {deliveredDate}</p>
                        )}
                        {isShipped && (
                          <p className="text-sm text-blue-600"><Truck className="h-4 w-4 inline mr-1" />Shipped — on the way</p>
                        )}
                        {order.trackingId && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                            <p className="text-sm text-muted-foreground">AWB: {order.trackingId}{order.courierPartner ? ` via ${order.courierPartner}` : ""}</p>
                          </div>
                        )}
                        {order.returnRequest && (
                          <p className="text-sm text-amber-600 mt-2"><RotateCcw className="h-4 w-4 inline mr-1" />Return {order.returnRequest.status}</p>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <Link href={`/track-order?id=${order.orderId}`}><Eye className="h-4 w-4" />Track</Link>
                        </Button>
                        {isShipped && (
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/track-order?id=${order.orderId}`}><Truck className="h-4 w-4" />Track Shipment</Link>
                          </Button>
                        )}
                        {canReturn && (
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/account/returns?orderId=${order.orderId}`}><RotateCcw className="h-4 w-4" />Return / Exchange</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
