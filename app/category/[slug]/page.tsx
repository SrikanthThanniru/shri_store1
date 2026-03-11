import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categoryData: Record<string, { name: string; description: string }> = {
  "puja-items": {
    name: "Puja Items",
    description: "Sacred essentials for daily worship and rituals",
  },
  "idols": {
    name: "Idols & Murtis",
    description: "Divine forms crafted with devotion for your altar",
  },
  "gemstones": {
    name: "Gemstones & Malas",
    description: "Spiritual adornments for meditation and healing",
  },
  "books": {
    name: "Books & Scriptures",
    description: "Sacred wisdom and teachings for spiritual growth",
  },
}

const products = [
  {
    id: "1",
    name: "Brass Ganesha Idol - Energised",
    price: 2999,
    originalPrice: 3999,
    image: "/images/product-1.jpg",
    category: "Idols & Murtis",
    rating: 4.8,
    reviewCount: 124,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "2",
    name: "5 Mukhi Rudraksha Mala - 108 Beads",
    price: 1499,
    originalPrice: 1999,
    image: "/images/product-2.jpg",
    category: "Gemstones & Malas",
    rating: 4.9,
    reviewCount: 89,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Complete Puja Thali Set - Premium",
    price: 1299,
    image: "/images/product-3.jpg",
    category: "Puja Items",
    rating: 4.7,
    reviewCount: 156,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "4",
    name: "Bhagavad Gita - Sanskrit & Hindi",
    price: 499,
    originalPrice: 699,
    image: "/images/product-4.jpg",
    category: "Books & Scriptures",
    rating: 4.9,
    reviewCount: 312,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "5",
    name: "Pure Silver Lakshmi Idol",
    price: 8999,
    originalPrice: 10999,
    image: "/images/product-5.jpg",
    category: "Idols & Murtis",
    rating: 5.0,
    reviewCount: 45,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "6",
    name: "Natural Camphor - 100g Pack",
    price: 199,
    image: "/images/product-6.jpg",
    category: "Puja Items",
    rating: 4.6,
    reviewCount: 234,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "7",
    name: "Crystal Sphatik Mala",
    price: 899,
    originalPrice: 1299,
    image: "/images/product-7.jpg",
    category: "Gemstones & Malas",
    rating: 4.7,
    reviewCount: 78,
    isEnergised: false,
    inStock: false,
  },
  {
    id: "8",
    name: "Brass Diya Set - Pack of 5",
    price: 599,
    image: "/images/product-8.jpg",
    category: "Puja Items",
    rating: 4.5,
    reviewCount: 189,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "9",
    name: "Brass Shiva Lingam Set",
    price: 1799,
    image: "/images/product-1.jpg",
    category: "Idols & Murtis",
    rating: 4.8,
    reviewCount: 67,
    isEnergised: true,
    inStock: true,
  },
  {
    id: "10",
    name: "Sandalwood Agarbatti - Premium",
    price: 299,
    image: "/images/product-6.jpg",
    category: "Puja Items",
    rating: 4.4,
    reviewCount: 456,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "11",
    name: "Tiger Eye Mala - 108 Beads",
    price: 1199,
    image: "/images/product-7.jpg",
    category: "Gemstones & Malas",
    rating: 4.6,
    reviewCount: 34,
    isEnergised: false,
    inStock: true,
  },
  {
    id: "12",
    name: "Hanuman Chalisa - Illustrated",
    price: 249,
    image: "/images/product-4.jpg",
    category: "Books & Scriptures",
    rating: 4.8,
    reviewCount: 178,
    isEnergised: false,
    inStock: true,
  },
]

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categoryData[slug] || {
    name: "All Products",
    description: "Browse our complete collection of spiritual products",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-secondary py-8 lg:py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: category.name },
              ]}
            />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-4 mb-2">
              {category.name}
            </h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <ProductFilters />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{products.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="rating">Best Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">
                  1
                </button>
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  2
                </button>
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  3
                </button>
                <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
