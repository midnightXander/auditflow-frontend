import React from "react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// import { MDXRemote } from "next-mdx-remote/rsc";
import { formatDate } from "@/lib/utils";
// import { ArrowLeftIcon } from "@radix-ui/react-icons";
// import MDXContent from "@/components/mdx-content";
import SEO from "@/components/seo";
import type { Metadata } from "next";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
export const generateStaticParams = async () => {
    const posts = await getAllPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}
import MDXContent from "@/components/mdxContent"


export default async function Post({params} : {params: {slug: string}} ){
    const {slug} = await params
    const post = await getPostBySlug(slug, 'use-cases')
    console.log('Fetched post for slug:', slug, post)

    if(!post){
        console.log('Post not found:', slug)
        notFound()
    }

    const { metadata, content } = post
    const {title, image, author, publishedAt, summary, tags } = metadata
    console.log('publishedAt:', publishedAt)
    
    const text = content || ''
    const wordCount = text.split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.round(wordCount / 200))
    
    return (
        <section className="pb-24 pt-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-6">
                    <Link href="/use-cases" className="text-sm text-gray-500 hover:text-gray-700">← Back to use cases</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <article className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {image && (
                            <div className="relative h-72 w-full">
                                <Image src={image} alt={title || ''} fill className="object-cover" />
                            </div>
                        )}

                        <div className="p-8">
                            <header>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{title}</h1>
                                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                                    <span>{author || 'OUTAudits'}</span>
                                    {publishedAt && <span>· {formatDate(publishedAt ?? '')}</span>}
                                    <span>· {readingTime} min read</span>
                                </div>

                                {tags && tags.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tags.map((t: string) => (
                                            <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                                        ))}
                                    </div>
                                )}

                                {summary && <p className="mt-6 text-sm text-slate-600">{summary}</p>}
                            </header>

                            <main className="prose prose-sm sm:prose lg:prose-lg mt-8 max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                    components={{
                                        a: ({node, ...props}) => (
                                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                                        ),
                                        h1 : ({node, ...props}) => (
                                          <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />
                                        ),
                                        h2 : ({node, ...props}) => (
                                          <h2 {...props} className="text-2xl font-bold mt-4 mb-2" />
                                        ), 
                                        h3 : ({node, ...props}) => (
                                          <h3 {...props} className="text-xl font-bold mt-2 mb-2" />
                                        ), 
                                        p: ({node, ...props}) => <p className="text-base text-gray-700 my-2" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                                        em: ({node, ...props}) => <em className="italic" {...props} />,
                                        img : ({node, ...props}) => (
                                                <img {...props}  className="my-2 rounded-lg"
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
                                    {content || ''}
                                </ReactMarkdown>
                                {/* <MDXContent source={content} /> */}
                                
                            </main>

                            <footer className="mt-10 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-600">Enjoyed this use case? Share it with a colleague.</div>
                                <div className="flex items-center gap-3">
                                    <Link href="/register" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Try OUTAudits</Link>
                                    <a href="#" className="text-sm text-gray-500 underline">Print</a>
                                </div>
                            </footer>
                        </div>
                    </article>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-semibold">About the author</h4>
                                <p className="mt-2 text-xs text-gray-600">{author || 'OUTAudits team'}</p>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-semibold">Article details</h4>
                                <ul className="mt-3 text-xs text-gray-600 space-y-2">
                                    {publishedAt && <li><strong>Published:</strong> <span className="ml-2">{formatDate(publishedAt ?? '')}</span></li>}
                                    <li><strong>Reading time:</strong> <span className="ml-2">{readingTime} min</span></li>
                                    <li><strong>Words:</strong> <span className="ml-2">{wordCount}</span></li>
                                </ul>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-gray-100">
                                <h4 className="text-sm font-semibold">Need this for a client?</h4>
                                <p className="text-xs text-gray-600 mt-2">Use OUTAudits to quickly create a branded audit and deliver it as a PDF report.</p>
                                <div className="mt-3">
                                    <Link href="/pricing" className="block text-center text-sm font-semibold bg-blue-600 text-white px-3 py-2 rounded-lg">Get started</Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}