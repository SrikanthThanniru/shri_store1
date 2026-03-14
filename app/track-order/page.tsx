"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Package,
  Search,
  CheckCircle,
  Truck,
  Box,
  ExternalLink,
  MessageCircle,
  Loader2,
  Clock,
} from "lucide-react"
import { ordersApi, type OrderTracking, type TrackStatus } from "@/lib/api"
import { toast } from "sonner"

const STATUS_STEPS: { key: TrackStatus | "processing" | "confirmed"; label: string; icon: React.ReactNode }[] = [
  { key: "processing", label: "Order Confirmed", icon: <Clock className="h-4 w-4" /> },
  { key: "shipped", label: "Shipped", icon: <Truck className="h-4 w-4" /> },
  { key: "out_for_delivery", label: "Out for Delivery", icon: <Box className="h-4 w-4" /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle className="h-4 w-4" /> },
]

function getStatusIcon(status: string) {
  const s = status.toLowerCase()
  if (s === "delivered") return <CheckCircle className="h-6 w-6 text-green-600" />
  if (s === "out_for_delivery") return <Box className="h-6 w-6 text-primary" />
  if (s === "shipped") return <Truck className="h-6 w-6 text-primary" />
  return <Clock className="h-6 w-6 text-muted-foreground" />
}

function isStepActive(stepKey: string, orderStatus: string): boolean {
  const s = orderStatus.toLowerCase()
  if (stepKey === "processing" || stepKey === "confirmed") return ["processing", "confirmed", "placed"].includes(s) || !["shipped", "out_for_delivery", "delivered"].includes(s)
  if (stepKey === "shipped") return ["shipped", "out_for_delivery", "delivered"].includes(s)
  if (stepKey === "out_for_delivery") return ["out_for_delivery", "delivered"].includes(s)
  if (stepKey === "delivered") return s === "delivered"
  return false
}

function TrackContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""
  const [orderId, setOrderId] = useState(initialId)
  const [result, setResult] = useState<OrderTracking | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchStatus = useCallback(async (id: string) => {
    try {
      let data
      try {
        data = await ordersApi.trackOrderById(id)
      } catch {
        data = await ordersApi.track(id)
      }
      setResult(data.order)
    } catch {
      setResult(null)
      toast.error("Order not found")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleTrackById = useCallback((id: string) => {
    setSearched(true)
    setLoading(true)
    fetchStatus(id)
  }, [fetchStatus])

  useEffect(() => {
    if (initialId) handleTrackById(initialId)
  }, [initialId])

  useEffect(() => {
    if (!orderId || !searched || !result) return
    const interval = setInterval(() => fetchStatus(orderId), 300000)
    return () => clearInterval(interval)
  }, [orderId, searched, result, fetchStatus])

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) handleTrackById(orderId.trim())
  }

  const displayId = result?.orderId || result?.orderNumber || orderId
  const status = (result?.status || result?.orderStatus || "processing").toLowerCase()
  const awb = result?.awb || result?.awbCode || result?.trackingId

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
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-base sm:text-xl font-bold mb-6">Order #{displayId}</h2>

              {/* Current status */}
              <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="shrink-0">{getStatusIcon(status)}</span>
                  <div>
                    <div className="font-semibold text-foreground capitalize">{status.replace(/_/g, " ")}</div>
                    {result.current_status && (
                      <div className="text-sm text-muted-foreground mt-1">{result.current_status}</div>
                    )}
                  </div>
                </div>

                {awb && (
                  <a
                    href={`https://track.shiprocket.in/${awb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Track on Shiprocket
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* 4-step timeline */}
              <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Status</h3>
                <div className="space-y-4">
                  {STATUS_STEPS.map((step, i) => {
                    const active = isStepActive(step.key, status)
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-3 ${active ? "text-foreground" : "text-muted-foreground opacity-60"}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                          {step.icon}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Details card */}
              <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {awb && <div><p className="text-muted-foreground">AWB</p><p className="font-medium">{awb}</p></div>}
                  {result.courierPartner && <div><p className="text-muted-foreground">Carrier</p><p className="font-medium">{result.courierPartner}</p></div>}
                  {result.estimatedDelivery && <div><p className="text-muted-foreground">Est. Delivery</p><p className="font-medium">{result.estimatedDelivery}</p></div>}
                </div>
              </div>

                    {result.statusHistory && result.statusHistory.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                  <h3 className="text-sm font-semibold mb-4">Shipment Timeline</h3>
                  <div className="space-y-0">
                    {result.statusHistory.map((step, i) => {
                      const rawDate = step.date || step.timestamp
                      const formattedDate = rawDate
                        ? new Date(rawDate).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : null

                      return (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                              {getStatusIcon(step.status)}
                            </div>
                            {i < result.statusHistory!.length - 1 && (
                              <div className="w-0.5 h-8 bg-border" />
                            )}
                          </div>
                          <div className="pb-6">
                            <p className="font-medium capitalize text-sm">
                              {step.status.replace(/_/g, " ")}
                            </p>
                            {formattedDate && (
                              <p className="text-xs text-muted-foreground">
                                {formattedDate}
                                {step.note && ` — ${step.note}`}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">Shipping updates are sent via WhatsApp (Interakt) & SMS automatically.</p>
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
