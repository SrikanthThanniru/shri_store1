import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ─── Types ──────────────────────────────────────────────
export interface User {
  _id: string
  name?: string
  phone?: string
  email?: string
  role?: string
  addresses?: Address[]
}

export interface Address {
  _id?: string
  label?: string
  name?: string
  phone?: string
  email?: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  weight?: number
  isDefault?: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: string
  primaryImage: { public_id: string; url: string }
  additionalImages?: { public_id: string; url: string }[]
  stockStatus: string
  isEnergised: boolean
  ratingsAverage?: number
  ratingsCount?: number
  sku: string
  features?: string[]
  specifications?: Record<string, string>
}

export interface CategoryInfo {
  name: string
  slug: string
  productCount: number
}

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: string
  cta?: string
  link?: string
  position: number
  isActive: boolean
}

export interface Cart {
  _id: string
  items: { _id: string; product: Product; quantity: number }[]
}

export interface Order {
  _id: string
  orderId?: string
  orderNumber: string
  items: { product: Product; quantity: number; price: number; image?: string }[]
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal?: number
  itemsTotal?: number
  shippingCharge?: number
  discount?: number
  total?: number
  grandTotal?: number
  tracking?: { carrier?: string; trackingId?: string; url?: string }
  trackingId?: string
  courierPartner?: string
  deliveredAt?: string
  returnRequest?: { status: string; createdAt?: string }
  returnStatus?: string
  returnReason?: string
  exchangeStatus?: string
  createdAt: string
  updatedAt: string
}

export type TrackStatus = "processing" | "confirmed" | "shipped" | "out_for_delivery" | "delivered"

export interface OrderTracking {
  orderNumber?: string
  orderId?: string
  orderStatus: string
  status?: TrackStatus
  current_status?: string
  awb?: string
  awbCode?: string
  shiprocketOrderId?: string
  trackingId?: string
  courierPartner?: string
  estimatedDelivery?: string
  tracking?: { carrier?: string; trackingId?: string; url?: string }
  items?: { product: { name: string }; quantity: number }[]
  shippingAddress?: Address
  createdAt?: string
  timeline?: { status: string; date: string; description?: string }[]
  statusHistory?: { status: string; date?: string; timestamp?: string; note?: string }[]
}

// ─── Image Helpers ──────────────────────────────────────
export function getProductImage(product: Product): string {
  if (product.primaryImage?.url) return product.primaryImage.url
  return "/placeholder.svg"
}

export function getProductImages(product: Product): string[] {
  const images: string[] = []
  if (product.primaryImage?.url) images.push(product.primaryImage.url)
  if (product.additionalImages?.length) {
    product.additionalImages.forEach((img) => {
      if (img.url) images.push(img.url)
    })
  }
  return images.length > 0 ? images : ["/placeholder.svg"]
}

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  sendOtp: (mobile: string, countryCode: string = "+91") =>
    api.post<{ success: boolean; message: string }>("/auth/send-otp", { mobile, countryCode }).then((r) => r.data),

  verifyOtp: (mobile: string, otp: string, countryCode: string = "+91") =>
    api.post<{ success: boolean; token: string; user: User; isNewUser: boolean }>("/auth/verify-otp", { mobile, otp, countryCode }).then((r) => r.data),

  completeProfile: (data: { name: string; email?: string }) =>
    api.put<{ success: boolean; user: User }>("/auth/complete-profile", data).then((r) => r.data),

  getMe: () =>
    api.get<{ success: boolean; user: User }>("/auth/me").then((r) => r.data),

  logout: () =>
    api.post<{ success: boolean }>("/auth/logout").then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    api.put<{ success: boolean; user: User }>("/auth/profile", data).then((r) => r.data),
}

// ─── Products ──────────────────────────────────────────
export const productsApi = {
  list: (params?: {
    category?: string
    search?: string
    sort?: string
    page?: number
    limit?: number
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }) => {
    return api
      .get<{ success: boolean; products: Product[]; total: number; count: number; totalPages: number; currentPage: number }>("/products", { params })
      .then((r) => ({ ...r.data, pages: r.data.totalPages, page: r.data.currentPage }))
  },

  getBySlugOrId: (slugOrId: string) =>
    api.get<{ success: boolean; product: Product }>(`/products/${slugOrId}`).then((r) => r.data),

  getCategories: () =>
    api.get<{ success: boolean; categories: CategoryInfo[] }>("/products/categories/list").then((r) => r.data),
}

// ─── Cart ──────────────────────────────────────────────
export const cartApi = {
  get: () =>
    api.get<{ success: boolean; cart: Cart }>("/cart").then((r) => r.data),

  addItem: (productId: string, quantity: number = 1) =>
    api.post<{ success: boolean; cart: Cart }>("/cart", { productId, quantity }).then((r) => r.data),

  updateItem: (itemId: string, quantity: number) =>
    api.put<{ success: boolean; cart: Cart }>(`/cart/${itemId}`, { quantity }).then((r) => r.data),

  removeItem: (itemId: string) =>
    api.delete<{ success: boolean; cart: Cart }>(`/cart/${itemId}`).then((r) => r.data),

  clear: () =>
    api.delete<{ success: boolean }>("/cart/clear").then((r) => r.data),
}

