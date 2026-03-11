"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Shield, Lock, ChevronRight, CreditCard, Smartphone, Banknote, Truck } from "lucide-react"

const cartItems = [
  {
    id: "1",
    name: "Brass Ganesha Idol - Energised",
    price: 2999,
    image: "/images/product-1.jpg",
    quantity: 1,
  },
  {
    id: "2",
    name: "5 Mukhi Rudraksha Mala",
    price: 1499,
    image: "/images/product-2.jpg",
    quantity: 2,
  },
  {
    id: "3",
    name: "Complete Puja Thali Set",
    price: 1299,
    image: "/images/product-3.jpg",
    quantity: 1,
  },
]

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
]

export default function CheckoutPage() {
  const [step, setStep] = useState<"details" | "payment">("details")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-4 mb-8">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "details" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
              }`}>
                1
              </div>
              <span className="text-sm font-medium hidden sm:inline">Details</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === "details" ? (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      We will send order updates via WhatsApp and SMS
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Rahul" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Sharma" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address Line 1</Label>
                        <Input id="address" placeholder="House/Flat No., Building Name" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                        <Input id="address2" placeholder="Street, Area, Landmark" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Mumbai" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state.toLowerCase().replace(/ /g, '-')}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input id="pincode" placeholder="400001" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Checkbox 
                        id="sameAsBilling" 
                        checked={sameAsBilling}
                        onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                      />
                      <Label htmlFor="sameAsBilling" className="text-sm cursor-pointer">
                        Billing address same as shipping
                      </Label>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Order Notes (Optional)
                    </h2>
                    <Textarea
                      placeholder="Any special instructions for your order..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setStep("payment")}
                  >
                    Continue to Payment
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Payment Method
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Powered by GoKwik - India&#39;s most trusted checkout
                    </p>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="upi" />
                          <Smartphone className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">UPI</p>
                            <p className="text-sm text-muted-foreground">
                              GPay, PhonePe, Paytm, BHIM
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="card" />
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Credit / Debit Card</p>
                            <p className="text-sm text-muted-foreground">
                              Visa, Mastercard, RuPay
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === "netbanking" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="netbanking" />
                          <Banknote className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Net Banking</p>
                            <p className="text-sm text-muted-foreground">
                              All major banks supported
                            </p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value="cod" />
                          <Truck className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when you receive
                            </p>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                    <Lock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("details")}
                    >
                      Back
                    </Button>
                    <Button className="flex-1" size="lg">
                      Place Order - ₹{total.toLocaleString('en-IN')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Accordion type="single" collapsible className="border-t border-border pt-4">
                  <AccordionItem value="details" className="border-none">
                    <AccordionTrigger className="py-2 text-sm">
                      Price Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax (incl.)</span>
                          <span>₹0</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-lg text-foreground">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Encrypted</span>
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
