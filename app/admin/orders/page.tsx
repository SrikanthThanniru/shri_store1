"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Eye, Truck, XCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const orders = [
  {
    id: "SA-ORD-10248",
    customer: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 98765 43210",
    date: "Mar 11, 2026",
    time: "2:30 PM",
    items: 3,
    total: 5497,
    status: "Processing",
    payment: "Paid",
    paymentMethod: "UPI",
  },
  {
    id: "SA-ORD-10247",
    customer: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43211",
    date: "Mar 11, 2026",
    time: "1:15 PM",
    items: 1,
    total: 2999,
    status: "Shipped",
    payment: "Paid",
    paymentMethod: "Card",
  },
  {
    id: "SA-ORD-10246",
    customer: "Anita Patel",
    email: "anita@email.com",
    phone: "+91 98765 43212",
    date: "Mar 11, 2026",
    time: "11:45 AM",
    items: 2,
    total: 1299,
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "UPI",
  },
  {
    id: "SA-ORD-10245",
    customer: "Vikram Singh",
    email: "vikram@email.com",
    phone: "+91 98765 43213",
    date: "Mar 10, 2026",
    time: "6:30 PM",
    items: 1,
    total: 8999,
    status: "Processing",
    payment: "COD",
    paymentMethod: "COD",
  },
  {
    id: "SA-ORD-10244",
    customer: "Meera Reddy",
    email: "meera@email.com",
    phone: "+91 98765 43214",
    date: "Mar 10, 2026",
    time: "4:20 PM",
    items: 4,
    total: 1798,
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Net Banking",
  },
  {
    id: "SA-ORD-10243",
    customer: "Suresh Iyer",
    email: "suresh@email.com",
    phone: "+91 98765 43215",
    date: "Mar 10, 2026",
    time: "2:10 PM",
    items: 2,
    total: 3498,
    status: "Cancelled",
    payment: "Refunded",
    paymentMethod: "Card",
  },
  {
    id: "SA-ORD-10242",
    customer: "Kavita Nair",
    email: "kavita@email.com",
    phone: "+91 98765 43216",
    date: "Mar 10, 2026",
    time: "10:30 AM",
    items: 1,
    total: 499,
    status: "Shipped",
    payment: "Paid",
    paymentMethod: "UPI",
  },
  {
    id: "SA-ORD-10241",
    customer: "Amit Verma",
    email: "amit@email.com",
    phone: "+91 98765 43217",
    date: "Mar 9, 2026",
    time: "8:45 PM",
    items: 3,
    total: 4297,
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Card",
  },
]

function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Processing":
      return "secondary"
    case "Shipped":
      return "default"
    case "Delivered":
      return "default"
    case "Cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

export default function AdminOrdersPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(o => o.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">1,234</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Processing</p>
          <p className="text-2xl font-bold text-amber-600">12</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Shipped</p>
          <p className="text-2xl font-bold text-blue-600">28</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Delivered Today</p>
          <p className="text-2xl font-bold text-green-600">15</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order ID, customer name..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cod">COD</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedOrders.length} selected
          </span>
          <Button variant="outline" size="sm">Mark as Shipped</Button>
          <Button variant="outline" size="sm">Print Labels</Button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.length === orders.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => toggleSelect(order.id)}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{order.id}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-foreground">{order.date}</p>
                    <p className="text-muted-foreground">{order.time}</p>
                  </div>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell className="font-medium">
                  ₹{order.total.toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  <div>
                    <Badge variant={order.payment === "Paid" ? "default" : order.payment === "COD" ? "secondary" : "outline"}>
                      {order.payment}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{order.paymentMethod}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {order.status === "Processing" && (
                        <DropdownMenuItem className="gap-2">
                          <Truck className="h-4 w-4" /> Mark as Shipped
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <XCircle className="h-4 w-4" /> Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-8 of 1,234 orders
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}
