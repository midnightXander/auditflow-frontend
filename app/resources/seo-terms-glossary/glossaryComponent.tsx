'use client'
import Link from "next/link";
import Footer2 from "@/components/sections/footer2";
import BaseHeader from "@/components/base-header";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Download,
} from "lucide-react";
import { WhiteLabelForm } from "@/components/whiteLabelForm";

import { exportGlossary } from "@/lib/pdf-export";
import { terms } from "@/components/whiteLabelForm";




export default function GlossaryComponent() {
  
  return (
    <>
    <BaseHeader />
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <section
              style={{
                backgroundColor: '#141e27',
                padding: '140px 0 0',
                borderBottom: '1px solid #263747',
              }}
            >
              <div className="content-container">
                {/* Back link */}
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-sm mb-6 bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                  style={{ color: '#c1cfda' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
      
                <div className="article-fade max-w-[720px]">
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: '#00a4c6' }}
                  >
                    RESOURCES
                  </span>
      
                  <h1
                    className="mt-3"
                    style={{
                      fontSize: 'clamp(26px, 3.5vw, 40px)',
                      fontWeight: 700,
                      lineHeight: '1.15',
                      letterSpacing: '-1px',
                      color: '#ffffff',
                    }}
                  >
                    The Plain-English SEO Glossary: Every term an agency uses — explained like you're not a specialist.
                  </h1>
      
                  <p
                    className="mt-4"
                    style={{
                      fontSize: 17,
                      lineHeight: '28px',
                      color: '#c1cfda',
                    }}
                  >
                    {/* Client-friendly explanations of the words agencies throw around — so clients actually understand what's happening with their website. */}
                    Written for business owners who nod politely when their agency says "your domain authority dipped." No jargon. No dense acronyms. Just clear answers.

                  </p>

                  <p className="my-4" style={{ color: "#c1cfda"}}>
                  Each entry has a <strong>What it is</strong> (plain definition) and <strong>Why it matters to you</strong> (the business angle). This is deliberately the tone you can hand to any client and have them walk away thinking "that made sense."        </p>
      
                  {/* Author row */}
                  {/* <div className="flex flex-wrap items-center gap-4 mt-6 pb-10">
                    <div className="flex items-center gap-3">
                      <img
                        src={article.metadata?.author?.avatar}
                        alt={article.metadata?.author?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                          {article.metadata?.author?.name}
                        </p>
                        <p className="text-xs" style={{ color: '#44576a' }}>
                          {article.metadata?.author?.role}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-px h-6 hidden sm:block"
                      style={{ backgroundColor: '#374c63' }}
                    />
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#44576a' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {article.metadata.publishedAt}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#44576a' }}>
                      <Clock className="w-3.5 h-3.5" />
                      {article.metadata.readTime}
                    </div>
                  </div> */}
                </div>
              </div>
      
              {/* Cover image */}
              <div className="content-container pb-0">
                <div className="rounded-t-md overflow-hidden" style={{ marginBottom: -2 }}>
                  <img
                    src="/images/resources/glossary-cover.png"
                    alt="Glossary cover image"
                    className="w-full object-cover"
                    // style={{ maxHeight: 420 }}
                  />
                </div>
              </div>
      </section>

      <section className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          {/* Main content */}
          <div className="article-fade max-w-[720px]">
            {/* Share bar */}
            <div
              className="flex items-center gap-3 mb-10 p-3 rounded-md"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e4e9ed' }}
            >
              <span className="text-xs font-medium" style={{ color: '#44576a' }}>
                Share:
              </span>
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Mail, label: 'Email' },
                { icon: Share2, label: 'Copy Link' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#00a4c6] hover:text-white group"
                  style={{ backgroundColor: '#f5f7fa', color: '#44576a' }}
                  title={`Share on ${label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
              
              
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#00a4c6] hover:text-white ml-auto"
                style={{ backgroundColor: '#f5f7fa', color: '#44576a' }}
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              
              
            </div>

            {/* Content blocks */}
      <main className="prose prose-sm sm:prose lg:prose-lg mt-8 max-w-none">
        <p className="text-lg my-4 font-semibold">
          {/* The biggest cause of client anxiety in digital marketing isn't bad performance—it's confusion. */}
          If you run a business, you've probably read an SEO report and felt like you needed a translator. You're not alone.
        </p>
        <p className="text-lg my-4">
          {/* When agencies hand non-technical founders reports full of "canonical redirects," "render-blocking scripts," and "LCP delays," it sounds like complete gibberish. To a client, an unexplained technical bug doesn't look like valuable work; it looks like an unneeded expense. */}
          This glossary takes the words agencies throw around — crawling, indexing, long-tail keywords, zero-click searches — and explains each one in plain English, with the business reason it matters, not just the technical one.
        </p>
        {/* <p className="text-lg my-4">
          This plain-English glossary rewrites 52 core SEO terms into plain business language. Bookmark this resource, send it to your clients, or use these exact definitions in your monthly reports to translate technical execution into clear business impact.</p> */}

        <h3 className="text-xl font-bold mt-6 mb-3">What you'll find inside:</h3>
        <ul className="my-2 list-disc rounded-lg" >
          <li>25+ core SEO terms in plain language</li>
          <li>A "what it means for your business" note on every entry</li>
          <li>Zero fluff. If a term doesn't help you make a decision, it's not here.</li>
        </ul>

        <div
                className="rounded-md p-5 text-center"
                style={{
                  backgroundColor: '#141e27',
                  border: '1px solid #263747',
                }}
              >
          <h3 className="text-xl text-white font-bold mt-6 mb-3">A small credibility band</h3>
          <p className="text-lg text-[#c1cfda] my-4">
            Built by the team behind <a href="https://outaudits.com" target="_blank" rel="noopener noreferrer" className="text-[#00a4c6] hover:underline">outaudits</a> — client-funded software that turns confusing SEO audits into reports people actually read.
          </p>

        </div>
        

        <h3 className="text-xl font-bold mt-6 mb-3">The "Why are words so confusing?" section</h3>
        <p className="text-lg my-4">
          Most SEO reports aren't confusing because they're wrong. They're confusing because they're written by specialists, for specialists.
        </p>

        <p className="text-lg my-4">
          You don't need to become an SEO expert. You need to know three things:
        </p>

        <ul className="my-2 list-disc rounded-lg" >
          <li>Can Google find your site? (Crawling, indexing, technical SEO)</li>
          <li>Are you answering what people search for? (Keywords, search intent, content)</li>
          <li>Is your reputation growing? (Authority, backlinks)</li>
        </ul>

        <p className="text-lg my-4">
          Everything else is detail. And this glossary explains the details when you need them.
        </p>


        
        <h2 className="text-2xl text-[#00a4c6] font-bold mt-8 mb-4">SEO Terms Explained</h2>
        
        <div style={{ marginTop: ".75rem", lineHeight: 1.5 }}>
            {Array.isArray(terms) ? (
                terms.map((item, index) => (
                    <div key={index} style={{ marginBottom: ".5rem" }}>
                        <dt><strong className="text-xl font-bold">{item.term}</strong></dt>
                        <dd>{item.definition}</dd>
                        <dd><em>{item.businessImpact}</em></dd>
                        
                    <div style={{ borderBottom: "1px solid #ccc", margin: "0.5rem 0" }}></div>
                </div>
            ))) : (
                <p>No terms available.</p>
            )}
        </div>
        
        
                
                
            </main>

            {/* Author Bio Card */}
            {/* <div
              className="mt-12 p-6 rounded-md flex flex-col sm:flex-row items-start gap-4"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e4e9ed',
              }}
            >
              <img
                src={article.metadata?.author?.avatar}
                alt={article.metadata?.author?.name}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium" style={{ color: '#141e27' }}>
                  Written by {article.metadata?.author?.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  {article.metadata?.author?.role}
                </p>
                <p
                  className="mt-2"
                  style={{ fontSize: 14, lineHeight: '22px', color: '#44576a' }}
                >
                  {article.metadata?.author?.bio || 'Expert in SEO strategy and agency operations. Passionate about helping agencies scale through automation and data-driven decision making.'}
                </p>
              </div>
            </div> */}

            {/* Nav: prev/next */}
            <div
              className="mt-8 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ borderTop: '1px solid #e4e9ed' }}
            >
              <Link
                href="/blog"
                className="flex items-center gap-2 text-sm bg-transparent border-none cursor-pointer hover:text-[#00a4c6] transition-colors"
                style={{ color: '#44576a' }}
              >
                <ArrowLeft className="w-4 h-4" />
                All Articles
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 text-sm font-medium bg-transparent border-none cursor-pointer hover:text-[#00a4c6] transition-colors"
                style={{ color: '#00a4c6' }}
              >
                Browse More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: '#44576a' }}>
                Download with your branding
              </h3>
              <p className="text-lg my-4">
                Get the glossary as a PDF you can send to clients, with your logo and colors. No signup required.
                </p>
              {/* White label modal */}
              <WhiteLabelForm />
              
              

              

              {/* CTA Card */}
              <div
                className="rounded-md p-5 text-center"
                style={{
                  backgroundColor: '#141e27',
                  border: '1px solid #263747',
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: '#ffffff' }}
                >
                  Ready to scale your agency?
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: '#c1cfda' }}
                >
                  Start generating white-label SEO reports in 30 seconds.
                </p>
                <Link href="/register" className="btn-primary inline-block mt-4 text-sm py-2.5 px-5">
                  Start Free Audit
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="content-container py-12 text-center">
      
      <p>Keep this glossary handy. Download it, bookmark it, or send it to your team — so the next time an agency says "we'll improve your E-E-A-T," you can smile and ask what that actually means.</p>

      <a href="/plain-english-seo-glossary.pdf" download className="text-[#00a4c6] inline-block mt-4 text-sm py-2.5 px-5">
        Get the free glossary →
      </a>

      <em>(Small print: no signup required. We'd rather earn your trust than your email.)</em>

      </div>
    
    </div>
    <Footer2 />
    </>
  );
}