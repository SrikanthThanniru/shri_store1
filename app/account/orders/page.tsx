import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, Eye, RotateCcw } from "lucide-react"

const orders = [
  {
    id: "SA-ORD-10234",
    date: "March 5, 2026",
    status: "Delivered",
    statusColor: "default" as const,
    total: 5497,
    items: [
      {
        id: "1",
        name: "Brass Ganesha Idol - Energised",
        price: 2999,
        quantity: 1,
        image: "/images/product-1.jpg",
      },
      {
        id: "2",
        name: "5 Mukhi Rudraksha Mala",
        price: 1499,
        quantity: 1,
        image: "/images/product-2.jpg",
      },
      {
        id: "3",
        name: "Complete Puja Thali Set",
        price: 999,
        quantity: 1,
        image: "/images/product-3.jpg",
      },
    ],
    deliveredOn: "March 8, 2026",
    trackingId: "SR98765432101",
  },
  {
    id: "SA-ORD-10198",
    date: "February 18, 2026",
    status: "Shipped",
    statusColor: "secondary" as const,
    total: 2999,
    items: [
      {
        id: "5",
        name: "Pure Silver Lakshmi Idol",
        price: 2999,
        quantity: 1,
        image: "/images/product-5.jpg",
      },
    ],
    expectedDelivery: "February 25, 2026",
    trackingId: "SR98765432102",
  },
  {
    id: "SA-ORD-10156",
    date: "January 28, 2026",
    status: "Delivered",
    statusColor: "default" as const,
    total: 1798,
    items: [
      {
        id: "6",
        name: "Natural Camphor - 100g Pack",
        price: 199,
        quantity: 2,
        image: "/images/product-6.jpg",
      },
      {
        id: "8",
        name: "Brass Diya Set - Pack of 5",
        price: 599,
        quantity: 1,
        image: "/images/product-8.jpg",
      },
      {
        id: "4",
        name: "Bhagavad Gita - Sanskrit & Hindi",
        price: 499,
        quantity: 1,
        image: "/images/product-4.jpg",
      },
    ],
    deliveredOn: "February 2, 2026",
    trackingId: "SR98765432103",
  },
]

function OrderStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "Delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "Shipped":
      return <Truck className="h-5 w-5 text-blue-600" />
    case "Processing":
      return <Clock className="h-5 w-5 text-amber-600" />
    default:
      return <Package className="h-5 w-5 text-muted-foreground" />
  }
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "My Account", href: "/account" },
              { label: "My Orders" },
            ]}
          />

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-4 mb-8">
            My Orders
          </h1>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-lg border border-border overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-muted p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-medium text-foreground">{order.id}</p>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">Placed on</p>
                      <p className="font-medium text-foreground">{order.date}</p>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-border" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-foreground">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusIcon status={order.status} />
                    <Badge variant={order.statusColor}>{order.status}</Badge>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <Link href={`/product/${item.id}`} className="shrink-0">
                          <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.id}`}>
                            <h4 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium text-foreground mt-1">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-6 pt-6 border-t border-border">
                    {order.status === "Delivered" ? (
                      <p className="text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        Delivered on {order.deliveredOn}
                      </p>
                    ) : order.status === "Shipped" ? (
                      <p className="text-sm text-blue-600">
                        <Truck className="h-4 w-4 inline mr-1" />
                        Expected delivery by {order.expectedDelivery}
                      </p>
                    ) : null}
                    
                    {order.trackingId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Tracking ID: {order.trackingId}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    {order.status === "Shipped" && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Truck className="h-4 w-4" />
                        Track Order
                      </Button>
                    )}
                    {order.status === "Delivered" && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Return / Exchange
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
