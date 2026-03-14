"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Lock, ChevronRight, CreditCard, Smartphone, Truck, User, ArrowRight, MessageCircle, Loader2, CheckCircle, XCircle, Package } from "lucide-react"
import { ordersApi, paymentsApi, authApi, couponsApi, shippingApi, getProductImage, type Address, type CourierRate } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
]

type CheckoutMode = "choose" | "guest" | "registered"
type Step = "account" | "details" | "payment"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const { items, loading: cartLoading, clearCart } = useCart()

  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(isLoggedIn ? "registered" : "choose")
  const [step, setStep] = useState<Step>(isLoggedIn ? "details" : "account")
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)
  const [loading, setLoading] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [weight] = useState(0.5)
  const [notes, setNotes] = useState("")

  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "serviceable" | "not-serviceable">("idle")
  const [courierRates, setCourierRates] = useState<CourierRate[]>([])
  const [selectedCourier, setSelectedCourier] = useState<number | null>(null)
  const [ratesLoading, setRatesLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      setCheckoutMode("registered")
      setStep("details")
      if (user?.addresses?.length) {
        const def = user.addresses.find((a) => a.isDefault) || user.addresses[0]
        setFirstName(user.name?.split(" ")[0] || "")
        setLastName(user.name?.split(" ").slice(1).join(" ") || "")
        setPhone(user.phone || "")
        setEmail(user.email || "")
        setLine1(def.line1)
        setLine2(def.line2 || "")
        setCity(def.city)
        setState(def.state)
        setPincode(def.pincode)
      }
    }
  }, [isLoggedIn, user])

  // Pincode serviceability / courier-rate API is disabled for now.
  // We keep local state but do not hit the backend.
  const checkPincode = async (pin: string) => {
    if (pin.length !== 6) {
      setPincodeStatus("idle")
      setCourierRates([])
      setSelectedCourier(null)
      return
    }
    setPincodeStatus("idle")
    setCourierRates([])
    setSelectedCourier(null)
  }

  const fetchCourierRates = async (_pin: string) => {
    setRatesLoading(false)
    setCourierRates([])
    setSelectedCourier(null)
  }

  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6)
    setPincode(cleaned)
    setPincodeStatus("idle")
    setCourierRates([])
    setSelectedCourier(null)
  }

  const validateShippingForm = (): boolean => {
    const contactPhone = checkoutMode === "guest" ? guestPhone : phone
    const contactName = checkoutMode === "guest" ? guestName : `${firstName} ${lastName}`.trim()

    if (!contactName.trim()) { toast.error("Please enter your name"); return false }
    if (!contactPhone.trim() || !/^\d{10}$/.test(contactPhone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number"); return false
    }
    const contactEmail = checkoutMode === "guest" ? guestEmail : email
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      toast.error("Please enter a valid email address"); return false
    }
    if (!line1.trim()) { toast.error("Please enter your address"); return false }
    if (!city.trim()) { toast.error("Please enter your city"); return false }
    if (!state.trim()) { toast.error("Please select your state"); return false }
    if (!/^\d{6}$/.test(pincode)) { toast.error("Please enter a valid 6-digit pincode"); return false }
    if (pincodeStatus === "not-serviceable") { toast.error("Delivery is not available to this pincode"); return false }
    return true
  }

  const selectedRate = courierRates.find((r) => r.courier_company_id === selectedCourier)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  // For testing phase, shipping is always free (₹0)
  const shippingCost = 0
  const shipping = shippingCost
  const total = subtotal - discount + shipping

  const shippingAddress: Address = {
    name: checkoutMode === "guest" ? guestName : `${firstName} ${lastName}`.trim(),
    phone: checkoutMode === "guest" ? guestPhone : (phone || user?.phone),
    email: checkoutMode === "guest" ? guestEmail : (email || user?.email),
    line1,
    line2: line2 || undefined,
    city,
    state,
    pincode,
    weight,
  }

  const handleApplyCoupon = async () => {
    try {
      const data = await couponsApi.validate(couponCode, subtotal)
      setDiscount(data.discount)
      toast.success(`Coupon applied! You save ₹${data.discount}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid coupon")
    }
  }

  const openRazorpay = async (orderId: string) => {
    try {
      const payData = await paymentsApi.createOrder(orderId)
      const options = {
        key: payData.key,
        amount: payData.amount,
        currency: payData.currency,
        name: "Shri Aaum",
        description: `Order ${orderId}`,
        order_id: payData.razorpayOrderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            })
            // Clear cart after successful online payment
            await clearCart()
            router.push(`/order-confirmation?orderId=${orderId}&mode=${checkoutMode}&total=${total}`)
          } catch {
            toast.error("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: checkoutMode === "guest" ? guestEmail : user?.email,
          contact: shippingAddress.phone,
        },
        theme: { color: "#7c2d12" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment")
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateShippingForm()) return
    setPlacing(true)
    try {
      // Debug logs so backend grandTotal can be cross-checked
      console.log("[Checkout] placing order with totals", {
        mode: checkoutMode,
        paymentMethod,
        subtotal,
        shipping,
        discount,
        total,
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      })

      let result
      const courierInfo = selectedRate ? { courier_company_id: selectedRate.courier_company_id, courier_name: selectedRate.courier_name, shipping_cost: selectedRate.rate } : undefined

      if (checkoutMode === "guest") {
        result = await ordersApi.createGuest({
          guestInfo: { name: guestName, email: guestEmail, phone: guestPhone },
          items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
          shippingAddress,
          paymentMethod: paymentMethod === "razorpay" ? "razorpay" : "cod",
          couponCode: discount > 0 ? couponCode : undefined,
          notes: notes || undefined,
          ...(courierInfo && { courierInfo }),
        })
      } else {
        result = await ordersApi.create({
          shippingAddress,
          paymentMethod: paymentMethod === "razorpay" ? "razorpay" : "cod",
          couponCode: discount > 0 ? couponCode : undefined,
          notes: notes || undefined,
          ...(courierInfo && { courierInfo }),
        })
      }

      const orderId = result.order.orderId || result.order._id

      if (result.paymentRequired && paymentMethod === "razorpay") {
        await openRazorpay(orderId!)
      } else {
        await clearCart()
        router.push(`/order-confirmation?orderId=${orderId}&mode=${checkoutMode}&total=${total}`)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  const currentStepIndex = step === "account" ? 0 : step === "details" ? 1 : 2
  const steps = [
    { key: "account", label: "Account" },
    { key: "details", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ]

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-8">Checkout</h1>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Account — Choose Mode */}
              {step === "account" && checkoutMode === "choose" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">How would you like to checkout?</p>

                  <button
                    onClick={() => setCheckoutMode("guest")}
                    className="w-full bg-card rounded-lg border border-border p-5 flex items-center gap-4 hover:border-primary hover:shadow-sm transition-all text-left active:scale-[0.99]"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-base font-semibold text-foreground">Continue as Guest</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">No account required, quick checkout</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-secondary px-4 text-muted-foreground">or</span></div>
                  </div>

                  <button
                    onClick={() => setCheckoutMode("registered")}
                    className="w-full bg-card rounded-lg border border-border p-5 flex items-center gap-4 hover:border-primary hover:shadow-sm transition-all text-left active:scale-[0.99]"
                  >
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm sm:text-base font-semibold text-foreground">Login with Phone Number</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Faster checkout with saved address & order tracking</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                </div>
              )}

              {/* Step 1a: Guest Form */}
              {step === "account" && checkoutMode === "guest" && (
                <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-foreground">Guest Checkout</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Enter your details to continue</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">Full Name</Label>
                      <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Rahul Sharma" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">Phone</Label>
                      <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs sm:text-sm">Email (Optional)</Label>
                      <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <Button variant="outline" onClick={() => setCheckoutMode("choose")} className="text-xs sm:text-sm">Back</Button>
                    <Button className="flex-1 gap-2 text-xs sm:text-sm" onClick={() => setStep("details")} disabled={!guestName || !guestPhone}>
                      Continue to Shipping<ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1b: Login with OTP */}
              {step === "account" && checkoutMode === "registered" && !isLoggedIn && (
                <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-foreground">Login with Phone</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">We&apos;ll send you a one-time password</p>
                    </div>
                  </div>
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm">Phone Number</Label>
                        <Input id="loginPhone" placeholder="+91 98765 43210" />
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => { setCheckoutMode("choose"); setOtpSent(false) }} className="text-xs sm:text-sm">Back</Button>
                        <Button className="flex-1 gap-2 text-xs sm:text-sm" onClick={() => { setOtpSent(true); authApi.sendOtp((document.getElementById("loginPhone") as HTMLInputElement)?.value) }}>
                          Send OTP<ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm">Enter OTP</Label>
                        <Input id="loginOtp" placeholder="6-digit OTP" maxLength={6} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Didn&apos;t receive?{" "}
                        <button className="text-primary font-medium hover:underline" onClick={() => authApi.sendOtp((document.getElementById("loginPhone") as HTMLInputElement)?.value)}>
                          Resend OTP
                        </button>
                      </p>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setOtpSent(false)} className="text-xs sm:text-sm">Back</Button>
                        <Button className="flex-1 text-xs sm:text-sm" onClick={async () => {
                          try {
                            const phone = (document.getElementById("loginPhone") as HTMLInputElement)?.value
                            const otp = (document.getElementById("loginOtp") as HTMLInputElement)?.value
                            await authApi.verifyOtp(phone, otp)
                            window.location.reload()
                          } catch { toast.error("Invalid OTP") }
                        }}>Verify & Continue</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === "details" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">First Name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul" /></div>
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" /></div>
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Phone (10 digits)</Label><Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" maxLength={10} /></div>
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Email (Optional)</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" /></div>
                      <div className="space-y-1.5 md:col-span-2"><Label className="text-xs sm:text-sm">Address Line 1</Label><Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="House/Flat No., Building Name" /></div>
                      <div className="space-y-1.5 md:col-span-2"><Label className="text-xs sm:text-sm">Address Line 2 (Optional)</Label><Input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Street, Area, Landmark" /></div>
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" /></div>
                      <div className="space-y-1.5"><Label className="text-xs sm:text-sm">State</Label>
                        <Select value={state} onValueChange={setState}>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>{indianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm">PIN Code (6 digits)</Label>
                        <div className="relative">
                          <Input
                            value={pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            placeholder="400001"
                            maxLength={6}
                            className={pincodeStatus === "not-serviceable" ? "border-destructive" : pincodeStatus === "serviceable" ? "border-green-500" : ""}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {pincodeStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                            {pincodeStatus === "serviceable" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {pincodeStatus === "not-serviceable" && <XCircle className="h-4 w-4 text-destructive" />}
                          </div>
                        </div>
                        {pincodeStatus === "serviceable" && (
                          <p className="text-[10px] sm:text-xs text-green-600 mt-0.5">Delivery available to this pincode</p>
                        )}
                        {pincodeStatus === "not-serviceable" && (
                          <p className="text-[10px] sm:text-xs text-destructive mt-0.5">Delivery not available to this pincode</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Checkbox id="sameAsBilling" checked={sameAsBilling} onCheckedChange={(c) => setSameAsBilling(c as boolean)} />
                      <Label htmlFor="sameAsBilling" className="text-xs sm:text-sm cursor-pointer">Billing address same as shipping</Label>
                    </div>
                  </div>

                  {/* Courier Selection */}
                  {courierRates.length > 0 && (
                    <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                      <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3">Shipping Method</h2>
                      <RadioGroup value={String(selectedCourier)} onValueChange={(v) => setSelectedCourier(Number(v))}>
                        <div className="space-y-2">
                          {courierRates.map((rate) => (
                            <label
                              key={rate.courier_company_id}
                              className={`flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${selectedCourier === rate.courier_company_id ? "border-primary bg-primary/5" : "border-border"}`}
                            >
                              <RadioGroupItem value={String(rate.courier_company_id)} />
                              <Package className="h-4 w-4 text-primary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-foreground">{rate.courier_name}</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  Estimated delivery: {rate.etd || `${rate.estimated_delivery_days} days`}
                                </p>
                              </div>
                              <span className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
                                ₹{rate.rate.toLocaleString("en-IN")}
                              </span>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  {ratesLoading && (
                    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border border-border">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Fetching shipping rates...</p>
                    </div>
                  )}

                  <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3">Order Notes (Optional)</h2>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." className="min-h-[80px] text-xs sm:text-sm" />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md">
                    <MessageCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <p className="text-[10px] sm:text-xs text-green-700">Order updates will be sent via WhatsApp & SMS.</p>
                  </div>

                  <div className="flex gap-3">
                    {!isLoggedIn && <Button variant="outline" className="text-xs sm:text-sm" onClick={() => setStep("account")}>Back</Button>}
                    <Button
                      className="flex-1 text-xs sm:text-sm"
                      size="lg"
                      onClick={() => { if (validateShippingForm()) setStep("payment") }}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Payment Method</h2>
                    <p className="text-sm text-muted-foreground mb-4">Powered by Razorpay — secure payments</p>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "border-primary bg-primary/5" : "border-border"}`}>
                          <RadioGroupItem value="razorpay" />
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Pay Online (Razorpay)</p>
                            <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                          </div>
                        </label>
                        <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                          <RadioGroupItem value="cod" />
                          <Truck className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                    <Lock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep("details")}>Back</Button>
                    <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={placing}>
                      {placing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {paymentMethod === "cod" ? `Place Order — ₹${total.toLocaleString('en-IN')}` : `Pay ₹${total.toLocaleString('en-IN')}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted shrink-0">
                        <Image src={getProductImage(item.product)} alt={item.product.name} fill className="object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && checkoutMode === "guest" && (
                    <p className="text-sm text-muted-foreground">Items will be added at checkout</p>
                  )}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  {discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Shield className="h-4 w-4" /><span>Secure</span></div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-4 w-4" /><span>Encrypted</span></div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="h-4 w-4" /><span>WhatsApp</span></div>
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
