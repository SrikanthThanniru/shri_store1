"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2 } from "lucide-react"
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, setUser } = useAuth()

  const countryCode = "+91"
  const [step, setStep] = useState(1)
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")

  const returnTo = searchParams.get("returnTo") || "/account"

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobile || mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number")
      return
    }
    setLoading(true)
    try {
      const res = await authApi.sendOtp(mobile, countryCode)
      if (res.success) {
        setStep(2)
        toast.success("OTP sent successfully!")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP")
      return
    }
    setLoading(true)
    try {
      const result = await login(mobile, otp)
      if (result.isNewUser) {
        setStep(3)
        toast.success("OTP verified! Please complete your profile.")
      } else {
        toast.success("Login successful!")
        router.push(returnTo)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter your name")
      return
    }
    setLoading(true)
    try {
      const res = await authApi.completeProfile({
        name,
      })
      if (res.user) {
        setUser(res.user)
        localStorage.setItem("user", JSON.stringify(res.user))
      }
      toast.success("Profile completed!")
      router.push(returnTo)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Profile update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-secondary">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <Image
                src="/logo.png"
                alt="Shri Aaum"
                width={64}
                height={64}
                className="mx-auto mb-4 object-contain"
              />
              <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                {step === 3
                  ? "Complete your profile to continue"
                  : "Enter your mobile to receive OTP"}
              </p>
            </div>

            {/* STEP 1: Mobile Number */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                      <div className="w-20 px-3 py-2 bg-muted rounded-md text-sm text-center border border-input font-medium">
                        {countryCode}
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile"
                        className="flex-1"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Send OTP
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      OTP sent to <strong className="text-foreground">{countryCode} {mobile}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => { setStep(1); setOtp("") }}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Change
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading || otp.length !== 6}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Verify OTP
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                    className="w-full text-sm text-muted-foreground hover:text-primary"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Complete Profile (new users) */}
            {step === 3 && (
              <form onSubmit={handleCompleteProfile}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={loading || !name.trim()}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Complete Profile
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            )}

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
