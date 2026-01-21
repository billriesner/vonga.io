import { Section } from "@/components/Section";
import { Shield, Eye, Lock, UserCheck, Globe, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PrivacyForm } from "@/components/PrivacyForm";

export default function PrivacyPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-lg" style={{ color: '#33BECC', textShadow: '0 2px 8px rgba(255,255,255,0.9)' }}>
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl font-bold text-black" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>
              How we protect your information
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-bold text-black leading-relaxed max-w-3xl mx-auto mb-xl">
            Vonga makes NFC-enabled apparel that unlocks experiences with a simple tap. No app required. This Privacy Policy explains what we collect, how we use it, and the choices you have.
          </p>
          <p className="text-sm text-black/60">
            Effective Date: October 2, 2025
          </p>
        </div>
      </Section>

      {/* Divider */}
      <div className="py-4xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-6xl mx-auto">
          <div className="h-0.5 bg-accent/30" />
        </div>
      </div>

      {/* What We Collect Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <Eye className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            What We Collect (and Don't Collect)
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              When you browse our site
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Like most websites, we automatically collect standard web logs when you visit our site. This includes your IP address, browser type, device information, and the pages you view. We use this information to understand how visitors use our site and to improve performance and security.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We also use basic analytics and cookies necessary for site functionality. For any non-essential cookies, such as those used for marketing or enhanced analytics, we will request your consent before placing them on your device. You can manage your cookie preferences at any time through our cookie banner.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              When you shop at Shop Vonga
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              When you place an order through our retail shop, we collect the information necessary to process and fulfill your purchase. This includes your name, email address, shipping address, and billing information. We use secure third-party payment processors to handle all payment transactions, and we only store a tokenized reference to your payment method, never your actual credit card number or sensitive financial data.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We also maintain records of your order history, including the items purchased, order totals, and fulfillment status. This information helps us provide customer support, process returns and exchanges, and comply with our legal obligations for tax and accounting purposes.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              When you tap a Vonga garment
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga's NFC technology is designed with privacy at its core. When you tap your phone to a Vonga garment, we do not access, collect, or store any personal content from your device. Your photos, contacts, messages, and other device data remain completely private.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Instead, we only record the tap event itself, which is tied to the garment's unique digital twin identifier. This allows us to verify eligibility for rewards, content, or experiences associated with that specific garment. In some cases, we may also record time-based or location-based eligibility, such as confirming that a tap occurred during a specific event window or within a designated geofenced area. This information is used solely to determine whether you qualify for the associated benefit.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Importantly, we do not log your precise device identifiers, track your location history beyond the specific eligibility check, or create profiles of your movements. Each tap is treated as an isolated event associated with the garment, not with tracking your personal behavior.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              When you use Club Vonga or Enterprise dashboards
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              For organizations using our Club Vonga or Enterprise platforms, we collect administrative contact information for the individuals responsible for managing your account. This typically includes names, email addresses, and phone numbers for your organization's administrators and coordinators.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We also store your platform configuration settings, including the rewards you've created, eligibility rules you've defined, and any custom branding or content you've uploaded. Additionally, we provide aggregated engagement metrics and analytics to help you understand how your community or participants are interacting with your Vonga-enabled apparel and activations. These metrics are presented in aggregate form and do not identify individual end users unless you've configured your platform to collect such information.
            </p>
          </div>

        </div>
      </Section>

      {/* Privacy Commitment Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-bold text-black leading-relaxed max-w-3xl mx-auto">
            Vonga does not sell personal information and will never share data with third parties for marketing without your prior consent.
          </p>
        </div>
      </Section>

      {/* Why We Use Data Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Lock className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Why We Use Data
          </h2>

          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Provide Services
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We use the information we collect to deliver the core services you expect from Vonga. This includes fulfilling your retail orders, verifying tap eligibility for rewards and experiences, managing loyalty programs and gamification features, and preventing fraudulent activity that could compromise your account or our platform.
            </p>
          </div>

          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Improve & Secure
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Your data helps us make Vonga better and more secure. We analyze usage patterns in aggregate to identify bugs, optimize performance, and enhance service reliability. This technical data helps us debug issues, improve the user experience, and ensure our platform remains secure and stable for all users.
            </p>
          </div>

          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Communicate
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We use your contact information to send you transactional communications, such as order confirmations, shipping updates, and service notifications. For marketing communications, including promotional offers, new product announcements, and newsletter content, we will only contact you if you have provided opt-in consent. You can withdraw this consent and unsubscribe from marketing emails at any time through the links provided in each message.
            </p>
          </div>

          <div className="mb-xl">
            <h3 className="text-xl font-bold mb-md" style={{ color: '#33BECC' }}>
              Legal Compliance
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We retain certain data to comply with legal obligations, including tax and accounting requirements, security incident reporting, and responding to legal disputes or lawful requests from government authorities.
            </p>
          </div>

          <p className="text-lg text-black leading-relaxed mt-3xl p-lg bg-accent/5 rounded border-l-4 border-accent" style={{ marginBottom: '24px' }}>
            <strong>For EU/UK residents:</strong> Our legal bases for processing personal data include performance of a contract (when providing services you've requested), legitimate interests (for service improvement and security), consent (for marketing and optional features), and legal obligation (for compliance requirements).
          </p>
        </div>
      </Section>

      {/* Your Rights & Choices Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#F7F7F7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <UserCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Your Rights & Choices
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Global
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              <strong>Cookie Preferences:</strong> You can manage your cookie preferences at any time through the cookie banner that appears on our site. This allows you to control which types of cookies are placed on your device, including whether to accept or reject non-essential cookies used for marketing and analytics purposes.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              <strong>Marketing Communications:</strong> If you've subscribed to our marketing emails, you can opt out at any time by clicking the unsubscribe link in the footer of any marketing message we send you. This will remove you from our marketing lists while still allowing us to send you important transactional emails related to your orders or account.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              United States (CCPA/CPRA & other state laws)
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              If you are a resident of California, Virginia, Colorado, Connecticut, or Utah, you have specific rights under state privacy laws. These rights include the ability to request access to the personal information we hold about you, request corrections to inaccurate data, and request deletion of your personal information subject to certain exceptions.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              You also have the right to opt out of the sale or sharing of your personal information for targeted advertising purposes, and to request a portable copy of your data in a machine-readable format. To exercise any of these rights, please contact us using the form at the bottom of this page or by emailing privacy@vonga.io.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We want to be clear: Vonga does not sell your personal data to third parties. If we ever engage in "sharing" as that term is defined under the California Privacy Rights Act (CPRA), we will provide a clear "Do Not Sell or Share My Personal Information" link on our website where you can easily opt out.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              EU/UK (GDPR)
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              If you are located in the European Union or United Kingdom, the General Data Protection Regulation (GDPR) provides you with comprehensive rights regarding your personal data. You have the right to access your personal information and receive a copy of the data we hold about you. You may also request that we rectify any inaccurate information, erase your data (also known as the "right to be forgotten"), or restrict how we process your information in certain circumstances.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Additionally, you have the right to object to our processing of your personal data for legitimate interests or direct marketing purposes, and the right to request data portability, which allows you to obtain and reuse your personal data across different services. If our processing is based on your consent, you may withdraw that consent at any time, though this will not affect the lawfulness of processing that occurred before your withdrawal.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              If you believe we have not adequately addressed your privacy concerns, you have the right to file a complaint with your local data protection authority. To exercise any of these rights, please contact us using the form at the bottom of this page or by emailing privacy@vonga.io.
            </p>
          </div>
        </div>
      </Section>

      {/* Additional Policies Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#303E55' }}>
              <Shield className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '64px' }}>
            Additional Policies
          </h2>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Children's Privacy
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga's website and services are not directed to children under the age of 13 in the United States or under the age of 16 in the European Union. We do not knowingly collect personal information from children in these age groups without appropriate parental consent.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              If we become aware that we have inadvertently collected personal information from a child without proper consent, we will take immediate steps to delete that information from our systems. For any child-directed services or programs we may offer in the future, we will comply with the Children's Online Privacy Protection Act (COPPA) and obtain verified parental consent before collecting any personal information from children.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Data Retention
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations. For retail order data, we keep records for the duration required by tax, accounting, and consumer protection laws, which typically ranges from three to seven years depending on jurisdiction.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              For tap eligibility logs and event-related data, we retain records only for the duration of the activation or event period, plus a reasonable audit period afterward to address any disputes or support requests. Once data is no longer needed for these purposes, we either delete it entirely or de-identify it so that it can no longer be associated with you as an individual.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              International Data Transfers
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga operates globally, and as a result, your personal information may be transferred to and processed in countries other than your country of residence. When we transfer personal data internationally, particularly from the European Economic Area, United Kingdom, or Switzerland to other jurisdictions, we implement appropriate safeguards to protect your information. These safeguards may include Standard Contractual Clauses approved by the European Commission, adequacy decisions, or other legally recognized transfer mechanisms to ensure your data receives an adequate level of protection regardless of where it is processed.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Security
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We take the security of your personal information seriously and implement a comprehensive set of administrative, technical, and physical safeguards designed to protect your data from unauthorized access, disclosure, alteration, or destruction. These measures include industry-standard encryption for data in transit and at rest, strict access controls that limit who within our organization can access personal information, regular security monitoring and testing, and ongoing employee training on data protection practices.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              While no system can guarantee 100% security, we continually review and update our security practices to address emerging threats and maintain the highest standards of data protection. If we become aware of any security breach that affects your personal information, we will notify you and any applicable regulatory authorities in accordance with applicable law.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              How We Share Information
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We share your personal information only in limited circumstances and only with parties who are contractually obligated to protect your data. We work with trusted service providers who help us operate our business, including payment processors, hosting providers, email service providers, analytics platforms, and logistics partners. These service providers are bound by contracts that restrict their use of your information to only the purposes we've specified and prohibit them from using your data for their own independent purposes.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We may also disclose personal information when required by law, such as in response to a valid subpoena, court order, or other legal process. We may also share information when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others, to investigate fraud or security issues, or to respond to government requests.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We will never share your personal information with third parties for their independent marketing purposes without your explicit consent. Your data is yours, and we treat it with the respect it deserves.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Your Control at Tap
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Every time you tap a Vonga garment, you remain in control of your data and privacy. When the tap experience loads, you have the choice to proceed with claiming the garment, signing up for rewards, or linking the tap to an existing account. You are never required to provide personal information simply to tap, and you can choose to interact anonymously if you prefer.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              If you decline to provide personal information or create an account, we record only an anonymous tap event for basic eligibility tracking. You can also revoke your consent for reward programs, data collection, or marketing communications at any time through your account settings or by contacting us directly. Your control over your data doesn't end when you first tap.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Cookies & Similar Technologies
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience and provide essential functionality. Essential cookies are strictly necessary for the site to work properly, such as those that enable secure login, maintain your shopping cart, or remember your cookie preferences. These essential cookies do not require your consent as they are necessary for the basic operation of our site.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We also use optional cookies for analytics and marketing purposes, but only with your consent. Analytics cookies help us understand how visitors interact with our site so we can improve its design and functionality. Marketing cookies may be used to deliver personalized advertisements and track the effectiveness of our campaigns. In accordance with EU/UK cookie laws and other applicable regulations, we will request your consent before placing these non-essential cookies on your device. You can manage your cookie preferences at any time through the cookie banner or your browser settings.
            </p>
          </div>

          <div className="mb-4xl">
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Enterprise & Club Vonga Data Relationships
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              For organizations using our Club Vonga or Enterprise platforms, it's important to understand the data relationship. In these scenarios, your organization acts as the "data controller" (under GDPR terminology) or "business" (under CCPA terminology) for the personal information of your end users, members, or participants. This means your organization determines what data is collected and how it is used within the Vonga platform.
            </p>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              Vonga acts as a "data processor" or "service provider" in this relationship, processing personal information only according to your organization's documented instructions and the terms of our agreement. We provide tools and assistance to help you respond to data subject rights requests from your end users and support your compliance with applicable privacy laws. If you have questions about your obligations as a controller or business, please consult with your legal counsel.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-lg" style={{ color: '#33BECC', marginTop: '32px' }}>
              Changes to This Policy
            </h3>
            <p className="text-lg text-black leading-relaxed" style={{ marginBottom: '24px' }}>
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, legal requirements, or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Effective Date" at the top of this policy to reflect when the revisions were made. For material changes that significantly affect your rights or how we use your information, we will provide prominent notice on our website or, where appropriate, contact you directly via email. We encourage you to review this policy periodically to stay informed about how we protect your privacy.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Us Section */}
      <Section className="py-5xl" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center" style={{ marginBottom: '32px' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#33BECC' }}>
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center" style={{ marginBottom: '32px' }}>
            Contact Us
          </h2>
          <p className="text-lg text-black leading-relaxed text-center" style={{ marginBottom: '64px' }}>
            Questions about privacy? Send us a message and we'll get back to you.
          </p>
          <Card className="border-2 border-navy" style={{ backgroundColor: '#303E55' }}>
            <CardContent className="p-3xl">
              <PrivacyForm />
            </CardContent>
          </Card>
      </div>
      </Section>
    </div>
  );
}