// ─── Orders ────────────────────────────────────────────
export const ordersApi = {
  create: (data: {
    shippingAddress: Address
    paymentMethod: string
    notes?: string
    couponCode?: string
    courierInfo?: { courier_company_id: number; courier_name: string; shipping_cost: number }
  }) =>
    api.post<{ success: boolean; order: Order; paymentRequired?: boolean }>("/orders", data).then((r) => r.data),

  createGuest: (data: {
    shippingAddress: Address
    paymentMethod: string
    items: { productId: string; quantity: number }[]
    guestInfo: { name: string; email?: string; phone: string }
    notes?: string
    couponCode?: string
    courierInfo?: { courier_company_id: number; courier_name: string; shipping_cost: number }
  }) =>
    api.post<{ success: boolean; order: Order; paymentRequired?: boolean }>("/orders/guest", data).then((r) => r.data),

  getMyOrders: () =>
    api.get<{ success: boolean; orders: Order[] }>("/orders").then((r) => r.data),

  getById: (id: string) =>
    api.get<{ success: boolean; order: Order }>(`/orders/${id}`).then((r) => r.data),

  trackOrderById: (id: string) =>
    api.get<{ success?: boolean; status?: string; current_status?: string; awb?: string }>(`/track-order/${id}`).then((r) => {
      const d = r.data as Record<string, unknown>
      return {
        success: Boolean(d.success),
        order: {
          orderId: id,
          orderNumber: id,
          orderStatus: (d.status as string) || "processing",
          status: ((d.status as string) || "processing") as TrackStatus,
          current_status: d.current_status as string | undefined,
          awb: d.awb as string | undefined,
        } as OrderTracking,
      }
    }),

  track: (orderIdOrNumber: string) =>
    api.get<{ success: boolean; order?: OrderTracking; status?: string; current_status?: string; awb?: string }>(`/orders/track/${orderIdOrNumber}`).then((r) => {
      const d = r.data as Record<string, unknown>
      const order = (d.order as OrderTracking) || {}
      const status = (order.status || order.orderStatus || d.status || "processing") as string
      const awb = order.awb || order.awbCode || order.trackingId || d.awb
      return {
        success: Boolean(d.success),
        order: {
          ...order,
          orderId: order.orderId || order.orderNumber || orderIdOrNumber,
          orderNumber: order.orderNumber || order.orderId || orderIdOrNumber,
          orderStatus: status,
          status: status as TrackStatus,
          current_status: order.current_status || (d.current_status as string),
          awb: awb as string | undefined,
          trackingId: (order.trackingId || awb) as string | undefined,
        } as OrderTracking,
      }
    }),

  requestReturn: (orderId: string, data: { reason?: string }) =>
    api.post<{ success: boolean }>(`/orders/${orderId}/return`, data).then((r) => r.data),

  requestExchange: (orderId: string, data: { reason?: string; exchangeItems?: string[] }) =>
    api.post<{ success: boolean }>(`/orders/${orderId}/exchange`, data).then((r) => r.data),
}

// ─── Payments ──────────────────────────────────────────
export const paymentsApi = {
  createOrder: (orderId: string) =>
    api.post<{ success: boolean; razorpayOrderId: string; amount: number; currency: string; key: string }>("/payments/create-order", { orderId }).then((r) => r.data),

  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderId: string }) =>
    api.post<{ success: boolean }>("/payments/verify", data).then((r) => r.data),
}

// ─── Coupons ───────────────────────────────────────────
export const couponsApi = {
  validate: (code: string, cartTotal: number) =>
    api.post<{ success: boolean; discount: number; message: string }>("/coupons/validate", { code, cartTotal }).then((r) => r.data),
}

// ─── Banners ───────────────────────────────────────────
export const bannersApi = {
  getActive: () =>
    api.get<{ success: boolean; banners: Banner[] }>("/banners/active").then((r) => r.data),
}

// ─── Shipping (Shiprocket) ─────────────────────────────
export interface CourierRate {
  courier_company_id: number
  courier_name: string
  rate: number
  etd: string
  estimated_delivery_days: number
}

export const shippingApi = {
  checkServiceability: (pincode: string, weight: number = 0.5) =>
    api.post<{ success: boolean; serviceable: boolean; message?: string }>("/shipping/serviceability", { pincode, weight }).then((r) => r.data),

  getRates: (params: { pickup_pincode?: string; delivery_pincode: string; weight: number; cod?: boolean }) =>
    api.post<{ success: boolean; rates: CourierRate[] }>("/shipping/rates", params).then((r) => r.data),
}
