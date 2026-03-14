import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 sm:px-5 py-4 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-1.5 sm:mb-4">
              <span className="text-base sm:text-2xl font-serif font-bold text-primary">Shri Aaum</span>
            </Link>
            <p className="text-muted-foreground text-[11px] sm:text-sm leading-relaxed mb-2 sm:mb-6">
              Your trusted destination for authentic spiritual products. Divine blessings at your doorstep.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] sm:text-base font-serif font-semibold text-foreground mb-1.5 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <Link href="/category/puja-items" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Puja Items
                </Link>
              </li>
              <li>
                <Link href="/category/idols-murtis" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Idols & Murtis
                </Link>
              </li>
              <li>
                <Link href="/category/gemstones-malas" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Gemstones & Malas
                </Link>
              </li>
              <li>
                <Link href="/category/books-scriptures" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Books & Scriptures
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs sm:text-base font-serif font-semibold text-foreground mb-2 sm:mb-4">Customer Service</h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <Link href="/track-order" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[11px] sm:text-sm text-muted-foreground hover:text-primary transition-colors underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-4 sm:mt-10 pt-4 sm:pt-8">
          <p className="text-[10px] sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2026 Shri Aaum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
