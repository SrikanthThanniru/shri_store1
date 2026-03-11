"use client"

import Link from "next/link"
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
  Heart,
  LogOut,
  ChevronRight,
  Eye,
} from "lucide-react"

const orders = [
  {
    id: "SA-ORD-10234",
    date: "March 5, 2026",
    status: "Delivered",
    total: 5497,
    items: 3,
  },
  {
    id: "SA-ORD-10198",
    date: "February 18, 2026",
    status: "Shipped",
    total: 2999,
    items: 1,
  },
  {
    id: "SA-ORD-10156",
    date: "January 28, 2026",
    status: "Delivered",
    total: 1798,
    items: 2,
  },
]

const addresses = [
  {
    id: 1,
    name: "Rahul Sharma",
    address: "B-204, Sunrise Apartments, MG Road, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400058",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    address: "Office: Floor 12, Tech Park, Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560066",
    phone: "+91 98765 43210",
    isDefault: false,
  },
]

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "My Account" },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-4 mb-8">
            My Account
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground">Rahul Sharma</h2>
                  <p className="text-sm text-muted-foreground">rahul@email.com</p>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-medium">My Orders</span>
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Addresses</span>
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">Wishlist</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                  <TabsTrigger
                    value="profile"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Recent Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="addresses"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Addresses
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                      Personal Information
                    </h3>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Rahul" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Sharma" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" defaultValue="rahul@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                        </div>
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>

                    <div className="border-t border-border mt-8 pt-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Change Password
                      </h3>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div />
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <Input id="confirmNewPassword" type="password" />
                          </div>
                        </div>
                        <Button type="submit" variant="outline">Update Password</Button>
                      </form>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders">
                  <div className="bg-card rounded-lg border border-border">
                    <div className="p-6 border-b border-border">
                      <h3 className="text-lg font-semibold text-foreground">
                        Recent Orders
                      </h3>
                    </div>
                    <div className="divide-y divide-border">
                      {orders.map((order) => (
                        <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium text-foreground">{order.id}</span>
                              <Badge
                                variant={order.status === "Delivered" ? "default" : "secondary"}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.date} • {order.items} item{order.items > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-foreground">
                              ₹{order.total.toLocaleString('en-IN')}
                            </span>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 border-t border-border">
                      <Link
                        href="/account/orders"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View all orders
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="addresses">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-card rounded-lg border border-border p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium text-foreground">{address.name}</h4>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.address}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {address.phone}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {!address.isDefault && (
                            <Button variant="ghost" size="sm">Remove</Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="bg-card rounded-lg border border-dashed border-border p-6 flex items-center justify-center">
                      <Button variant="outline">+ Add New Address</Button>
                    </div>
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
