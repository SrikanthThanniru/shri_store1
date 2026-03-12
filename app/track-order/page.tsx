"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Search,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  Box,
  ExternalLink,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { ordersApi, type OrderTracking } from "@/lib/api"
import { toast } from "sonner"

function TrackContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""
  const [orderId, setOrderId] = useState(initialId)
  const [result, setResult] = useState<OrderTracking | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialId) {
      handleTrackById(initialId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTrackById = async (id: string) => {
    setSearched(true)
    setLoading(true)
    try {
      const data = await ordersApi.track(id)
      setResult(data.order)
    } catch {
      setResult(null)
      toast.error("Order not found")
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) handleTrackById(orderId.trim())
  }

  const StatusIcon = ({ status }: { status: string }) => {
    const s = status.toLowerCase()
    if (s === "delivered") return <CheckCircle className="h-4 w-4" />
    if (s.includes("transit") || s === "shipped") return <MapPin className="h-4 w-4" />
    if (s.includes("delivery") || s === "dispatched") return <Truck className="h-4 w-4" />
    if (s === "packed" || s === "processing") return <Box className="h-4 w-4" />
    if (s === "confirmed") return <Package className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-8">Track Your Order</h1>

          <div className="max-w-xl mx-auto mb-10">
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Enter your Order ID to track your shipment. You can find it in your WhatsApp or SMS confirmation.
              </p>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input id="orderId" placeholder="e.g. SA-M7K2X-AB4D" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Track Order
                </Button>
              </form>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          )}

          {searched && !loading && result && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="text-xl font-bold">{result.orderId}</p>
                  </div>
                  <Badge variant="secondary" className="w-fit text-sm px-3 py-1 capitalize">{result.orderStatus}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {result.trackingId && <div><p className="text-muted-foreground">AWB</p><p className="font-medium">{result.trackingId}</p></div>}
                  {result.courierPartner && <div><p className="text-muted-foreground">Carrier</p><p className="font-medium">{result.courierPartner}</p></div>}
                  {result.estimatedDelivery && <div><p className="text-muted-foreground">Est. Delivery</p><p className="font-medium">{result.estimatedDelivery}</p></div>}
                </div>
              </div>

              {result.statusHistory && result.statusHistory.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold mb-6">Shipment Timeline</h2>
                  <div className="space-y-0">
                    {result.statusHistory.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
                            <StatusIcon status={step.status} />
                          </div>
                          {i < result.statusHistory.length - 1 && <div className="w-0.5 h-12 bg-green-200" />}
                        </div>
                        <div className="pb-8">
                          <p className="font-medium capitalize">{step.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(step.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            {step.note && ` — ${step.note}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-800">Shipping updates are sent via WhatsApp (Interakt) & SMS automatically.</p>
                </div>
              </div>
            </div>
          )}

          {searched && !loading && !result && (
            <div className="max-w-xl mx-auto text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">Check your Order ID and try again.</p>
              <Button variant="outline" asChild><Link href="/contact">Contact Support</Link></Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <TrackContent />
    </Suspense>
  )
}
