import { Section } from "@/components/Section";
import { FileText, Users, ShoppingCart, Shield, Scale, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TermsContactForm } from "@/components/TermsContactForm";

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-xl md:text-2xl font-bold text-black" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
              Agreement for using Vonga products and services
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            These Terms and Conditions govern your access to and use of Vonga's website, products, and services. By accessing our site, purchasing products, or engaging with our Services, you agree to these Terms. If you do not agree, you may not use our Services.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            <strong>Effective Date:</strong> October 2, 2025
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            <strong>Entity:</strong> Vonga, LLC, incorporated in Indiana, United States
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            <strong>Governing Law:</strong> State of Indiana, USA
          </p>
        </div>
      </Section>

      {/* Divider */}
      <div className="py-4xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="h-0.5 bg-accent/30" />
        </div>
      </div>

      {/* Eligibility Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Eligibility
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Retail Customers
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Our retail products are available for purchase by customers of all ages. However, if you are under the age of 18, you must have the permission and supervision of a parent or legal guardian to make purchases or use our Services. Vonga does not knowingly market products or services directly to children under 13 years of age without appropriate parental consent.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Club Vonga Customers
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              To use Club Vonga services, you must be at least 18 years old and have the legal authority to bind your organization to these Terms. You represent and warrant that you have obtained all necessary approvals from your organization to enter into agreements on its behalf and to configure the Club Vonga platform according to your organization's needs.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Enterprise Customers
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Enterprise services require you to be at least 18 years old and authorized to represent your organization. Enterprise deployments and activations are governed by separate written agreements between your organization and Vonga, which may supersede or supplement these Terms. In the event of any conflict between these Terms and your separate Enterprise agreement, the terms of the Enterprise agreement shall control.
            </p>
          </div>
        </div>
      </Section>

      {/* Products & Services Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <ShoppingCart className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Products & Services
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Retail (Shop Vonga)
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Our retail products are sold directly through our Shopify-powered online storefront. When you place an order through Shop Vonga, payment is due in full at the time of purchase. We accept major credit cards and other payment methods as displayed at checkout. All orders are processed securely through our payment service providers.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              All retail orders are subject to our <Link href="/shipping-returns" className="font-semibold hover:underline" style={{ color: '#33BECC' }}>Shipping & Returns Policy</Link>, which governs delivery timelines, shipping costs, return eligibility, and exchange procedures. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Club Vonga
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Club Vonga orders are custom production runs created specifically for your organization, with a minimum order quantity of 100 units. Due to the custom nature of these orders, we require a 50% deposit at the time of order confirmation, with the remaining 50% balance due prior to shipment. Payment is processed securely through Stripe.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Because Club Vonga products are custom-made to your specifications and branded for your organization, these orders are non-refundable except as expressly set forth in our <Link href="/shipping-returns" className="font-semibold hover:underline" style={{ color: '#33BECC' }}>Shipping & Returns Policy</Link>. This typically means that returns are only accepted for defective items or errors in production that are attributable to Vonga. Please review and approve all order details, artwork, and specifications carefully before confirming your order.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Enterprise
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Enterprise activations and deployments are comprehensive programs that are governed by separate written contracts negotiated between your organization and Vonga. These Enterprise agreements contain specific terms, pricing, deliverables, and service level commitments tailored to your organization's needs. The general Terms and Conditions on this page do not apply to Enterprise services except where explicitly incorporated by reference in your Enterprise agreement.
            </p>
          </div>
        </div>
      </Section>

      {/* Orders & Payments Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Orders & Payments
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Payment processing for Vonga products and services is handled securely through trusted third-party payment processors. For retail orders placed through Shop Vonga, payments are processed through Shopify Payments, which supports major credit cards, debit cards, and other payment methods. Club Vonga payments are processed through Stripe, a PCI-compliant payment processor that ensures your financial information is handled securely.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Enterprise invoicing and payments are managed through QuickBooks in accordance with the payment terms negotiated in your Enterprise agreement. This may include net payment terms, milestone-based payments, or other arrangements as specified in your contract.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            When placing an order or registering for services, you agree to provide accurate, current, and complete billing information, contact details, and shipping addresses. You are responsible for ensuring that this information remains up to date. Failure to provide accurate information may result in delayed shipments, payment processing issues, or inability to fulfill your order.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            All prices are listed in U.S. dollars unless otherwise specified. Prices are subject to change without notice, though any price changes will not affect orders that have already been confirmed and paid for. You are responsible for any applicable taxes, duties, or customs fees associated with your purchase.
          </p>
        </div>
      </Section>

      {/* Shipping & Returns Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Shield className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Shipping & Returns
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Our policies regarding shipping, delivery timelines, return eligibility, and exchange procedures are set forth in detail in our <Link href="/shipping-returns" className="font-semibold hover:underline" style={{ color: '#33BECC' }}>Shipping & Returns Policy</Link>. That policy is incorporated by reference into these Terms and Conditions and forms part of the binding agreement between you and Vonga.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            By placing an order, you acknowledge that you have read, understood, and agree to be bound by the Shipping & Returns Policy. This includes understanding the differences in return eligibility between retail products (generally returnable within 30 days) and custom Club Vonga or Enterprise products (generally non-returnable).
          </p>
        </div>
      </Section>

      {/* Use of NFC Technology Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Use of NFC Technology
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Vonga apparel incorporates embedded Near Field Communication (NFC) technology that allows you to unlock digital experiences, rewards, and access with a simple tap of your smartphone. This technology is designed to work seamlessly with NFC-enabled devices and is intended for normal consumer use as described in our product documentation and marketing materials.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            You agree that you will not attempt to tamper with, disable, remove, reverse-engineer, or otherwise misuse the NFC functionality embedded in Vonga products. This includes attempting to clone, modify, or replicate the NFC chips or the digital twin identities associated with Vonga garments. Such actions may violate intellectual property laws and could result in termination of your access to Vonga services.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            While our NFC technology is designed to be safe for use with modern smartphones, Vonga is not liable for any damage to your device that may result from improper use of NFC features, incompatibility with your specific device model, or use in a manner inconsistent with the manufacturer's guidelines for your device.
          </p>
        </div>
      </Section>

      {/* Intellectual Property Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Scale className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Intellectual Property
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            All content available through Vonga's Services, including but not limited to our website design, branding, logos, trademarks, product designs, software code, NFC integrations, digital twin technology, and proprietary processes, are the exclusive property of Vonga, LLC and are protected by United States and international intellectual property laws, including copyright, trademark, patent, and trade secret laws.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            You are granted a limited, non-exclusive, non-transferable license to use Vonga products for their intended personal or organizational use. This license does not grant you any rights to reproduce, copy, modify, distribute, publicly display, create derivative works from, or otherwise exploit our intellectual property without our prior written consent.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            The Vonga name, logo, and all related product names, design marks, and slogans are trademarks or registered trademarks of Vonga, LLC. You may not use these marks without our express written permission. Any unauthorized use of our intellectual property may result in legal action and termination of your access to our Services.
          </p>
        </div>
      </Section>

      {/* User Conduct Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            User Conduct
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            When using Vonga products or accessing our Services, you agree to conduct yourself in a lawful and respectful manner. Specifically, you agree that you will not:
          </p>
          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Engage in fraudulent activity
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              This includes fraudulent scanning of NFC tags, creating fake accounts to claim rewards multiple times, tampering with NFC technology to manipulate eligibility or rewards, or any other deceptive practices designed to exploit our systems or obtain benefits to which you are not entitled.
            </p>
          </div>
          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Resell without authorization
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga products are intended for personal or organizational use. If you wish to become an authorized reseller or distribute Vonga products commercially, you must obtain written authorization from Vonga. Unauthorized resale may result in termination of your access to digital services associated with the products.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Use Services for unlawful purposes
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              You may not use our products or Services in any way that violates applicable local, state, national, or international laws or regulations, or in any manner that violates these Terms. This includes using our Services to harass, abuse, or harm others, or to transmit any unlawful, threatening, or otherwise objectionable content.
            </p>
          </div>
        </div>
      </Section>

      {/* Disclaimers Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <AlertCircle className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Disclaimers
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Vonga products and Services are provided on an "as is" and "as available" basis, except as otherwise required by applicable law and subject to the warranties set forth in our <Link href="/shipping-returns" className="font-semibold hover:underline" style={{ color: '#33BECC' }}>Shipping & Returns Policy</Link>. To the fullest extent permitted by law, Vonga makes no warranties, representations, or guarantees, whether express or implied, regarding the merchantability, fitness for a particular purpose, non-infringement, or any other aspect of our products or Services.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            While we strive to provide accurate product descriptions, specifications, and availability information on our website, we do not warrant that product descriptions or other content on our site is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Vonga does not guarantee that our Services will be uninterrupted, secure, or error-free, or that any defects will be corrected. We do not warrant that our digital platforms, NFC functionality, or any associated services will meet your specific requirements or expectations.
          </p>
        </div>
      </Section>

      {/* Limitation of Liability Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Scale className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Limitation of Liability
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            To the maximum extent permitted by applicable law, Vonga, LLC, its officers, directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our products or Services. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, even if we have been advised of the possibility of such damages.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            In no event shall Vonga's total aggregate liability to you for any and all claims arising from or related to your use of our products or Services exceed the amount you actually paid to Vonga for the specific product or service giving rise to the claim. If you have not made any payments to Vonga, our total liability to you shall not exceed $100.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such jurisdictions, our liability will be limited to the fullest extent permitted by applicable law.
          </p>
        </div>
      </Section>

      {/* Dispute Resolution Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <FileText className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Dispute Resolution
          </h2>

          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Any dispute, claim, or controversy arising out of or relating to these Terms or your use of Vonga's products or Services, including disputes regarding the formation, interpretation, breach, termination, or validity of these Terms, shall be resolved through binding arbitration rather than in court, except as otherwise provided below.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Arbitration will be conducted in Indiana, United States, and administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitrator's decision will be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof. Each party will be responsible for its own arbitration costs, including attorney fees, except as otherwise required by applicable law or the AAA rules.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            <strong>Class Action Waiver:</strong> By agreeing to these Terms, you waive your right to participate in any class action lawsuits or class-wide arbitration against Vonga. You also waive your right to a jury trial. All disputes must be brought in your individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.
          </p>
          <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
            Notwithstanding the arbitration provision above, either party may seek equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights or confidential information.
          </p>
        </div>
      </Section>

      {/* Additional Terms Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Additional Terms
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Termination
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga reserves the right to suspend or terminate your access to our Services at any time, with or without notice, for any reason or no reason, including but not limited to violation of these Terms, suspected fraudulent activity, misuse of our products or technology, chargebacks or payment disputes, or any conduct that we determine in our sole discretion to be harmful to Vonga, other users, or third parties.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Upon termination of your access to our Services, your right to use the Services will immediately cease. Any provisions of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property rights, disclaimers of warranties, limitations of liability, dispute resolution provisions, and any obligations to pay amounts owed to Vonga.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Modifications to Terms
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga reserves the right to update, modify, or replace these Terms and Conditions at any time for any reason, including to reflect changes in our business practices, Services, legal requirements, or for other operational, legal, or regulatory reasons. When we make changes to these Terms, we will update the "Effective Date" at the top of this page to reflect when the revisions were made.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              For material changes that significantly affect your rights or obligations under these Terms, we will provide prominent notice on our website or, where appropriate, notify you directly via email. Your continued use of Vonga's Services following the posting of any changes to these Terms constitutes your acceptance of those changes. If you do not agree to the modified Terms, you must discontinue use of our Services.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Privacy
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Your use of Vonga's Services is also subject to our <Link href="/legal/privacy" className="font-semibold hover:underline" style={{ color: '#33BECC' }}>Privacy Policy</Link>, which explains in detail how we collect, use, store, and protect your personal information. The Privacy Policy is incorporated by reference into these Terms and forms part of the binding agreement between you and Vonga. We encourage you to read the Privacy Policy carefully to understand your rights and our practices regarding your personal data.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '32px' }}>
            Questions About These Terms?
          </h2>
          <p className="text-lg text-black leading-relaxed text-center" style={{ marginBottom: '64px' }}>
            If you have any questions about these Terms and Conditions, please reach out to us. We're here to help.
          </p>
          <Card className="border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
            <CardContent className="p-3xl">
              <TermsContactForm />
            </CardContent>
          </Card>
      </div>
      </Section>
    </div>
  );
}

