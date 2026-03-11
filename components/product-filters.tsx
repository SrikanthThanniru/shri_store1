"use client"

import { useState } from "react"
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

const categories = [
  { id: "puja-items", label: "Puja Items", count: 120 },
  { id: "idols", label: "Idols & Murtis", count: 85 },
  { id: "gemstones", label: "Gemstones & Malas", count: 64 },
  { id: "books", label: "Books & Scriptures", count: 48 },
]

const features = [
  { id: "energised", label: "Energised Products" },
  { id: "in-stock", label: "In Stock Only" },
  { id: "on-sale", label: "On Sale" },
]

function FilterContent() {
  const [priceRange, setPriceRange] = useState([0, 15000])

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground">
          Categories
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox id={category.id} />
              <Label htmlFor={category.id} className="flex-1 text-sm cursor-pointer">
                {category.label}
              </Label>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground">
          Price Range
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={15000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{priceRange[0].toLocaleString('en-IN')}
            </span>
            <span className="text-muted-foreground">
              ₹{priceRange[1].toLocaleString('en-IN')}
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium text-foreground">
          Features
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              <Checkbox id={feature.id} />
              <Label htmlFor={feature.id} className="text-sm cursor-pointer">
                {feature.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full gap-2">
        <X className="h-4 w-4" />
        Clear All Filters
      </Button>
    </div>
  )
}

export function ProductFilters() {
  return (
    <>
      {/* Mobile Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <h2 className="font-medium text-foreground mb-4">Filters</h2>
        <FilterContent />
      </div>
    </>
  )
}
