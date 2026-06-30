import type { Metadata } from "next";
import BlogArticleComponent from "./articleComponent";
import { getAllPosts, getPostBySlug, getRelatedArticles } from '@/lib/posts'
import Link from 'next/link';
import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'
import Logo from '@/components/logo'
export const generateStaticParams = async () => {
    const posts = await getAllPosts('blog-posts')
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export const generateMetadata = async ({params}: {params: {slug: string}}): Promise<Metadata> => {
    const {slug} = await params
    console.log("metadata slug: ", slug)
    const post = await getPostBySlug(slug, 'blog-posts')
    
    if (!post) {
        return {
            title: 'Not Found - OUTAudits Blog',
            description: 'This blog article could not be found.'
        }
    }
    
    const {title, summary} = post.metadata
    return {
        title: `${title} - OUTAudits Blog`,
        description: summary || 'Read insights and strategies for growing your agency or freelance SEO business with OUTAudits.'
    }
}


export default async function BlogArticle({params} : {params: {slug: string}} ) {
    const {slug} = await params
    const post = await getPostBySlug(slug, 'blog-posts')
    const related = await getRelatedArticles(slug)

    if (!post) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <BaseHeader />
        <div className="content-container text-center py-40">
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#141e27' }}>
            Article Not Found
          </h1>
          <p className="mt-2" style={{ color: '#44576a' }}>
            The article you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="btn-primary inline-block mt-6"
          >
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

    return (
        <>
        <BaseHeader />
        <BlogArticleComponent article={post} related={related} />
        <Footer />
        </>
    )
}