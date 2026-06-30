import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  try {
    const posts = await getAllPosts('blog-posts')
    return NextResponse.json(posts)
  } catch (error) {
    console.error('/api/posts error', error)
    return NextResponse.json({ error: 'Unable to read posts' }, { status: 500 })
  }
}