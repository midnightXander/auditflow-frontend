import { getAllPosts } from '@/lib/posts'
import React from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import BaseHeader from '@/components/base-header'
import { Metadata } from 'next'
// import { useAuth } from '@/lib/auth-context'

// export const metadata: Metadata = {
//     title: 'Use Cases - AuditFlow',
//     description: 'Discover how to leverage AuditFlow for your business growth with our comprehensive use cases.',
// }

export default async function UseCases(){
    // const {user} = useAuth() 
    const posts = await getAllPosts('use-cases')
    
    // Sort so featured/latest come first (if your posts include `featured` flag, otherwise by date)
    const sorted = [...posts].sort((a, b) => {
        if ((b.publishedAt || '') > (a.publishedAt || '')) return 1
        if ((b.publishedAt || '') < (a.publishedAt || '')) return -1
        return 0
    })

    const featured = sorted[0]
    const others = sorted.slice(1)

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            <BaseHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Use Cases</h1>
                        <p className="mt-3 text-lg text-slate-600 max-w-2xl">Real examples of how agencies and in-house teams use OUTAudits to deliver fast, client-ready SEO audits that convert. Browse case studies, templates and practical workflows.</p>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="sr-only">Search</label>
                                <div className="relative">
                                    <input type="search" placeholder="Search use cases (e.g. agencies, ecommerce, SaaS)" className="w-full rounded-lg border border-gray-200 shadow-sm px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">Search</button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href="/register" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold shadow hover:opacity-95">Try OUTAudits</Link>
                                <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm">View pricing</Link>
                            </div>
                        </div>
                    </div>

                    <aside className="hidden lg:block p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900">Why OUTAudits for agencies</h3>
                        <p className="text-xs text-gray-600 mt-2">Ship branded audits in minutes, automate repetitive checks and generate PDF reports your clients love.</p>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li className="flex items-start gap-3"><span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500"/> White-label PDFs</li>
                            <li className="flex items-start gap-3"><span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500"/> Client-ready executive summaries</li>
                            <li className="flex items-start gap-3"><span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500"/> Downloadable branded reports</li>
                        </ul>

                        <div className="mt-6">
                            <Link href="/contact" className="block text-center text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">Talk to sales</Link>
                        </div>
                    </aside>
                </section>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <section className="lg:col-span-3 space-y-6">

                        {/* Featured */}
                        {featured && (
                            <article className="p-6 bg-gradient-to-r from-white to-slate-50 rounded-2xl border border-gray-100 shadow hover:shadow-md transition">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="w-full sm:w-48 h-36 bg-gradient-to-br from-blue-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">Featured</div>

                                    <div className="flex-1">
                                        <Link href={`/use-cases/${featured.slug}`} className="text-2xl font-bold text-slate-900 hover:underline">{featured.title}</Link>
                                        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{featured.summary}</p>

                                        <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                                            {featured.publishedAt && <span>{formatDate(featured.publishedAt)}</span>}
                                            {/* {featured.readingTime && <span> · {featured.readingTime} min read</span>} */}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {(featured.tags || []).slice(0,5).map((t: string) => (
                                                <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* Others grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {others.map(post => (
                                <article key={post.slug} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-12 bg-slate-50 rounded-md flex items-center justify-center text-slate-400 text-sm font-medium">Img</div>
                                        <div className="flex-1">
                                            <Link href={`/use-cases/${post.slug}`} className="font-semibold text-slate-900 hover:underline">{post.title}</Link>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.summary}</p>

                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                                                    {/* {post.readingTime && <span>· {post.readingTime} min</span>} */}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {(post.tags || []).slice(0,3).map((t: string) => (
                                                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                    </section>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-semibold">Popular use cases</h4>
                                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                    {posts.slice(0,5).map(p => (
                                        <li key={p.slug} className="flex items-center justify-between">
                                            <Link href={`/use-cases/${p.slug}`} className="hover:underline">{p.title}</Link>
                                            <span className="text-xs text-gray-400">{p.publishedAt ? formatDate(p.publishedAt) : ''}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-gray-100">
                                <h4 className="text-sm font-semibold">Need a template?</h4>
                                <p className="text-xs text-gray-600 mt-2">Download our free audit checklist template to speed up client reporting.</p>
                                <div className="mt-3">
                                    <Link href="/resources/audit-checklist.pdf" className="block text-center text-sm font-semibold bg-blue-600 text-white px-3 py-2 rounded-lg">Download</Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

            </main>
        </div>
    )
}