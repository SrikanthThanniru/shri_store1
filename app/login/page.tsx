"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Smartphone, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-secondary">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Login to your Shri Aaum account
              </p>
            </div>

            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="phone" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                {!otpSent ? (
                  <form onSubmit={(e) => { e.preventDefault(); setOtpSent(true); }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                          <div className="w-20 px-3 py-2 bg-muted rounded-md text-sm text-center border border-input">
                            +91
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        Send OTP
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                        <p className="text-xs text-muted-foreground">
                          OTP sent to +91 98765 XXXXX
                        </p>
                      </div>
                      <Button type="submit" className="w-full">
                        Verify & Login
                      </Button>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-full text-sm text-primary hover:underline"
                      >
                        Change phone number
                      </button>
                    </div>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="email">
                <form>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to Shri Aaum?
                </span>
              </div>
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Create an Account</Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
