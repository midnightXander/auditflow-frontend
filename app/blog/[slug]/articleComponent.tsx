import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/seo';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
} from 'lucide-react';

export default function BlogArticleComponent({ article, related }: { article: any, related: any[] }) {
  if (!article) return null

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Article Hero */}
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
              {article.metadata.category}
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
              {article.metadata.title}
            </h1>

            <p
              className="mt-4"
              style={{
                fontSize: 17,
                lineHeight: '28px',
                color: '#c1cfda',
              }}
            >
              {article.metadata.summary}
            </p>

            {/* Author row */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pb-10">
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
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="content-container pb-0">
          <div className="rounded-t-md overflow-hidden" style={{ marginBottom: -2 }}>
            <img
              src={article.metadata.image}
              alt={article.metadata.title}
              className="w-full object-cover"
              // style={{ maxHeight: 420 }}
            />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
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
                title="Copy link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content blocks */}
            <main className="prose prose-sm sm:prose lg:prose-lg mt-8 max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                        a: ({node, ...props}) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                        ),
                        h1 : ({node, ...props}) => (
                            <h1 {...props} className="text-3xl text-[#00a4c6] font-bold mt-8 mb-4" />
                        ),
                        h2 : ({node, ...props}) => (
                            <h2 {...props} className="text-2xl text-[#00a4c6] font-bold mt-4 mb-2" />
                        ), 
                        h3 : ({node, ...props}) => (
                            <h3 {...props} className="text-xl text-[#00a4c6] font-bold mt-2 mb-2" />
                        ), 
                        thead: ({node, ...props}) => <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white" {...props} />,
                        th: ({node, ...props}) => <th className="px-2 py-2 text-left font-bold" {...props} />,
                        tr: ({node, ...props}) => <tr className="px-2 py-4 font-bold border-b-2 border-gray-300" {...props} />,
                        p: ({node, ...props}) => <p className="text-base text-gray-700 my-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        img : ({node, ...props}) => (
                                <img {...props}  className="my-4 rounded-xl"
                                />
                            ),
                        ul : ({node, ...props}) => (
                                <ul {...props}  className="my-2 list-disc rounded-lg"/>
                            ),    
                        code: ({node, inline, className, children, ...props}: any) =>
                            inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                            <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                    }}
                >
                    {article.content || ''}
                </ReactMarkdown>
                {/* <MDXContent source={content} /> */}
                
            </main>

            {/* Author Bio Card */}
            <div
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
            </div>

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
              {/* Related Articles */}
              <div
                className="rounded-md p-5"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e9ed',
                }}
              >
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#141e27' }}
                >
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-16 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div>
                        <p
                          className="text-sm font-medium line-clamp-2 group-hover:text-[#00a4c6] transition-colors"
                          style={{ color: '#141e27' }}
                        >
                          {r.title}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#8896a4' }}>
                          {r.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div
                className="rounded-md p-5"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e9ed',
                }}
              >
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#141e27' }}
                >
                  Categories
                </h3>
                <div className="space-y-2">
                  {['Technical SEO', 'Strategy', 'Agency Tips', 'Performance'].map(
                    (cat) => (
                      <Link
                        key={cat}
                        href="/blog"
                        className="flex items-center justify-between text-sm py-1.5 group"
                      >
                        <span
                          className="group-hover:text-[#00a4c6] transition-colors"
                          style={{ color: '#44576a' }}
                        >
                          {cat}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" style={{ color: '#00a4c6' }} />
                      </Link>
                    )
                  )}
                </div>
              </div>

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

      {/* <Footer /> */}
    </div>
  );
}