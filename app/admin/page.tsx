import Link from "next/link"
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Package,
  IndianRupee,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "Total Revenue",
    value: "₹4,52,890",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "317",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "Customers",
    value: "2,456",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "SA-ORD-10248",
    customer: "Priya Sharma",
    date: "Today, 2:30 PM",
    status: "Processing",
    statusColor: "secondary" as const,
    total: 2999,
  },
  {
    id: "SA-ORD-10247",
    customer: "Rajesh Kumar",
    date: "Today, 1:15 PM",
    status: "Shipped",
    statusColor: "default" as const,
    total: 5497,
  },
  {
    id: "SA-ORD-10246",
    customer: "Anita Patel",
    date: "Today, 11:45 AM",
    status: "Delivered",
    statusColor: "default" as const,
    total: 1299,
  },
  {
    id: "SA-ORD-10245",
    customer: "Vikram Singh",
    date: "Yesterday, 6:30 PM",
    status: "Processing",
    statusColor: "secondary" as const,
    total: 8999,
  },
  {
    id: "SA-ORD-10244",
    customer: "Meera Reddy",
    date: "Yesterday, 4:20 PM",
    status: "Delivered",
    statusColor: "default" as const,
    total: 1798,
  },
]

const topProducts = [
  {
    name: "Brass Ganesha Idol - Energised",
    sales: 156,
    revenue: 467844,
    trend: "up",
  },
  {
    name: "5 Mukhi Rudraksha Mala",
    sales: 124,
    revenue: 185876,
    trend: "up",
  },
  {
    name: "Complete Puja Thali Set",
    sales: 98,
    revenue: 127302,
    trend: "down",
  },
  {
    name: "Pure Silver Lakshmi Idol",
    sales: 45,
    revenue: 404955,
    trend: "up",
  },
  {
    name: "Bhagavad Gita - Sanskrit & Hindi",
    sales: 312,
    revenue: 155688,
    trend: "up",
  },
]

const pendingActions = [
  { label: "Orders to process", count: 12, href: "/admin/orders?status=processing" },
  { label: "Low stock alerts", count: 5, href: "/admin/products?filter=low-stock" },
  { label: "Return requests", count: 3, href: "/admin/returns" },
  { label: "Customer queries", count: 8, href: "/admin/support" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>Add New Product</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pendingActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="text-sm text-muted-foreground">{action.label}</span>
                <Badge variant="destructive">{action.count}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer} • {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.statusColor}>{order.status}</Badge>
                    <span className="font-medium text-foreground">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                >
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-xs ${
                      product.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      <TrendingUp className="h-3 w-3" />
                      {product.trend === "up" ? "Trending" : "Declining"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
