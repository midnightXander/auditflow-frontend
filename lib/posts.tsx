
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content')

export type Post = {
    metadata : PostMetaData
    content : string
}

export const categories = ['All', 'Technical SEO', 'Strategy', 'Agency Tips', 'Performance'];

export type PostMetaData = {
    title?: string
    summary?: string
    image?: string
    author?: {
        name?: string
        avatar?: string
        bio?: string
        role?: string
    }
    publishedAt?: string
    slug: string
    tags?: string[]
    category?: string
    type?: string
    featured?: boolean
    excerpt?: string
    readTime?: string
}

export async function getPostBySlug(slug: string, type: string = 'blog-posts') : Promise<Post | null> {
    try{
        const filepath = path.join(postsDirectory, type, `${slug}.mdx`)
        console.log('Reading file:', filepath)
        const fileContent = await fs.readFileSync(filepath,{ encoding : 'utf-8'})
        const { data, content } = matter(fileContent)
        console.log('Parsed front matter:', data)
        return { metadata : { ...data, slug, type }, content }
    }catch(error){
        console.error('Error reading post:', error)
        return null
    }
}

export async function getAllPosts(type: string = 'blog-posts', limit?: number) : Promise<PostMetaData[]>{

        const directory = path.join(postsDirectory, type)
        const files = await fs.readdirSync(directory)
        const posts = files
        .map(file => getPostMetaData(file, type))
        .sort((a,b) => {
            if(new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) return 1
            if(new Date(a.publishedAt ?? '') > new Date(b.publishedAt ?? '')) return -1
            return 0
        })

        if(limit){
            return posts.slice(0, limit)
        }
        
        // const posts = await Promise.all(files.map(async (file) => {
        //     const slug = file.replace(/\.mdx$/, '')
        //     const post = await getPostBySlug(slug)
        //     return post?.metadata
        // }))
        // return posts.filter(Boolean).slice(0, limit)
        return posts
}

export function getPostMetaData(filepath: string, type: string): PostMetaData {
    const slug = filepath.replace(/\.mdx$/, '')
    const fileContent = fs.readFileSync(path.join(postsDirectory, type, filepath), { encoding: 'utf-8' })
    const { data } = matter(fileContent)
    return { ...data, slug }
}

export async function getRelatedArticles(currentSlug: string, limit = 3) {
    const current = await getPostBySlug(currentSlug);
    const articles = (await getAllPosts(current?.metadata.type || 'blog-posts')).filter((a) => a.slug !== currentSlug);
  if (!current) return articles.slice(0, limit);
  return articles
    .filter((a) => a.slug !== currentSlug && a.category === current.metadata.category)
    .slice(0, limit)
    .length > 0
    ? articles.filter((a) => a.slug !== currentSlug && a.category === current.metadata.category).slice(0, limit)
    : articles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}