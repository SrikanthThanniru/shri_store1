"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RotateCcw,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Truck,
  MessageCircle,
  CreditCard,
  Loader2,
  Package,
} from "lucide-react"
import { ordersApi, type Order } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

const returnReasons = [
  "Received damaged/broken item",
  "Wrong product received",
  "Product does not match description",
  "Quality not as expected",
  "Changed my mind",
  "Other",
]

export default function AccountReturnsPage() {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null)
  const [requestType, setRequestType] = useState("return")
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState<"select" | "details" | "confirm">("select")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!isLoggedIn) { setLoading(false); return }
    ordersApi.getMyOrders()
      .then((data) => {
        const eligible = data.orders.filter((o) =>
          o.orderStatus === "delivered" &&
          !o.returnRequest &&
          o.deliveredAt &&
          (Date.now() - new Date(o.deliveredAt).getTime()) < 14 * 24 * 60 * 60 * 1000
        )
        setOrders(eligible)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLoggedIn, authLoading])

  const handleSubmit = async () => {
    if (!selectedOrder || !reason) return
    setSubmitting(true)
    try {
      await ordersApi.requestReturn(selectedOrder, {
        reason,
        requestType,
        description: description || undefined,
      })
      setStep("confirm")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit return request")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || authLoading) {
    return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main><Footer /></div>
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center"><Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" /><h1 className="text-2xl font-serif font-bold mb-2">Login Required</h1><p className="text-muted-foreground mb-6">Login to manage returns.</p><Button asChild><Link href="/login">Login / Sign Up</Link></Button></div>
        </main><Footer /></div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Return / Exchange" }]} />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-8">Return / Exchange Request</h1>

          {step === "confirm" ? (
            <div className="max-w-lg mx-auto text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-600" /></div>
              <h2 className="text-2xl font-serif font-bold mb-2">Request Submitted</h2>
              <p className="text-muted-foreground mb-6">Your {requestType} request has been submitted. We will review it and schedule a pickup via Shiprocket.</p>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
                    <li>WhatsApp notification with pickup details</li>
                    <li>Return pickup via Shiprocket reverse logistics</li>
                    <li>Refund within 5–7 business days after verification</li>
                    <li>SMS notification when refund is processed</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild><Link href="/account/orders">View My Orders</Link></Button>
                <Button variant="outline" asChild><Link href="/">Continue Shopping</Link></Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {step === "select" && (
                <>
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <RotateCcw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h2 className="text-xl font-semibold mb-2">No eligible orders</h2>
                      <p className="text-muted-foreground mb-6">You have no orders eligible for return or exchange within the 14-day window.</p>
                      <Button variant="outline" asChild><Link href="/account/orders">View All Orders</Link></Button>
                    </div>
                  ) : (
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><RotateCcw className="h-5 w-5 text-primary" />Select Order</h2>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <label key={order._id} className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedOrder === order.orderId ? "border-primary bg-primary/5" : "border-border"}`}>
                            <input type="radio" name="order" value={order.orderId} checked={selectedOrder === order.orderId} onChange={() => setSelectedOrder(order.orderId)} className="sr-only" />
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{order.orderId}</span>
                              <Badge variant="secondary">₹{order.total.toLocaleString('en-IN')}</Badge>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex gap-3 items-center">
                                  <div className="w-12 h-12 relative rounded overflow-hidden bg-muted shrink-0">
                                    <Image src={item.product?.images?.[0] || "/placeholder.svg"} alt={item.product?.name || ""} fill className="object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                  {item.product?.isEnergised && (
                                    <span className="text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Non-returnable</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </label>
                        ))}
                      </div>
                      <Button className="w-full mt-4 gap-2" disabled={!selectedOrder} onClick={() => setStep("details")}>
                        Continue<ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {step === "details" && (
                <>
                  <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                    <h2 className="text-lg font-semibold">Request Details</h2>
                    <div>
                      <Label className="mb-3 block">Request Type</Label>
                      <RadioGroup value={requestType} onValueChange={setRequestType}>
                        <div className="flex gap-4">
                          <label className={`flex-1 p-4 border rounded-lg cursor-pointer ${requestType === "return" ? "border-primary bg-primary/5" : "border-border"}`}>
                            <div className="flex items-center gap-2"><RadioGroupItem value="return" /><span className="font-medium">Return & Refund</span></div>
                          </label>
                          <label className={`flex-1 p-4 border rounded-lg cursor-pointer ${requestType === "exchange" ? "border-primary bg-primary/5" : "border-border"}`}>
                            <div className="flex items-center gap-2"><RadioGroupItem value="exchange" /><span className="font-medium">Exchange</span></div>
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                        <SelectContent>{returnReasons.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Details (Optional)</Label>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue..." className="min-h-[100px]" />
                    </div>
                    {requestType === "return" && (
                      <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-700">Refund to original payment source within 5–7 business days. COD orders refunded via NEFT.</p>
                      </div>
                    )}
                    <div className="p-4 bg-secondary rounded-lg flex items-start gap-3">
                      <Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">Pickup scheduled via Shiprocket. WhatsApp notification with pickup details.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("select")}>Back</Button>
                    <Button className="flex-1 gap-2" size="lg" onClick={handleSubmit} disabled={!reason || submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Submit Request<ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
