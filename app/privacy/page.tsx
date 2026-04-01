'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          {/* Last Updated */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> March 18, 2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              We're committed to protecting your privacy. Please read this Privacy Policy carefully.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#introduction" className="text-primary-600 hover:underline">1. Introduction</a></li>
              <li><a href="#information-collect" className="text-primary-600 hover:underline">2. Information We Collect</a></li>
              <li><a href="#how-we-use" className="text-primary-600 hover:underline">3. How We Use Your Information</a></li>
              <li><a href="#data-sharing" className="text-primary-600 hover:underline">4. Data Sharing & Third Parties</a></li>
              <li><a href="#data-security" className="text-primary-600 hover:underline">5. Data Security</a></li>
              <li><a href="#user-rights" className="text-primary-600 hover:underline">6. Your Data Rights</a></li>
              <li><a href="#cookies" className="text-primary-600 hover:underline">7. Cookies & Tracking</a></li>
              <li><a href="#children" className="text-primary-600 hover:underline">8. Children's Privacy</a></li>
              <li><a href="#retention" className="text-primary-600 hover:underline">9. Data Retention</a></li>
              <li><a href="#international" className="text-primary-600 hover:underline">10. International Transfers</a></li>
              <li><a href="#contact" className="text-primary-600 hover:underline">11. Contact Information</a></li>
            </ul>
          </div>

          <section id="introduction">
            <h2 className="text-2xl font-bold mt-12 mb-4">1. Introduction</h2>
            <p>
              AuditFlow ("we", "us", "our", or "Company") operates the AuditFlow website and services. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            <p className="mt-4">
              We use your data to provide and improve the Service. By using AuditFlow, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section id="information-collect">
            <h2 className="text-2xl font-bold mt-12 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mt-8 mb-3">Personal Data</h3>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"), including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Email address</li>
              <li>First and last name</li>
              <li>Phone number (optional)</li>
              <li>Company name (if applicable)</li>
              <li>Billing address</li>
              <li>Payment information (processed securely through third parties)</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-3">Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"), including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>IP address and device identifiers</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Websites you audit using our Service</li>
              <li>Features used and frequency of use</li>
              <li>Referring/exit pages</li>
              <li>Error logs and crash reports</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-3">Audit Data</h3>
            <p>
              When you use AuditFlow to audit websites, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>URLs of websites audited</li>
              <li>Audit results and reports you generate</li>
              <li>Technical metrics and performance data</li>
              <li>SEO analysis findings</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> We do not access, store, or analyze the actual content of the websites you audit beyond what is necessary to provide audit functionality. We do not access or store sensitive information like passwords, personal data, or payment information found on audited websites.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Third-Party Data</h3>
            <p>
              We may receive information about you from third parties, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Authentication providers (Google, if you use social login)</li>
              <li>Payment processors</li>
              <li>Analytics services</li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2 className="text-2xl font-bold mt-12 mb-4">3. How We Use Your Information</h2>
            <p>
              AuditFlow uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li><strong>Providing Services:</strong> To provide, maintain, and improve the Service</li>
              <li><strong>Communication:</strong> To contact you with newsletters, marketing communications, and service updates</li>
              <li><strong>Account Management:</strong> To manage your account and send important account notifications</li>
              <li><strong>Billing:</strong> To process payments and send billing information</li>
              <li><strong>Analytics:</strong> To understand how users interact with our Service to improve functionality</li>
              <li><strong>Support:</strong> To respond to your customer service requests and support needs</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our agreements</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activity and unauthorized access</li>
              <li><strong>Research & Development:</strong> To develop new features and improve existing ones</li>
            </ul>
          </section>

          <section id="data-sharing">
            <h2 className="text-2xl font-bold mt-12 mb-4">4. Data Sharing & Third Parties</h2>
            <p>
              AuditFlow does not sell, trade, or rent your personal information. However, we may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-3">Service Providers</h3>
            <p>
              We may share your information with third-party service providers who assist us in:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Payment processing and billing</li>
              <li>Data hosting and storage (cloud providers)</li>
              <li>Analytics and performance monitoring</li>
              <li>Email delivery</li>
              <li>Customer support</li>
            </ul>
            <p className="mt-4">
              These service providers are contractually obligated to use your information only to provide services to us and are required to maintain the confidentiality and security of your information.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Legal Requirements</h3>
            <p>
              AuditFlow may disclose your personal information if required to do so by law or if we have a good faith belief that disclosure is necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Comply with applicable laws or regulations</li>
              <li>Enforce our Terms of Service and other agreements</li>
              <li>Protect the safety, rights, and property of AuditFlow, our users, or the public</li>
              <li>Prevent or investigate possible wrongdoing</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-3">Business Transfers</h3>
            <p>
              If AuditFlow is involved in a merger, acquisition, bankruptcy, or asset sale, your information may be transferred as part of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
            </p>
          </section>

          <section id="data-security">
            <h2 className="text-2xl font-bold mt-12 mb-4">5. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            <p className="mt-4">
              We implement security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="mt-4">
              <strong>Data Breach Notification:</strong> In the event of a data breach affecting your personal information, we will notify you without undue delay and in compliance with applicable laws.
            </p>
          </section>

          <section id="user-rights">
            <h2 className="text-2xl font-bold mt-12 mb-4">6. Your Data Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-3">Right to Access</h3>
            <p>
              You have the right to request a copy of the personal data we hold about you.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Right to Correction</h3>
            <p>
              You have the right to request that we correct any inaccurate or incomplete personal data.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Right to Deletion</h3>
            <p>
              You have the right to request deletion of your personal data, subject to certain exceptions such as where we have a legal obligation to retain the data.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Right to Data Portability</h3>
            <p>
              You have the right to request that we provide your data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller where technically feasible.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Right to Object</h3>
            <p>
              You have the right to object to processing of your data for marketing purposes or on legitimate interest grounds.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3">Right to Withdraw Consent</h3>
            <p>
              Where we process your data based on your consent, you have the right to withdraw that consent at any time.
            </p>

            <p className="mt-6">
              To exercise any of these rights, please contact us at legal@auditflow.io. We will respond to your request within 30 days (or as required by applicable law).
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold mt-12 mb-4">7. Cookies & Tracking</h2>
            <p>
              AuditFlow uses cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Remember your preferences and login information</li>
              <li>Understand how you use our Service</li>
              <li>Deliver personalized content</li>
              <li>Improve our Service performance</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-3">Types of Cookies</h3>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li><strong>Essential Cookies:</strong> Necessary for the Service to function properly</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand user behavior</li>
              <li><strong>Marketing Cookies:</strong> Used for advertising and tracking purposes</li>
            </ul>

            <p className="mt-4">
              You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of the Service.
            </p>
          </section>

          <section id="children">
            <h2 className="text-2xl font-bold mt-12 mb-4">8. Children's Privacy</h2>
            <p>
              AuditFlow is not intended for individuals under the age of 18. We do not knowingly collect personal data from children under 18. If we become aware that we have collected personal data from a child under 18, we will take steps to delete such data and terminate the child's account.
            </p>
            <p className="mt-4">
              If you believe we have collected information from a child under 18, please contact us immediately at legal@auditflow.io.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-2xl font-bold mt-12 mb-4">9. Data Retention</h2>
            <p>
              AuditFlow retains your personal data for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. Retention periods vary depending on the type of data and the purposes for which we use it.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after account termination for business and legal reasons</li>
              <li><strong>Audit Reports:</strong> Retained according to your account plan or until you request deletion</li>
              <li><strong>Usage Data:</strong> Typically retained for 12-24 months for analytics purposes</li>
              <li><strong>Backup Data:</strong> Retained for 30-90 days for recovery purposes</li>
            </ul>
            <p className="mt-4">
              You can request deletion of your data at any time, subject to legal retention requirements.
            </p>
          </section>

          <section id="international">
            <h2 className="text-2xl font-bold mt-12 mb-4">10. International Data Transfers</h2>
            <p>
              Your information, including personal data, may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country.
            </p>
            <p className="mt-4">
              When we transfer data internationally, we implement appropriate safeguards such as:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Your explicit consent</li>
              <li>Adequate level of protection in the recipient country</li>
            </ul>
            <p className="mt-4">
              By using AuditFlow, you consent to the transfer of your information to countries outside your country of residence.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold mt-12 mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-100 rounded-lg p-6 mt-4 space-y-3">
              <p>
                <strong>AuditFlow Privacy Team</strong>
              </p>
              <p>
                Email: <strong>privacy@auditflow.io</strong>
              </p>
              <p>
                Legal Email: <strong>legal@auditflow.io</strong>
              </p>
              <p>
                Website: www.auditflow.io
              </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-3">Data Protection Officer</h3>
            <p>
              We are committed to protecting your privacy. If you have concerns about how we handle your data, you may also file a complaint with your local data protection authority.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-lg font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-gray-600 mb-4">We're committed to transparency. Contact us for any privacy-related questions.</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact Our Privacy Team →
          </Link>
        </div>
      </main>
    </div>
  )
}
