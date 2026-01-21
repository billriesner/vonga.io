import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Calendar, Palette, Cog, Package } from "lucide-react";
import Link from "next/link";

export default function ClubSuccessPage() {
  return (
    <div>
      <Section 
        className="py-5xl"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Success Icon & Heading */}
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
              <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{ backgroundColor: '#33BECC' }}>
                <CheckCircle2 className="w-16 h-16 text-navy" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-navy" style={{ marginBottom: '24px' }}>
              Payment Successful!
            </h1>
            
            <p className="text-xl text-text/70" style={{ marginBottom: '16px' }}>
              Thank you for your 10% deposit
            </p>
            <p className="text-base font-semibold" style={{ color: '#33BECC' }}>
              Your Club Vonga order is confirmed
            </p>
          </div>

          {/* What Happens Next */}
          <Card className="border-2 border-muted" style={{ backgroundColor: '#F7F7F7', marginBottom: '48px' }}>
            <CardHeader style={{ paddingBottom: '32px' }}>
              <CardTitle className="text-navy text-3xl text-center">What Happens Next?</CardTitle>
              <CardDescription className="text-base text-center" style={{ marginTop: '16px' }}>
                Here's your journey from order to delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-6 bg-white rounded-lg p-6 border-2 border-muted">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#33BECC' }}>
                      <Calendar className="w-8 h-8 text-navy" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy" style={{ marginBottom: '12px' }}>
                      Confirmation Email (Within 48 Hours)
                    </h3>
                    <p className="text-base text-text/70">
                      You'll receive a detailed confirmation email with your order summary and timeline. Our team will review your submission and reach out with any questions.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-6 bg-white rounded-lg p-6 border-2 border-muted">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#33BECC' }}>
                      <Palette className="w-8 h-8 text-navy" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy" style={{ marginBottom: '12px' }}>
                      Design Approval (40% Payment Due)
                    </h3>
                    <p className="text-base text-text/70" style={{ marginBottom: '12px' }}>
                      Our design team will create mockups of your custom apparel and branding. Once you approve the design, the second payment of 40% of your order total will be due.
                    </p>
                    <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>
                      Design approval required before production begins
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-6 bg-white rounded-lg p-6 border-2 border-muted">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#33BECC' }}>
                      <Cog className="w-8 h-8 text-navy" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy" style={{ marginBottom: '12px' }}>
                      Production Begins
                    </h3>
                    <p className="text-base text-text/70">
                      After design approval and payment, we'll begin producing your custom NFC-enabled apparel with your branding. You'll receive regular updates on production status.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-6 bg-white rounded-lg p-6 border-2 border-muted">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#33BECC' }}>
                      <Package className="w-8 h-8 text-navy" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy" style={{ marginBottom: '12px' }}>
                      Final Payment & Shipment (50% Due)
                    </h3>
                    <p className="text-base text-text/70" style={{ marginBottom: '12px' }}>
                      Before shipping your order, the final payment of 50% of your order total will be due. Once received, we'll ship your custom apparel directly to you.
                    </p>
                    <p className="text-sm font-semibold" style={{ color: '#33BECC' }}>
                      Tracking information provided upon shipment
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <div className="bg-navy rounded-lg p-8 text-center" style={{ marginBottom: '48px' }}>
            <h3 className="text-2xl font-bold text-white" style={{ marginBottom: '24px' }}>
              Payment Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold" style={{ color: '#33BECC', marginBottom: '12px' }}>✓ 10%</div>
                <p className="text-white font-semibold" style={{ marginBottom: '8px' }}>Paid Today</p>
                <p className="text-sm text-white/70">Order confirmation</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold" style={{ color: '#33BECC', marginBottom: '12px' }}>40%</div>
                <p className="text-white font-semibold" style={{ marginBottom: '8px' }}>Due Next</p>
                <p className="text-sm text-white/70">Design approval</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <div className="text-4xl font-bold" style={{ color: '#33BECC', marginBottom: '12px' }}>50%</div>
                <p className="text-white font-semibold" style={{ marginBottom: '8px' }}>Final Payment</p>
                <p className="text-sm text-white/70">Before shipment</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <p className="text-lg text-text/70" style={{ marginBottom: '24px' }}>
              Questions about your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="text-navy font-semibold shadow-lg px-8 py-6 text-lg"
                style={{ backgroundColor: '#33BECC' }}
                asChild
              >
                <Link href="/intake">Contact Support</Link>
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold shadow-md px-8 py-6 text-lg"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

