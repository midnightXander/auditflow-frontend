import BaseHeader from '@/components/base-header'
import Logo from '@/components/logo'
import { Metadata } from 'next'
import Footer2 from '@/components/sections/footer2';

export const metadata: Metadata = {
  title: 'About - OUTAudits',
  description: 'Learn about our company and mission.',
}



export default function AboutPage() {
  return (
    <>
    <BaseHeader />
    <div className="min-h-screen my-16 p-6">
      <div className="max-w-4xl mx-auto  p-8 space-y-8">
        {/* Title */}
        <h1 className="text-4xl text-[#00a4c6] font-bold">About OUTAUDITS</h1>
        <h3 className="text-xl text-gray-700">
          SEO work is hard enough. Reporting shouldn't be.
        </h3>

        {/* Intro */}
        <p className="text-gray-600 leading-relaxed">
          SEO agencies and consultants spend countless hours collecting data,
          building reports, explaining technical issues, tracking rankings, and
          proving their value to clients.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We built <strong>OUTAudits</strong> to make that work simpler.
        </p>
        <p className="text-gray-600 leading-relaxed">
          OUTAudits is an SEO platform built specifically for{" "}
          <strong>agencies, freelancers, and consultants</strong> who want to
          spend less time wrestling with SEO data—and more time growing their
          business.
        </p>

        {/* Belief Section */}
        <h2 className="text-2xl font-semibold text-gray-900">
          We believe SEO tools should help you sell, not just analyze.
        </h2>
        <p className="text-gray-600 leading-relaxed">
          There are plenty of tools that can tell you what's wrong with a
          website. But knowing that a website has 47 broken links isn't the same
          as knowing <strong>which ones actually matter to the client.</strong>
        </p>
        <blockquote className="border-l-4 border-[#00a4c6] pl-4 italic text-gray-700">
          "Here's what improved. Here's what changed. And here's what we're
          doing next."
        </blockquote>

        {/* Built for Section */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Built for the people doing SEO for someone else
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>A solo SEO consultant</li>
          <li>A freelance SEO</li>
          <li>A boutique agency</li>
          <li>A growing digital marketing agency</li>
          <li>A web agency adding SEO to its services</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          Your job is to <strong>turn that data into results</strong> your
          clients understand and value. OUTAudits is built around that workflow.
        </p>

        {/* Workflow Section */}
        <h1 className="text-3xl font-bold text-gray-900">
          From first conversation to monthly retainer
        </h1>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              01 — Win the prospect
            </h3>
            <p className="text-gray-600">
              Turn your website into an SEO lead-generation machine with an
              <strong> embeddable audit widget</strong>.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              02 — Show them what's actually wrong
            </h3>
            <p className="text-gray-600">
              Generate fast, detailed SEO audits that turn technical findings
              into understandable recommendations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              03 — Make your work look like your work
            </h3>
            <p className="text-gray-600">
              With white-label reporting, deliver professional, branded reports
              with your logo, colors, and client identity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              04 — Prove progress over time
            </h3>
            <p className="text-gray-600">
              Track keyword rankings and SEO performance over time so you can
              show clients what changed—not just what you worked on.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <h1 className="text-3xl font-bold text-gray-900">Our mission</h1>
        <p className="text-gray-600 leading-relaxed">
          <strong>Help SEO agencies do more with less.</strong>
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Less manual reporting</li>
          <li>Less copy-pasting</li>
          <li>Less time spent formatting PDFs</li>
          <li>More time analyzing</li>
          <li>More time selling</li>
          <li>More time growing the agency</li>
        </ul>

        <h1 className="text-3xl font-bold text-gray-900">Get in touch</h1>
        <p className="text-gray-600 leading-relaxed">
            Have questions? Want to see a demo? Reach out to us at <a href="mailto:support@outaudits.com" className="text-[#00a4c6] hover:underline">
              support@outaudits.com
            </a>
        </p>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="/register"
            className="inline-block bg-[#00a4c6] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#008aa3] transition"
          >
            Start using OUTAUDITS →
          </a>
          <p className="mt-4 text-gray-500 italic">
            The less time you spend producing SEO deliverables, the more time
            you have to deliver the work clients actually pay you for.
          </p>
        </div>
      </div>
    </div>
    <Footer2 />
    </>
  );
}
