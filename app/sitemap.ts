import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const BASE_URL = 'https://outaudits.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/audit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/crawl`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rank-tracking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/keywords`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/backlinks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/use-cases`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts('blog-posts')
    blogPosts = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Dynamic use case articles
  let useCasePages: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts('use-cases')
    useCasePages = posts.map((post) => ({
      url: `${BASE_URL}/use-cases/${post.slug}`,
      lastModified: new Date(post.publishedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching use cases for sitemap:', error)
  }

  return [...staticPages, ...blogPosts, ...useCasePages]
}
