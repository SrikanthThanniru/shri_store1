"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Eye,
  RotateCcw,
  Truck,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api"
import { toast } from "sonner"

export default function AccountPage() {
  const router = useRouter()
  const { user, isLoggedIn, loading, logout, refreshUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Pre-fill form when user loads
  useState(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
    }
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfile({ name, email, phone })
      await refreshUser()
      toast.success("Profile updated")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleDeleteAddress = async (_id: string) => {
    // Address deletion API not available yet – show a friendly message.
    toast.info("Address removal will be available soon.")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></main>
        <Footer />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-6">Please login to access your account.</p>
            <Button asChild><Link href="/login">Login / Sign Up</Link></Button>
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
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground">{user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.phone}</p>
                </div>
                <nav className="space-y-1">
                  <Link href="/account" className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary"><User className="h-4 w-4" /><span className="text-sm font-medium">Profile</span></Link>
                  <Link href="/account/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Package className="h-4 w-4" /><span className="text-sm font-medium">My Orders</span></Link>
                  <Link href="/account/returns" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><RotateCcw className="h-4 w-4" /><span className="text-sm font-medium">Returns</span></Link>
                  <Link href="/track-order" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Truck className="h-4 w-4" /><span className="text-sm font-medium">Track Order</span></Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"><LogOut className="h-4 w-4" /><span className="text-sm font-medium">Logout</span></button>
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                  <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Profile</TabsTrigger>
                  <TabsTrigger value="addresses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Addresses</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled /></div>
                      </div>
                      <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Changes
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="addresses">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.addresses?.map((address) => (
                      <div
                        key={address._id || address.label || address.line1}
                        className="bg-card rounded-lg border border-border p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {address.label || "Shipping Address"}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {user.name}
                              {user.phone ? ` \u2022 ${user.phone}` : ""}
                            </p>
                          </div>
                          {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{address.line1}</p>
                        {address.line2 && (
                          <p className="text-sm text-muted-foreground mb-1">{address.line2}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {!address.isDefault && address._id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address._id!)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!user?.addresses || user.addresses.length === 0) && (
                      <p className="text-muted-foreground col-span-2 text-center py-8">
                        No saved addresses. Addresses are saved when you place an order.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
