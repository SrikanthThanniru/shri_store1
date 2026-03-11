"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Eye, Sparkles } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const products = [
  {
    id: "SA-PROD-001",
    name: "Brass Ganesha Idol - Energised",
    category: "Idols & Murtis",
    price: 2999,
    originalPrice: 3999,
    stock: 45,
    status: "Active",
    isEnergised: true,
    image: "/images/product-1.jpg",
  },
  {
    id: "SA-PROD-002",
    name: "5 Mukhi Rudraksha Mala - 108 Beads",
    category: "Gemstones & Malas",
    price: 1499,
    originalPrice: 1999,
    stock: 78,
    status: "Active",
    isEnergised: false,
    image: "/images/product-2.jpg",
  },
  {
    id: "SA-PROD-003",
    name: "Complete Puja Thali Set - Premium",
    category: "Puja Items",
    price: 1299,
    stock: 32,
    status: "Active",
    isEnergised: false,
    image: "/images/product-3.jpg",
  },
  {
    id: "SA-PROD-004",
    name: "Bhagavad Gita - Sanskrit & Hindi",
    category: "Books & Scriptures",
    price: 499,
    originalPrice: 699,
    stock: 156,
    status: "Active",
    isEnergised: false,
    image: "/images/product-4.jpg",
  },
  {
    id: "SA-PROD-005",
    name: "Pure Silver Lakshmi Idol",
    category: "Idols & Murtis",
    price: 8999,
    originalPrice: 10999,
    stock: 12,
    status: "Active",
    isEnergised: true,
    image: "/images/product-5.jpg",
  },
  {
    id: "SA-PROD-006",
    name: "Natural Camphor - 100g Pack",
    category: "Puja Items",
    price: 199,
    stock: 234,
    status: "Active",
    isEnergised: false,
    image: "/images/product-6.jpg",
  },
  {
    id: "SA-PROD-007",
    name: "Crystal Sphatik Mala",
    category: "Gemstones & Malas",
    price: 899,
    originalPrice: 1299,
    stock: 0,
    status: "Out of Stock",
    isEnergised: false,
    image: "/images/product-7.jpg",
  },
  {
    id: "SA-PROD-008",
    name: "Brass Diya Set - Pack of 5",
    category: "Puja Items",
    price: 599,
    stock: 89,
    status: "Active",
    isEnergised: false,
    image: "/images/product-8.jpg",
  },
]

export default function AdminProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new product to your catalog.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter product description" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (INR)</Label>
                  <Input id="originalPrice" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="puja-items">Puja Items</SelectItem>
                      <SelectItem value="idols">Idols & Murtis</SelectItem>
                      <SelectItem value="gemstones">Gemstones & Malas</SelectItem>
                      <SelectItem value="books">Books & Scriptures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="energised" />
                <Label htmlFor="energised" className="cursor-pointer">
                  This is an energised product
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Drag and drop images here or click to upload</p>
                  <Button variant="outline" className="mt-4">Upload Images</Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="puja-items">Puja Items</SelectItem>
            <SelectItem value="idols">Idols & Murtis</SelectItem>
            <SelectItem value="gemstones">Gemstones & Malas</SelectItem>
            <SelectItem value="books">Books & Scriptures</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedProducts.length} selected
          </span>
          <Button variant="outline" size="sm">Bulk Edit</Button>
          <Button variant="destructive" size="sm">Delete Selected</Button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleSelect(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground line-clamp-1">
                          {product.name}
                        </span>
                        {product.isEnergised && (
                          <Sparkles className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{product.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={product.stock === 0 ? "text-destructive" : product.stock < 20 ? "text-amber-600" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                    {product.status}
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
                        <Eye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
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
          Showing 1-8 of 317 products
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}
