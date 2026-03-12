import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RotateCcw, Package, Truck, CreditCard, Shield, Clock, MessageCircle } from "lucide-react"

const policyByType = [
  { type: "Energised Idols / Murtis", returnAllowed: false, exchangeAllowed: false, refund: "No — all sales final" },
  { type: "Non-energised Idols", returnAllowed: true, exchangeAllowed: true, refund: "After item reaches seller" },
  { type: "Puja / Ritual Items", returnAllowed: true, exchangeAllowed: true, refund: "After item reaches seller" },
  { type: "Gemstones & Malas", returnAllowed: true, exchangeAllowed: true, refund: "After item reaches seller" },
  { type: "Books & Scriptures", returnAllowed: true, exchangeAllowed: true, refund: "After item reaches seller" },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-secondary">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Returns, Exchange & Refund Policy" },
            ]}
          />

          <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-foreground mt-3 sm:mt-4 mb-2">
            Returns, Exchange & Refund Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            We want you to be completely satisfied with your purchase. Please review our policy below.
          </p>

          {/* Policy by Product Type */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Policy by Product Type
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Type</TableHead>
                    <TableHead className="text-center">Return?</TableHead>
                    <TableHead className="text-center">Exchange?</TableHead>
                    <TableHead>Refund</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policyByType.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell className="font-medium">{row.type}</TableCell>
                      <TableCell className="text-center">
                        {row.returnAllowed ? (
                          <Badge variant="secondary">14 days</Badge>
                        ) : (
                          <Badge variant="destructive">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.exchangeAllowed ? (
                          <Badge variant="secondary">14 days</Badge>
                        ) : (
                          <Badge variant="destructive">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.refund}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Return Flow */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              How the Return Process Works
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Raise a Return/Exchange Request</p>
                  <p className="text-sm text-muted-foreground">
                    Go to <Link href="/account/orders" className="text-primary hover:underline">My Orders</Link> and
                    click &quot;Return / Exchange&quot; on the eligible order, or contact our support team.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">14-Day Window</p>
                  <p className="text-sm text-muted-foreground">
                    The return window is 14 days from the confirmed delivery date. Products must be unused and in original packaging.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Return Pickup via Shiprocket</p>
                  <p className="text-sm text-muted-foreground">
                    Reverse pickup is scheduled via Shiprocket. You will receive a WhatsApp confirmation with pickup details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Verification & Refund</p>
                  <p className="text-sm text-muted-foreground">
                    Refund is initiated only after the item is received and verified at our warehouse.
                    Refund is credited to your original payment source within 5–7 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">COD Orders</p>
                  <p className="text-sm text-muted-foreground">
                    For Cash on Delivery orders, refund is processed via bank transfer (NEFT). Bank details will be collected during the return process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification during Returns */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Notifications During Returns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-foreground">Return Requested</p>
                <p className="text-xs text-muted-foreground">WhatsApp: Return pickup scheduled confirmation</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm font-medium text-foreground">Refund Initiated</p>
                <p className="text-xs text-muted-foreground">SMS: Refund amount + expected credit timeline</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>Why are energised products non-returnable?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Energised idols and murtis undergo sacred Vedic rituals performed by learned priests.
                    Once energised, these products carry divine energy and are considered sacred.
                    As per spiritual traditions, all sales of energised items are final.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>How long does the refund take?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Refund is initiated after the returned item is received and verified at our warehouse.
                    The refund is credited to your original payment source within 5–7 business days.
                    You will receive an SMS notification when the refund is initiated.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How will I be refunded for a COD order?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    For COD orders, refund is processed via bank transfer (NEFT). During the return process,
                    we will collect your bank account details (account number, IFSC code) for processing the refund.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Can I exchange for a different product?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes, for eligible products you can request an exchange within 14 days of delivery.
                    The original item must be unused and in its original packaging.
                    If the replacement item has a price difference, the balance will be adjusted accordingly.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Need to raise a return or exchange request?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild>
                <Link href="/account/orders">Go to My Orders</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
