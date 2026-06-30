'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import BaseHeader from '@/components/base-header'
import { Metadata } from 'next'
import gsap from 'gsap';
import { ArrowRight, Search, Mail } from 'lucide-react';

const categories = ['All', 'Technical SEO', 'Strategy', 'Agency Tips', 'Performance'];

export default function BlogComponent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadPosts() {
      try {
        const res = await fetch('/api/posts')
        if (!res.ok) throw new Error('Failed to fetch posts')
        const data = await res.json()
        console.log('Fetched posts:', data)
        if (mounted) setArticles(data || [])
      } catch (err) {
        console.error('Error fetching posts:', err)
        if (mounted) setArticles([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadPosts()
    return () => { mounted = false }
  }, [])

  // Sort so featured/latest come first (if your posts include `featured` flag, otherwise by date)
  const sorted = [...articles].sort((a, b) => {
      if ((b.publishedAt || '') > (a.publishedAt || '')) return 1
      if ((b.publishedAt || '') < (a.publishedAt || '')) return -1
      return 0
  })

  // const featured = sorted[0]
  // const others = sorted.slice(1)

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = articles.find((a) => a.featured);
  const regular = filtered.filter((a) => a.slug !== featured?.slug);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   const ctx = gsap.context(() => {
  //     gsap.fromTo(
  //       '.blog-hero-content > *',
  //       { y: 30, opacity: 0 },
  //       { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power2.out' }
  //     );
  //   }, heroRef);
  //   return () => ctx.revert();
  // }, []);

  // useEffect(() => {
  //   if (!gridRef.current) return;
  //   const ctx = gsap.context(() => {
  //     gsap.fromTo(
  //       '.blog-card',
  //       { y: 25, opacity: 0 },
  //       { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
  //     );
  //   }, gridRef);
  //   return () => ctx.revert();
  // }, [activeCategory, searchQuery]);

  return (
    <div className='relative' style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* <Header /> */}

      {/* Hero */}
      <section
        // ref={heroRef}
        style={{
          backgroundColor: '#141e27',
          padding: '160px 0 80px',
          borderBottom: '1px solid #263747',
        }}
      >
        <div className="container mx-auto blog-hero-content">
          <p className="section-label text-main text-primary mb-4">OUTAUDITS BLOG</p>
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.2px',
              color: '#ffffff',
              maxWidth: 600,
            }}
          >
            Insights for SEO Agencies
          </h1>
          <p
            className="mt-4"
            style={{
              fontSize: 17,
              lineHeight: '28px',
              color: '#c1cfda',
              maxWidth: 520,
            }}
          >
            Practical guides, strategies, and tips to help your agency deliver
            better results and grow faster.
          </p>

          {/* Search */}
          <div
            className="mt-8 flex items-center gap-3 px-4 py-3 rounded max-w-md"
            style={{ backgroundColor: '#263747', border: '1px solid #374c63' }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#44576a' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-[#44576a]"
              style={{ color: '#ffffff' }}
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="mx-auto container -mt-6 relative z-10">
        <div
          className="flex flex-wrap gap-2 p-2 rounded"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e9ed' }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 cursor-pointer border-none"
              style={{
                backgroundColor: activeCategory === cat ? '#00a4c6' : 'transparent',
                color: activeCategory === cat ? '#ffffff' : '#44576a',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      {featured && !searchQuery && activeCategory === 'All' && (
        <section className="container  mx-auto mt-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-white rounded overflow-hidden transition-all duration-300 hover:shadow-[0px_19px_38px_rgba(0,0,0,0.1)]"
            style={{ border: '1px solid #e4e9ed' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full  object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ minHeight: 300 }}
                />
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: '#00a4c6' }}
                >
                  Featured
                </span>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#00a4c6' }}
                >
                  {featured.category}
                </span>
                <h2
                  className="mt-3 group-hover:text-[#00a4c6] transition-colors duration-200"
                  style={{
                    fontSize: 'clamp(22px, 2.5vw, 28px)',
                    fontWeight: 700,
                    lineHeight: '36px',
                    letterSpacing: '-0.5px',
                    color: '#141e27',
                  }}
                >
                  {featured.title}
                </h2>
                <p
                  className="mt-3"
                  style={{ fontSize: 15, lineHeight: '24px', color: '#44576a' }}
                >
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <img
                    src={featured.author?.avatar || ''}
                    alt={featured.author?.name || ''}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#141e27' }}>
                      {featured.author?.name || 'Author'}
                    </p>
                    <p className="text-xs" style={{ color: '#44576a' }}>
                      {featured?.publishedAt} &middot; {featured?.readTime}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: '#00a4c6' }}>
                  Read Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Article Grid */}
      <section 
    //   ref={gridRef} 
      className="container  mx-auto mt-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery || activeCategory !== 'All' ? filtered : regular).map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="blog-card group bg-white rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_14px_28px_rgba(0,0,0,0.08)]"
              style={{ border: '1px solid #e4e9ed', 
                // opacity: 0
               }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: '#00a4c6' }}
                >
                  {article.category}
                </span>
                <h3
                  className="mt-2 group-hover:text-[#00a4c6] transition-colors duration-200 line-clamp-2"
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    lineHeight: '24px',
                    color: '#141e27',
                  }}
                >
                  {article.title}
                </h3>
                <p
                  className="mt-2 line-clamp-2"
                  style={{ fontSize: 14, lineHeight: '22px', color: '#44576a' }}
                >
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #f5f7fa' }}>
                  <img
                    src={article?.author?.avatar || ''}
                    alt={article?.author?.name || ''}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#141e27' }}>
                      {article?.author?.name || 'Author'}
                    </p>
                  </div>
                  <span className="text-[11px] flex-shrink-0" style={{ color: '#8896a4' }}>
                    {article?.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p style={{ fontSize: 16, color: '#44576a' }}>
              No articles found matching your criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto container pb-20">
        <div
          className="rounded p-8 lg:p-12 text-center"
          style={{
            backgroundColor: '#141e27',
            border: '1px solid #263747',
          }}
        >
          <Mail className="w-10 h-10 mx-auto text-[#00a4c6]" />
          <h2
            className="mt-4"
            style={{
              fontSize: 'clamp(22px, 2.5vw, 28px)',
              fontWeight: 700,
              lineHeight: '36px',
              color: '#ffffff',
            }}
          >
            Get SEO Insights Delivered
          </h2>
          <p
            className="mt-2 mx-auto"
            style={{ fontSize: 15, lineHeight: '24px', color: '#c1cfda', maxWidth: 440 }}
          >
            Join 8,000+ agency professionals who receive our weekly SEO tips,
            strategies, and product updates.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{
                backgroundColor: '#263747',
                border: '1px solid #374c63',
                color: '#ffffff',
              }}
            />
            <button className="btn-primary whitespace-nowrap w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
