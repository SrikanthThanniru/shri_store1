"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, X, LogOut, Flame, Gem, BookOpen, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

const categories = [
  { name: "Puja Items", href: "/category/puja-items", icon: Flame },
  { name: "Idols & Murtis", href: "/category/idols-murtis", icon: Package },
  { name: "Gemstones & Malas", href: "/category/gemstones-malas", icon: Gem },
  { name: "Books & Scriptures", href: "/category/books-scriptures", icon: BookOpen },
]


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
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-5">
        {/* Mobile header: Logo | Search bar | Account icon */}
        <div className="flex lg:hidden items-center justify-between h-12">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Shri Aaum"
              width={44}
              height={44}
              className="h-10 w-10 object-contain"
            />
          </Link>

          <form onSubmit={handleSearch} className="w-[50%]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-full bg-secondary border-none"
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
                <User className="h-6 w-6" />
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
                  <DropdownMenuItem asChild><Link href="/account">My Account</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/account/orders">My Orders</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/track-order">Track Order</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link href="/login">Login / Sign Up</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/track-order">Track Order</Link></DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/logo.png"
              alt="Shri Aaum"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-serif font-bold text-primary tracking-wide leading-none whitespace-nowrap">
                Shri Aaum
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.25em] uppercase whitespace-nowrap leading-none mt-0.5">
                Divine Blessings
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-8">
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

          <div className="flex items-center gap-2">
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
                <Button variant="ghost" size="icon" type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}>
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

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
                    <DropdownMenuItem asChild><Link href="/account">My Account</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/account/orders">My Orders</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/track-order">Track Order</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link href="/login">Login / Sign Up</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/track-order">Track Order</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cart">
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
