'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { ArrowRight, Search, Mail } from 'lucide-react';
import  gsap from 'gsap'

const categories = ['All', 'Technical SEO', 'Strategy', 'Agency Tips', 'Performance'];

export default function RecentArticles() {
 
  const sectionRef = useRef<HTMLDivElement>(null);
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
        // console.log('Fetched posts:', data)
        //limit to maximimum 3 articles
        if (mounted){
            const sorted = [...data].sort((a, b) => {
                if ((b.publishedAt || '') > (a.publishedAt || '')) return 1
                if ((b.publishedAt || '') < (a.publishedAt || '')) return -1
                return 0
            })
            setArticles(sorted?.slice(0, 3) || [])
        } 
        

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


  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-card',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);


  

  return (
    <section
      id="recent-articles"
      ref={sectionRef}
      style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
    <div className="content-container">
        <div className="text-center mb-20 max-md:mb-10">
          {/* <p className="section-label mb-4">Latest From Our Blog</p> */}
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.1px',
              color: '#141e27',
            }}
          >
            Latest From Our Blog
          </h2>
          <p
            className="mt-4"
            style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}
          >
            Scale Your Agency with Unique Insights and Tips from Our Experts
          </p>

        </div>  
        {/* Article Grid */}
        <div 
              ref={gridRef} 
              className="container  mx-auto mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
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
        
                {articles.length === 0 && (
                  <div className="text-center py-20">
                    <p style={{ fontSize: 16, color: '#44576a' }}>
                      No articles found.
                    </p>
                  </div>
                )}
        </div>


    </div>

    </section>
  );
}
