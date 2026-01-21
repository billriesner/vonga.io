import { Section } from "@/components/Section";
import { Truck, Package, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ReturnForm } from "@/components/ReturnForm";
import { FAQContactForm } from "@/components/FAQContactForm";

export default function ShippingReturnsPage() {
  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative min-h-[400px] flex items-center justify-center text-center"
        style={{
          backgroundImage: 'url(/images/heroes/hero-placeholder.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative z-10 w-full px-lg max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-lg" style={{ color: '#303E55', textShadow: '0 2px 8px rgba(255,255,255,0.9)' }}>
              Shipping & Returns
            </h1>
            <p className="text-xl md:text-2xl font-bold text-black" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
              Everything you need to know
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-black leading-relaxed">
            At Vonga, we want every part of your experience, from ordering to delivery to returns, to be simple and transparent.
          </p>
        </div>
      </Section>

      {/* Divider */}
      <div className="py-4xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="h-0.5 bg-accent/30" />
        </div>
      </div>

      {/* Shipping Policy Section */}
      <Section id="shipping" className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Truck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Shipping Policy
          </h2>

          {/* Retail Orders */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Retail Orders
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Processing Time:</strong> Orders are typically processed within 2–3 business days.</li>
              <li><strong>Standard Shipping (U.S.):</strong> 3–7 business days once shipped.</li>
              <li><strong>Expedited Shipping (U.S.):</strong> 2–3 business days (available at checkout).</li>
              <li><strong>International Shipping:</strong> 7–14 business days, depending on location.</li>
              <li><strong>Tracking:</strong> A tracking number will be emailed once your order ships.</li>
            </ul>
          </div>

          {/* Shipping Costs */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Shipping Costs
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li>Shipping rates are calculated at checkout and vary by destination.</li>
              <li>Free shipping promotions (when offered) will be clearly noted at checkout.</li>
            </ul>
          </div>

          {/* Club Vonga Orders */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Club Vonga Orders
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Lead Time:</strong> Custom production requires 4–6 weeks from order confirmation to delivery.</li>
              <li><strong>Minimum Order:</strong> 100 units.</li>
              <li><strong>Shipping Method:</strong> Bulk orders ship via ground freight or carrier service.</li>
              <li><strong>Updates:</strong> Club coordinators receive tracking and delivery updates once shipments leave our facility.</li>
            </ul>
          </div>

          {/* Enterprise Orders */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Enterprise Orders
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Timeline:</strong> Enterprise implementations are broader activations, typically 6 months from kickoff to launch.</li>
              <li><strong>Logistics:</strong> Apparel and activation materials are shipped according to your event or rollout schedule.</li>
              <li><strong>Custom Coordination:</strong> Our team works directly with your logistics or events staff to ensure smooth delivery.</li>
            </ul>
          </div>

          {/* International Orders */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              International Orders
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li>Available for both Retail and Club orders.</li>
              <li>Customers are responsible for duties, taxes, and customs fees charged by their country.</li>
              <li>Transit times may vary based on carriers and customs clearance.</li>
            </ul>
          </div>

          {/* Delays & Issues */}
          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Delays & Issues
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Missing or Delayed Shipments:</strong> If your order hasn't arrived on time, please reach out to us through our intake form.</li>
              <li><strong>Damaged Packages:</strong> If your package arrives damaged, notify us within 7 days and we'll replace or refund at no cost to you.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="py-4xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="h-0.5 bg-accent/30" />
        </div>
      </div>

      {/* Returns & Exchanges Section */}
      <Section id="returns" className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <RefreshCw className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Returns & Exchanges Policy
          </h2>

          {/* Eligibility */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Eligibility
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Return Window:</strong> Items may be returned or exchanged within 30 days of delivery.</li>
              <li><strong>Condition:</strong> Items must be unused, unwashed, and unworn (except for trying on) with original tags and packaging.</li>
              <li><strong>Exclusions:</strong> Final sale items, custom Club Vonga/Enterprise orders, and gift cards are not eligible.</li>
            </ul>
          </div>

          {/* How to Start a Return */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              How to Start a Return
            </h3>
            <p className="text-lg text-black leading-relaxed mb-xl">
              Fill out the form below and we'll email you a prepaid return label.
            </p>
            <Card className="border-2 border-muted" style={{ backgroundColor: '#F7F7F7' }}>
              <CardContent className="p-3xl">
                <ReturnForm />
              </CardContent>
            </Card>
          </div>

          {/* Refunds */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Refunds
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li><strong>Processing:</strong> Refunds are issued within 5–7 business days after we receive and inspect your return.</li>
              <li><strong>Method:</strong> Refunds go to the original payment method.</li>
              <li><strong>Shipping Costs:</strong> Original shipping charges are non-refundable. Return shipping is free if you use our prepaid label.</li>
            </ul>
          </div>

          {/* Exchanges */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Exchanges
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li>Exchanges are processed as a return + new order.</li>
              <li>Once your return is confirmed, you'll receive store credit or a refund to place a new order.</li>
            </ul>
          </div>

          {/* Damaged or Defective Items */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Damaged or Defective Items
            </h3>
            <p className="text-lg text-black leading-relaxed">
              If your item arrives damaged or defective, contact us within 7 days. We'll replace or refund at no cost.
            </p>
          </div>

          {/* International Returns */}
          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              International Returns
            </h3>
            <ul className="space-y-md text-lg text-black leading-relaxed">
              <li>International customers may return items within 30 days.</li>
              <li>Customers are responsible for return shipping costs unless the item is defective or incorrect.</li>
            </ul>
          </div>

          {/* Club Vonga & Enterprise */}
          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Club Vonga & Enterprise
            </h3>
            <p className="text-lg text-black leading-relaxed">
              Because these products are custom-made for your organization, Club Vonga and Enterprise orders are not returnable. Please review and approve all orders carefully before production.
            </p>
          </div>
        </div>
      </Section>

      {/* Need Help Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '32px' }}>
            Need Help?
          </h2>
          <p className="text-lg text-black leading-relaxed text-center" style={{ marginBottom: '64px' }}>
            Still have questions about shipping or returns? Send us a message and we'll make sure you're taken care of.
          </p>
          <Card className="border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
            <CardContent className="p-3xl">
              <FAQContactForm />
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
