import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Puja Items",
    description: "Sacred essentials for daily worship",
    image: "/images/category-puja.jpg",
    href: "/category/puja-items",
    productCount: 120,
  },
  {
    name: "Idols & Murtis",
    description: "Divine forms for your altar",
    image: "/images/category-idols.jpg",
    href: "/category/idols",
    productCount: 85,
  },
  {
    name: "Gemstones & Malas",
    description: "Spiritual adornments for meditation",
    image: "/images/category-gemstones.jpg",
    href: "/category/gemstones",
    productCount: 64,
  },
  {
    name: "Books & Scriptures",
    description: "Sacred wisdom and teachings",
    image: "/images/category-books.jpg",
    href: "/category/books",
    productCount: 48,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection of authentic spiritual products for your sacred practices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-muted"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs text-background/70 uppercase tracking-wider">
                  {category.productCount} Products
                </span>
                <h3 className="text-xl font-serif font-semibold text-background mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-background/80">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
