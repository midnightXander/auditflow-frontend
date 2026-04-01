'use client'

import { DashboardSidebar } from '@/components/dashboard-sidebar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Terms of Service</h1>
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
              Please read these Terms of Service carefully before using AuditFlow.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#acceptance" className="text-primary-600 hover:underline">1. Acceptance of Terms</a></li>
              <li><a href="#use-license" className="text-primary-600 hover:underline">2. Use License</a></li>
              <li><a href="#service-description" className="text-primary-600 hover:underline">3. Service Description</a></li>
              <li><a href="#user-responsibilities" className="text-primary-600 hover:underline">4. User Responsibilities</a></li>
              <li><a href="#intellectual-property" className="text-primary-600 hover:underline">5. Intellectual Property Rights</a></li>
              <li><a href="#user-content" className="text-primary-600 hover:underline">6. User Content</a></li>
              <li><a href="#disclaimer" className="text-primary-600 hover:underline">7. Disclaimer</a></li>
              <li><a href="#limitation-liability" className="text-primary-600 hover:underline">8. Limitation of Liability</a></li>
              <li><a href="#indemnification" className="text-primary-600 hover:underline">9. Indemnification</a></li>
              <li><a href="#termination" className="text-primary-600 hover:underline">10. Termination</a></li>
              <li><a href="#modifications" className="text-primary-600 hover:underline">11. Modifications to Service</a></li>
              <li><a href="#governing-law" className="text-primary-600 hover:underline">12. Governing Law</a></li>
              <li><a href="#contact" className="text-primary-600 hover:underline">13. Contact Information</a></li>
            </ul>
          </div>

          <section id="acceptance">
            <h2 className="text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AuditFlow ("Service", "Platform", "we", "us", or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section id="use-license">
            <h2 className="text-2xl font-bold mt-12 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on AuditFlow for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on AuditFlow</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Violate any applicable laws or regulations related to the access or use of the Service</li>
              <li>Use automated tools or scripts to access or crawl the Service without permission</li>
            </ul>
          </section>

          <section id="service-description">
            <h2 className="text-2xl font-bold mt-12 mb-4">3. Service Description</h2>
            <p>
              AuditFlow provides website auditing, analysis, and reporting tools powered by Google Lighthouse and other industry-standard metrics. Our Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Website performance audits</li>
              <li>SEO analysis and recommendations</li>
              <li>Accessibility and security assessments</li>
              <li>Deep crawling and site structure analysis</li>
              <li>Competitor comparison tools</li>
              <li>Backlink analysis</li>
              <li>Keyword research and tracking</li>
              <li>Professional report generation</li>
            </ul>
            <p className="mt-4">
              The Service is provided on an "as-is" and "as-available" basis. We make no warranties, expressed or implied, regarding the Service. The accuracy and timeliness of audit results depend on multiple factors including website configuration, server response times, and third-party data sources.
            </p>
          </section>

          <section id="user-responsibilities">
            <h2 className="text-2xl font-bold mt-12 mb-4">4. User Responsibilities</h2>
            <p>
              You agree that you are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Maintaining the confidentiality of your account login information</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring you have the legal right to audit and analyze third-party websites</li>
              <li>Complying with all applicable laws and regulations in your jurisdiction</li>
              <li>Not using the Service to audit or analyze websites without proper authorization</li>
              <li>Respecting intellectual property rights of others</li>
              <li>Not using the Service for illegal, fraudulent, or harmful purposes</li>
            </ul>
            <p className="mt-4">
              You warrant that you will only use the Service to audit websites that you own or have explicit written permission to audit. Unauthorized access to or analysis of third-party websites may violate laws such as the Computer Fraud and Abuse Act (CFAA) or equivalent legislation in your jurisdiction.
            </p>
          </section>

          <section id="intellectual-property">
            <h2 className="text-2xl font-bold mt-12 mb-4">5. Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, AuditFlow and/or its licensor own the intellectual property rights for all material on the Service. All intellectual property rights are reserved. You may view and print pages from the Service for personal use, subject to restrictions set in these terms and conditions.
            </p>
            <p className="mt-4">
              You must not:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Republish material from AuditFlow</li>
              <li>Sell, rent, or sub-license material from AuditFlow</li>
              <li>Reproduce, duplicate, or copy material from this Site for commercial purposes</li>
              <li>Redistribute content from AuditFlow unless content is specifically made for redistribution</li>
            </ul>
          </section>

          <section id="user-content">
            <h2 className="text-2xl font-bold mt-12 mb-4">6. User Content</h2>
            <p>
              In these Website Standard Terms and Conditions, "User Content" shall mean any audio, video, text, images, or other material you choose to display on this Service. By displaying User Content, you grant AuditFlow a non-exclusive, worldwide, irrevocable license to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Use, reproduce, adapt, publish, and distribute it</li>
              <li>Sub-license and use User Content in all forms and formats</li>
              <li>Modify your User Content</li>
            </ul>
            <p className="mt-4">
              This license includes the right to display User Content on AuditFlow and use it for promotional purposes. AuditFlow has the right but not the obligation to refuse, remove, or edit any User Content.
            </p>
          </section>

          <section id="disclaimer">
            <h2 className="text-2xl font-bold mt-12 mb-4">7. Disclaimer</h2>
            <p>
              The materials on AuditFlow are provided on an 'as is' basis. AuditFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="mt-4">
              Further, AuditFlow does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.
            </p>
            <p className="mt-4">
              <strong>No Guarantee of Results:</strong> We do not guarantee that following the recommendations in our audit reports will result in improved search rankings, increased traffic, or any specific business outcome. SEO results depend on many factors beyond technical optimization, including content quality, market conditions, and competitor activity.
            </p>
            <p className="mt-4">
              <strong>Third-Party Data:</strong> Some of our analysis relies on data from third-party providers. We are not responsible for the accuracy or completeness of this data. Please verify important findings independently.
            </p>
          </section>

          <section id="limitation-liability">
            <h2 className="text-2xl font-bold mt-12 mb-4">8. Limitation of Liability</h2>
            <p>
              In no event shall AuditFlow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on AuditFlow, even if AuditFlow or a AuditFlow authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
            <p className="mt-4">
              Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
            </p>
            <p className="mt-4">
              <strong>Maximum Liability:</strong> In no case shall our total liability to you exceed the amount you have paid to us in the past 12 months, or $100 USD, whichever is less.
            </p>
          </section>

          <section id="indemnification">
            <h2 className="text-2xl font-bold mt-12 mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AuditFlow and its parent, subsidiaries, affiliates, officers, directors, agents, and employees from and against any and all claims, liabilities, damages, losses, or expense arising out of:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third party right, including intellectual property rights</li>
              <li>Any claim that your User Content caused damage to a third party</li>
              <li>Your auditing or analysis of websites without proper authorization</li>
            </ul>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-bold mt-12 mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service at any time, in our sole discretion, with or without notice, for any reason, including if you:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
              <li>Violate these Terms of Service</li>
              <li>Engage in illegal activity</li>
              <li>Abuse the Service or attempt to circumvent usage limits</li>
              <li>Fail to comply with payment obligations</li>
              <li>Use the Service to audit websites without authorization</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service will cease immediately. All provisions that should survive termination shall survive, including limitations on liability, indemnification, and governing law.
            </p>
          </section>

          <section id="modifications">
            <h2 className="text-2xl font-bold mt-12 mb-4">11. Modifications to Service</h2>
            <p>
              AuditFlow may revise these Terms of Service at any time without notice. By using the Service, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
            <p className="mt-4">
              We may also modify, suspend, or discontinue the Service (or any feature or functionality thereof) at any time, with or without notice to you, and we will not be liable to you or any third party should we exercise such rights.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-bold mt-12 mb-4">12. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold mt-12 mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-100 rounded-lg p-6 mt-4">
              <p><strong>AuditFlow</strong></p>
              <p className="mt-2">Email: legal@auditflow.io</p>
              <p>Website: www.auditflow.io</p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-lg font-bold mb-2">Questions about our Terms?</h3>
          <p className="text-gray-600 mb-4">Contact our support team for clarification on any aspect of these terms.</p>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact Support →
          </Link>
        </div>
      </main>
    </div>
  )
}
