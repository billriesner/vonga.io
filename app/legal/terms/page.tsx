/* eslint-disable react/no-unescaped-entities */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, Users, ShoppingCart, Shield, Scale, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vonga",
  description: "Vonga's Terms and Conditions govern your access to and use of our website, products, and NFC-enabled apparel services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-700">
              Agreement for using Vonga products and services
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Effective Date: January 21, 2026
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              These Terms and Conditions govern your access to and use of Vonga's website, platform, and partnership services. By accessing our site, entering into a partnership agreement, or using our Services to create fan experiences, you agree to these Terms. If you do not agree, you may not use our Services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Entity:</strong> Vonga, LLC, incorporated in Indiana, United States
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Governing Law:</strong> State of Indiana, USA
            </p>
          </div>
        </section>

        {/* Eligibility Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Eligibility
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Team & Organization Partners
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga partners with sports teams, universities, and community organizations to create meaningful fan experiences through NFC-enabled apparel. To enter into a partnership agreement with Vonga, you must be at least 18 years old and have the legal authority to bind your organization to these Terms. You represent and warrant that you have obtained all necessary approvals from your organization to enter into agreements on its behalf and to configure the Vonga platform according to your organization's needs.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Enterprise Partners
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Enterprise partnerships are comprehensive programs that are governed by separate written agreements negotiated between your organization and Vonga. These Enterprise agreements contain specific terms, pricing, deliverables, and service level commitments tailored to your organization's needs. The general Terms and Conditions on this page do not apply to Enterprise services except where explicitly incorporated by reference in your Enterprise agreement.
              </p>
            </div>
          </div>
        </section>

        {/* Products & Services Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <ShoppingCart className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Partnership Programs & Services
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Partnership Programs
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga partners with sports teams, universities, and community organizations to create NFC-enabled apparel that unlocks meaningful fan experiences. Our partnership programs include custom-designed team apparel embedded with NFC technology, access to the Vonga platform for creating and managing experiences, and ongoing support throughout your program.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Partnership programs typically begin with pilot programs starting at 100-300 kits, allowing you to test the platform and measure results before scaling. Custom production runs are created specifically for your organization with your branding and specifications. Due to the custom nature of these orders, we require a deposit at the time of order confirmation, with the remaining balance due prior to shipment. Payment terms are specified in your partnership agreement.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Because partnership products are custom-made to your specifications and branded for your organization, these orders are non-refundable except for defective items or errors in production that are attributable to Vonga. Please review and approve all order details, artwork, and specifications carefully before confirming your order.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Enterprise Partnerships
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Enterprise partnerships are comprehensive programs that are governed by separate written agreements negotiated between your organization and Vonga. These Enterprise agreements contain specific terms, pricing, deliverables, service level commitments, and launch timelines tailored to your organization's needs. The general Terms and Conditions on this page do not apply to Enterprise services except where explicitly incorporated by reference in your Enterprise agreement.
              </p>
            </div>
          </div>
        </section>

        {/* Orders & Payments Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Partnership Agreements & Payments
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Payment processing for Vonga partnership programs is handled securely through trusted third-party payment processors. Partnership program payments are typically processed through Stripe or other PCI-compliant payment processors that ensure your financial information is handled securely. Payment terms, including deposit requirements and final payment schedules, are specified in your partnership agreement.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Enterprise invoicing and payments are managed in accordance with the payment terms negotiated in your Enterprise agreement. This may include net payment terms, milestone-based payments tied to program deliverables, or other arrangements as specified in your contract.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              When entering into a partnership agreement or registering for services, you agree to provide accurate, current, and complete billing information, contact details, and shipping addresses. You are responsible for ensuring that this information remains up to date. Failure to provide accurate information may result in delayed shipments, payment processing issues, or inability to fulfill your partnership program.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              All prices are listed in U.S. dollars unless otherwise specified in your partnership agreement. Pricing for partnership programs is typically customized based on order quantity, customization requirements, and program scope. Prices are subject to change for new agreements, though any price changes will not affect agreements that have already been executed and paid for. You are responsible for any applicable taxes, duties, or customs fees associated with your partnership program.
            </p>
          </div>
        </section>

        {/* Use of NFC Technology Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Use of NFC Technology
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Vonga apparel incorporates embedded Near Field Communication (NFC) technology that allows fans to unlock digital experiences, exclusive content, and meaningful connections with a simple tap of their smartphone. This technology is designed to work seamlessly with NFC-enabled devices and enables teams and organizations to create ongoing engagement experiences for their communities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              You and your organization agree that you will not attempt to tamper with, disable, remove, reverse-engineer, or otherwise misuse the NFC functionality embedded in Vonga products. This includes attempting to clone, modify, or replicate the NFC chips or the digital twin identities associated with Vonga garments. Such actions may violate intellectual property laws and could result in termination of your partnership agreement and access to Vonga services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              While our NFC technology is designed to be safe for use with modern smartphones, Vonga is not liable for any damage to your device that may result from improper use of NFC features, incompatibility with your specific device model, or use in a manner inconsistent with the manufacturer's guidelines for your device.
            </p>
          </div>
        </section>

        {/* Intellectual Property Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <Scale className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Intellectual Property
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              All content available through Vonga's Services, including but not limited to our website design, branding, logos, trademarks, product designs, software code, NFC integrations, digital twin technology, and proprietary processes, are the exclusive property of Vonga, LLC and are protected by United States and international intellectual property laws, including copyright, trademark, patent, and trade secret laws.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              You are granted a limited, non-exclusive, non-transferable license to use Vonga products for their intended personal or organizational use. This license does not grant you any rights to reproduce, copy, modify, distribute, publicly display, create derivative works from, or otherwise exploit our intellectual property without our prior written consent.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              The Vonga name, logo, and all related product names, design marks, and slogans are trademarks or registered trademarks of Vonga, LLC. You may not use these marks without our express written permission. Any unauthorized use of our intellectual property may result in legal action and termination of your access to our Services.
            </p>
          </div>
        </section>

        {/* User Conduct Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              User Conduct
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              When using Vonga products, accessing our Services, or creating experiences through the Vonga platform, you and your organization agree to conduct yourselves in a lawful and respectful manner. Specifically, you agree that you will not:
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Engage in fraudulent activity
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                This includes fraudulent scanning of NFC tags, creating fake accounts to manipulate engagement metrics, tampering with NFC technology to manipulate eligibility or experiences, or any other deceptive practices designed to exploit our systems or obtain benefits to which you are not entitled.
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Misuse the platform or experiences
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga products and the platform are intended for creating legitimate fan experiences and community engagement. You may not use the platform to distribute harmful, offensive, or inappropriate content, or to create experiences that violate applicable laws or regulations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Use Services for unlawful purposes
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                You may not use our products or Services in any way that violates applicable local, state, national, or international laws or regulations, or in any manner that violates these Terms. This includes using our Services to harass, abuse, or harm others, or to transmit any unlawful, threatening, or otherwise objectionable content.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <AlertCircle className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Disclaimers
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Vonga products and Services are provided on an "as is" and "as available" basis, except as otherwise required by applicable law. To the fullest extent permitted by law, Vonga makes no warranties, representations, or guarantees, whether express or implied, regarding the merchantability, fitness for a particular purpose, non-infringement, or any other aspect of our products or Services.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              While we strive to provide accurate product descriptions, specifications, and availability information on our website, we do not warrant that product descriptions or other content on our site is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Vonga does not guarantee that our Services will be uninterrupted, secure, or error-free, or that any defects will be corrected. We do not warrant that our digital platforms, NFC functionality, or any associated services will meet your specific requirements or expectations.
            </p>
          </div>
        </section>

        {/* Limitation of Liability Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Limitation of Liability
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by applicable law, Vonga, LLC, its officers, directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our products or Services. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, even if we have been advised of the possibility of such damages.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              In no event shall Vonga's total aggregate liability to you for any and all claims arising from or related to your use of our products or Services exceed the amount you actually paid to Vonga for the specific product or service giving rise to the claim. If you have not made any payments to Vonga, our total liability to you shall not exceed $100.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such jurisdictions, our liability will be limited to the fullest extent permitted by applicable law.
            </p>
          </div>
        </section>

        {/* Dispute Resolution Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <FileText className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Dispute Resolution
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Any dispute, claim, or controversy arising out of or relating to these Terms or your use of Vonga's products or Services, including disputes regarding the formation, interpretation, breach, termination, or validity of these Terms, shall be resolved through binding arbitration rather than in court, except as otherwise provided below.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Arbitration will be conducted in Indiana, United States, and administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitrator's decision will be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof. Each party will be responsible for its own arbitration costs, including attorney fees, except as otherwise required by applicable law or the AAA rules.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Class Action Waiver:</strong> By agreeing to these Terms, you waive your right to participate in any class action lawsuits or class-wide arbitration against Vonga. You also waive your right to a jury trial. All disputes must be brought in your individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Notwithstanding the arbitration provision above, either party may seek equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights or confidential information.
            </p>
          </div>
        </section>

        {/* Additional Terms Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Additional Terms
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Termination
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga reserves the right to suspend or terminate your access to our Services at any time, with or without notice, for any reason or no reason, including but not limited to violation of these Terms, suspected fraudulent activity, misuse of our products or technology, chargebacks or payment disputes, or any conduct that we determine in our sole discretion to be harmful to Vonga, other users, or third parties.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Upon termination of your access to our Services, your right to use the Services will immediately cease. Any provisions of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property rights, disclaimers of warranties, limitations of liability, dispute resolution provisions, and any obligations to pay amounts owed to Vonga.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Modifications to Terms
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga reserves the right to update, modify, or replace these Terms and Conditions at any time for any reason, including to reflect changes in our business practices, Services, legal requirements, or for other operational, legal, or regulatory reasons. When we make changes to these Terms, we will update the "Effective Date" at the top of this page to reflect when the revisions were made.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                For material changes that significantly affect your rights or obligations under these Terms, we will provide prominent notice on our website or, where appropriate, notify you directly via email. Your continued use of Vonga's Services following the posting of any changes to these Terms constitutes your acceptance of those changes. If you do not agree to the modified Terms, you must discontinue use of our Services.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Privacy
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Your use of Vonga's Services is also subject to our{" "}
                <Link href="/legal/privacy" className="font-semibold hover:underline text-aqua">
                  Privacy Policy
                </Link>
                , which explains in detail how we collect, use, store, and protect your personal information. The Privacy Policy is incorporated by reference into these Terms and forms part of the binding agreement between you and Vonga. We encourage you to read the Privacy Policy carefully to understand your rights and our practices regarding your personal data.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-8">
              Questions About These Terms?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-12">
              If you have any questions about these Terms and Conditions, please contact us at{" "}
              <a href="mailto:hello@vonga.io" className="text-aqua hover:underline font-semibold">
                hello@vonga.io
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
