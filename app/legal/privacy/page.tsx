/* eslint-disable react/no-unescaped-entities */
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Vonga",
  description: "Vonga's Privacy Policy explains how we collect, use, and protect your personal information when you use our NFC-enabled apparel and services.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700">
              How we protect your information
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Effective Date: January 21, 2026
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
              Vonga makes NFC-enabled apparel that unlocks experiences with a simple tap. No app required. This Privacy Policy explains what we collect, how we use it, and the choices you have.
            </p>
          </div>
        </section>

        {/* What We Collect Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              What We Collect (and Don't Collect)
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                When you browse our site
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Like most websites, we automatically collect standard web logs when you visit our site. This includes your IP address, browser type, device information, and the pages you view. We use this information to understand how visitors use our site and to improve performance and security.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We also use basic analytics and cookies necessary for site functionality. For any non-essential cookies, such as those used for marketing or enhanced analytics, we will request your consent before placing them on your device. You can manage your cookie preferences at any time through our cookie banner.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                When you shop at Shop Vonga
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                When you place an order through our retail shop, we collect the information necessary to process and fulfill your purchase. This includes your name, email address, shipping address, and billing information. We use secure third-party payment processors to handle all payment transactions, and we only store a tokenized reference to your payment method, never your actual credit card number or sensitive financial data.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We also maintain records of your order history, including the items purchased, order totals, and fulfillment status. This information helps us provide customer support, process returns and exchanges, and comply with our legal obligations for tax and accounting purposes.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                When you tap a Vonga garment
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga's NFC technology is designed with privacy at its core. When you tap your phone to a Vonga garment, we do not access, collect, or store any personal content from your device. Your photos, contacts, messages, and other device data remain completely private.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Instead, we only record the tap event itself, which is tied to the garment's unique digital twin identifier. This allows us to verify eligibility for rewards, content, or experiences associated with that specific garment. In some cases, we may also record time-based or location-based eligibility, such as confirming that a tap occurred during a specific event window or within a designated geofenced area. This information is used solely to determine whether you qualify for the associated benefit.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Importantly, we do not log your precise device identifiers, track your location history beyond the specific eligibility check, or create profiles of your movements. Each tap is treated as an isolated event associated with the garment, not with tracking your personal behavior.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                When you use Club Vonga or Enterprise dashboards
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                For organizations using our Club Vonga or Enterprise platforms, we collect administrative contact information for the individuals responsible for managing your account. This typically includes names, email addresses, and phone numbers for your organization's administrators and coordinators.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We also store your platform configuration settings, including the rewards you've created, eligibility rules you've defined, and any custom branding or content you've uploaded. Additionally, we provide aggregated engagement metrics and analytics to help you understand how your community or participants are interacting with your Vonga-enabled apparel and activations. These metrics are presented in aggregate form and do not identify individual end users unless you've configured your platform to collect such information.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Commitment Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xl font-semibold text-gray-900 leading-relaxed">
              Vonga does not sell personal information and will never share data with third parties for marketing without your prior consent.
            </p>
          </div>
        </section>

        {/* Why We Use Data Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <Lock className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Why We Use Data
            </h2>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Provide Services
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We use the information we collect to deliver the core services you expect from Vonga. This includes fulfilling your retail orders, verifying tap eligibility for rewards and experiences, managing loyalty programs and gamification features, and preventing fraudulent activity that could compromise your account or our platform.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Improve & Secure
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Your data helps us make Vonga better and more secure. We analyze usage patterns in aggregate to identify bugs, optimize performance, and enhance service reliability. This technical data helps us debug issues, improve the user experience, and ensure our platform remains secure and stable for all users.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Communicate
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We use your contact information to send you transactional communications, such as order confirmations, shipping updates, and service notifications. For marketing communications, including promotional offers, new product announcements, and newsletter content, we will only contact you if you have provided opt-in consent. You can withdraw this consent and unsubscribe from marketing emails at any time through the links provided in each message.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-aqua">
                Legal Compliance
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We retain certain data to comply with legal obligations, including tax and accounting requirements, security incident reporting, and responding to legal disputes or lawful requests from government authorities.
              </p>
            </div>

            <div className="mt-12 p-6 bg-aqua/5 rounded border-l-4 border-aqua">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>For EU/UK residents:</strong> Our legal bases for processing personal data include performance of a contract (when providing services you've requested), legitimate interests (for service improvement and security), consent (for marketing and optional features), and legal obligation (for compliance requirements).
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights & Choices Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Your Rights & Choices
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Global
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <strong>Cookie Preferences:</strong> You can manage your cookie preferences at any time through the cookie banner that appears on our site. This allows you to control which types of cookies are placed on your device, including whether to accept or reject non-essential cookies used for marketing and analytics purposes.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <strong>Marketing Communications:</strong> If you've subscribed to our marketing emails, you can opt out at any time by clicking the unsubscribe link in the footer of any marketing message we send you. This will remove you from our marketing lists while still allowing us to send you important transactional emails related to your orders or account.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                United States (CCPA/CPRA & other state laws)
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                If you are a resident of California, Virginia, Colorado, Connecticut, or Utah, you have specific rights under state privacy laws. These rights include the ability to request access to the personal information we hold about you, request corrections to inaccurate data, and request deletion of your personal information subject to certain exceptions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                You also have the right to opt out of the sale or sharing of your personal information for targeted advertising purposes, and to request a portable copy of your data in a machine-readable format. To exercise any of these rights, please contact us at privacy@vonga.io.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We want to be clear: Vonga does not sell your personal data to third parties. If we ever engage in "sharing" as that term is defined under the California Privacy Rights Act (CPRA), we will provide a clear "Do Not Sell or Share My Personal Information" link on our website where you can easily opt out.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                EU/UK (GDPR)
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                If you are located in the European Union or United Kingdom, the General Data Protection Regulation (GDPR) provides you with comprehensive rights regarding your personal data. You have the right to access your personal information and receive a copy of the data we hold about you. You may also request that we rectify any inaccurate information, erase your data (also known as the "right to be forgotten"), or restrict how we process your information in certain circumstances.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Additionally, you have the right to object to our processing of your personal data for legitimate interests or direct marketing purposes, and the right to request data portability, which allows you to obtain and reuse your personal data across different services. If our processing is based on your consent, you may withdraw that consent at any time, though this will not affect the lawfulness of processing that occurred before your withdrawal.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                If you believe we have not adequately addressed your privacy concerns, you have the right to file a complaint with your local data protection authority. To exercise any of these rights, please contact us at privacy@vonga.io.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Policies Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-navy">
                <Shield className="w-8 h-8 text-aqua" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
              Additional Policies
            </h2>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Children's Privacy
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Vonga's website and services are not directed to children under the age of 13 in the United States or under the age of 16 in the European Union. We do not knowingly collect personal information from children in these age groups without appropriate parental consent.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                If we become aware that we have inadvertently collected personal information from a child without proper consent, we will take immediate steps to delete that information from our systems. For any child-directed services or programs we may offer in the future, we will comply with the Children's Online Privacy Protection Act (COPPA) and obtain verified parental consent before collecting any personal information from children.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Data Retention
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations. For retail order data, we keep records for the duration required by tax, accounting, and consumer protection laws, which typically ranges from three to seven years depending on jurisdiction.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                For tap eligibility logs and event-related data, we retain records only for the duration of the activation or event period, plus a reasonable audit period afterward to address any disputes or support requests. Once data is no longer needed for these purposes, we either delete it entirely or de-identify it so that it can no longer be associated with you as an individual.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Security
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We take the security of your personal information seriously and implement a comprehensive set of administrative, technical, and physical safeguards designed to protect your data from unauthorized access, disclosure, alteration, or destruction. These measures include industry-standard encryption for data in transit and at rest, strict access controls that limit who within our organization can access personal information, regular security monitoring and testing, and ongoing employee training on data protection practices.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                While no system can guarantee 100% security, we continually review and update our security practices to address emerging threats and maintain the highest standards of data protection. If we become aware of any security breach that affects your personal information, we will notify you and any applicable regulatory authorities in accordance with applicable law.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 text-aqua mt-8">
                Changes to This Policy
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, services, legal requirements, or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Effective Date" at the top of this policy to reflect when the revisions were made. For material changes that significantly affect your rights or how we use your information, we will provide prominent notice on our website or, where appropriate, contact you directly via email. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-aqua">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-8">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-12">
              Questions about privacy? Contact us at{" "}
              <a href="mailto:privacy@vonga.io" className="text-aqua hover:underline font-semibold">
                privacy@vonga.io
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
