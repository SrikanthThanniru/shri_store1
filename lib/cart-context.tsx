"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { cartApi, productsApi, type Product } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export interface LocalCartItem {
  _id: string
  product: Product
  quantity: number
}

interface CartContextType {
  items: LocalCartItem[]
  loading: boolean
  cartCount: number
  addItem: (product: Product, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [],
  loading: true,
  cartCount: 0,
  addItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
})

const GUEST_CART_KEY = "shriaaum_guest_cart"

function getGuestCart(): LocalCartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveGuestCart(items: LocalCartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading: authLoading } = useAuth()
  const [items, setItems] = useState<LocalCartItem[]>([])
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    if (authLoading) return
    setLoading(true)
    try {
      if (isLoggedIn) {
        const data = await cartApi.get()
        setItems(data.cart?.items || [])
      } else {
        setItems(getGuestCart())
      }
    } catch {
      if (!isLoggedIn) setItems(getGuestCart())
      else setItems([])
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, authLoading])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      const guestItems = getGuestCart()
      if (guestItems.length > 0) {
        Promise.all(
          guestItems.map((item) =>
            cartApi.addItem(item.product._id, item.quantity).catch(() => {})
          )
        ).then(() => {
          localStorage.removeItem(GUEST_CART_KEY)
          refreshCart()
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authLoading])

  const addItem = async (product: Product, quantity: number = 1) => {
    if (isLoggedIn) {
      const data = await cartApi.addItem(product._id, quantity)
      setItems(data.cart?.items || [])
    } else {
      const current = getGuestCart()
      const existing = current.find((i) => i.product._id === product._id)
      let updated: LocalCartItem[]
      if (existing) {
        updated = current.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      } else {
        updated = [...current, { _id: product._id, product, quantity }]
      }
      saveGuestCart(updated)
      setItems(updated)
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    if (isLoggedIn) {
      const data = await cartApi.updateItem(itemId, quantity)
      setItems(data.cart?.items || [])
    } else {
      const current = getGuestCart()
      const updated = current.map((i) =>
        i._id === itemId ? { ...i, quantity } : i
      )
      saveGuestCart(updated)
      setItems(updated)
    }
  }

  const removeItem = async (itemId: string) => {
    if (isLoggedIn) {
      const data = await cartApi.removeItem(itemId)
      setItems(data.cart?.items || [])
    } else {
      const current = getGuestCart()
      const updated = current.filter((i) => i._id !== itemId)
      saveGuestCart(updated)
      setItems(updated)
    }
  }

  const clearCart = async () => {
    if (isLoggedIn) {
      await cartApi.clear()
    }
    localStorage.removeItem(GUEST_CART_KEY)
    setItems([])
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, loading, cartCount, addItem, updateItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
