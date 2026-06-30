import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/posts'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await getPostBySlug(slug, 'blog-posts')

    if (!post) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (err) {
    console.error('/api/posts/[slug] error', err)

    return NextResponse.json(
      { error: 'Unable to read post' },
      { status: 500 }
    )
  }
}