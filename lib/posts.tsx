
import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content')

export type Post = {
    metadata : PostMetaData
    content : string
}

export type PostMetaData = {
    title?: string
    summary?: string
    image?: string
    author?: string
    publishedAt?: string
    slug: string
    tags?: string[]
    category?: string
}

export async function getPostBySlug(slug: string, category: string = 'blog-posts') : Promise<Post | null> {
    try{
        const filepath = path.join(postsDirectory, category, `${slug}.mdx`)
        console.log('Reading file:', filepath)
        const fileContent = await fs.readFileSync(filepath,{ encoding : 'utf-8'})
        const { data, content } = matter(fileContent)
        console.log('Parsed front matter:', data)
        return { metadata : { ...data, slug, category }, content }
    }catch(error){
        console.error('Error reading post:', error)
        return null
    }
}

export async function getAllPosts(category: string = 'blog-posts', limit?: number) : Promise<PostMetaData[]>{

        const directory = path.join(postsDirectory, category)
        const files = await fs.readdirSync(directory)
        const posts = files
        .map(file => getPostMetaData(file, category))
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

export function getPostMetaData(filepath: string, category: string): PostMetaData {
    const slug = filepath.replace(/\.mdx$/, '')
    const fileContent = fs.readFileSync(path.join(postsDirectory, category, filepath), { encoding: 'utf-8' })
    const { data } = matter(fileContent)
    return { ...data, slug }
}
