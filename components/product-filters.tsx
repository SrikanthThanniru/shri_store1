"use client"

import { useState, useEffect } from "react"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { productsApi } from "@/lib/api"
import { dummyCategoryCounts } from "@/lib/dummy-data"

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  energised: boolean
  onSale: boolean
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 15000],
  inStock: false,
  energised: false,
  onSale: false,
}

interface CategoryOption {
  id: string
  label: string
  count: number
}

const categoryMap: Record<string, string> = {
  "puja-items": "Puja Items",
  "idols-murtis": "Idols & Murtis",
  "gemstones-malas": "Gemstones & Malas",
  "books-scriptures": "Books & Scriptures",
}

interface ProductFiltersProps {
  filters?: FilterState
  onChange?: (filters: FilterState) => void
  currentCategory?: string
}

function FilterContent({
  filters,
  onChange,
  categoryOptions,
  currentCategory,
}: {
  filters: FilterState
  onChange: (filters: FilterState) => void
  categoryOptions: CategoryOption[]
  currentCategory?: string
}) {
  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    onChange({ ...filters, categories: next })
  }

  const clearAll = () => onChange({ ...defaultFilters })

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 15000 ||
    filters.inStock ||
    filters.energised ||
    filters.onSale

  return (
    <div className="space-y-5">
      {!currentCategory && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground text-sm">
            Categories
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2.5">
            {categoryOptions.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={`cat-${category.id}`} className="flex-1 text-xs sm:text-sm cursor-pointer">
                  {category.label}
                </Label>
                <span className="text-[10px] sm:text-xs text-muted-foreground">({category.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground text-sm">
          Price Range
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(v) => onChange({ ...filters, priceRange: v as [number, number] })}
            max={15000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              ₹{filters.priceRange[0].toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground">
              ₹{filters.priceRange[1].toLocaleString("en-IN")}
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground text-sm">
          Features
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-instock"
              checked={filters.inStock}
              onCheckedChange={(v) => onChange({ ...filters, inStock: !!v })}
            />
            <Label htmlFor="filter-instock" className="text-xs sm:text-sm cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-energised"
              checked={filters.energised}
              onCheckedChange={(v) => onChange({ ...filters, energised: !!v })}
            />
            <Label htmlFor="filter-energised" className="text-xs sm:text-sm cursor-pointer">
              Energised Products
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-onsale"
              checked={filters.onSale}
              onCheckedChange={(v) => onChange({ ...filters, onSale: !!v })}
            />
            <Label htmlFor="filter-onsale" className="text-xs sm:text-sm cursor-pointer">
              On Sale
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full gap-2 text-xs sm:text-sm h-8 sm:h-9" onClick={clearAll}>
          <X className="h-3.5 w-3.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}

export function ProductFilters({ filters: externalFilters, onChange, currentCategory }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(defaultFilters)
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(
    Object.entries(categoryMap).map(([id, label]) => ({
      id,
      label,
      count: dummyCategoryCounts[id] || 0,
    }))
  )
  const [open, setOpen] = useState(false)

  const filters = externalFilters || localFilters
  const handleChange = (f: FilterState) => {
    if (onChange) onChange(f)
    else setLocalFilters(f)
  }

  useEffect(() => {
    const slugs = Object.keys(categoryMap)
    Promise.all(
      slugs.map((slug) =>
        productsApi.list({ category: slug, limit: 1 })
          .then((res) => ({ slug, total: res.total || 0 }))
          .catch(() => ({ slug, total: dummyCategoryCounts[slug] || 0 }))
      )
    ).then((counts) => {
      setCategoryOptions(
        slugs.map((slug) => ({
          id: slug,
          label: categoryMap[slug],
          count: counts.find((c) => c.slug === slug)?.total || dummyCategoryCounts[slug] || 0,
        }))
      )
    })
  }, [])

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full gap-2 mb-4 text-xs sm:text-sm h-9">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(filters.categories.length > 0 || filters.inStock || filters.energised || filters.onSale) && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {filters.categories.length + (filters.inStock ? 1 : 0) + (filters.energised ? 1 : 0) + (filters.onSale ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 flex flex-col p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
            <SheetTitle className="text-base">Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <FilterContent
              filters={filters}
              onChange={handleChange}
              categoryOptions={categoryOptions}
              currentCategory={currentCategory}
            />
          </div>
          <div className="px-4 py-3 border-t border-border">
            <Button className="w-full text-xs sm:text-sm h-9" onClick={() => setOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block">
        <h2 className="font-medium text-foreground mb-4 text-sm">Filters</h2>
        <FilterContent
          filters={filters}
          onChange={handleChange}
          categoryOptions={categoryOptions}
          currentCategory={currentCategory}
        />
      </div>
    </>
  )
}
