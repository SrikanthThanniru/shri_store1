"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Home, Flame, Gem, BookOpen, Package, Info, Phone, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

const categories = [
  { name: "Puja Items", href: "/category/puja-items", icon: Flame },
  { name: "Idols & Murtis", href: "/category/idols-murtis", icon: Package },
  { name: "Gemstones & Malas", href: "/category/gemstones-malas", icon: Gem },
  { name: "Books & Scriptures", href: "/category/books-scriptures", icon: BookOpen },
]

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/90 hover:bg-secondary hover:text-primary transition-colors active:scale-[0.98]"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
    </Link>
  )
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()
  const { cartCount } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      router.push("/")
    } catch {
      toast.error("Failed to logout")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-20">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Browse categories and navigate the site
              </SheetDescription>

              {/* Brand header */}
              <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border bg-secondary/50">
                <Image
                  src="/logo.png"
                  alt="Shri Aaum"
                  width={36}
                  height={36}
                  className="h-8 w-8 object-contain"
                />
                <div>
                  <p className="text-sm font-serif font-bold text-primary leading-none">Shri Aaum</p>
                  <p className="text-[8px] text-muted-foreground tracking-[0.2em] uppercase mt-0.5">Divine Blessings</p>
                </div>
              </div>

              {/* Scrollable nav */}
              <nav className="flex-1 overflow-y-auto py-2">
                <SidebarLink href="/" icon={Home} label="Home" />

                <div className="px-4 pt-3 pb-1.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
                </div>
                {categories.map((cat) => (
                  <SidebarLink key={cat.name} href={cat.href} icon={cat.icon} label={cat.name} />
                ))}

                <div className="mx-4 my-2 border-t border-border" />

                <SidebarLink href="/track-order" icon={Package} label="Track Order" />
                <SidebarLink href="/about" icon={Info} label="About Us" />
                <SidebarLink href="/contact" icon={Phone} label="Contact" />
              </nav>

              {/* Footer */}
              {isLoggedIn ? (
                <div className="border-t border-border px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{user?.name || "My Account"}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border px-4 py-3">
                  <Link href="/login">
                    <Button className="w-full h-9 text-xs gap-2">
                      <User className="h-3.5 w-3.5" />
                      Login / Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 sm:gap-2 min-w-0">
            <Image
              src="/logo.png"
              alt="Shri Aaum"
              width={48}
              height={48}
              className="h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12 shrink-0 object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm sm:text-lg lg:text-2xl font-serif font-bold text-primary tracking-wide leading-none whitespace-nowrap">
                Shri Aaum
              </span>
              <span className="text-[6px] sm:text-[8px] lg:text-[10px] text-muted-foreground tracking-[0.15em] sm:tracking-[0.25em] uppercase whitespace-nowrap leading-none mt-0.5">
                Divine Blessings
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-64"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <div className="px-2 py-1.5 text-sm">
                      <p className="font-medium">{user?.name || "My Account"}</p>
                      <p className="text-xs text-muted-foreground">{user?.phone}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/track-order">Track Order</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login / Sign Up</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/track-order">Track Order</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart — hidden on mobile since bottom nav has it */}
            <Link href="/cart" className="hidden lg:block">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
