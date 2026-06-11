import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: post } = await supabase.from('Post').select('title').eq('id', id).single()
  return { title: post?.title ?? '게시글' }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params

  const { data: post } = await supabase
    .from('Post')
    .select('*, author:User(name, department), club:Club(id, name)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href={post.club ? `/clubs/${post.club.id}?tab=posts` : '/board'}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
        ← {post.club ? post.club.name : '게시판'} 목록으로
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          {post.isPinned && (
            <span className="inline-block text-xs font-bold text-white bg-primary px-2 py-1 rounded mb-3">공지</span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {post.author.name[0]}
            </div>
            <div>
              <span className="font-medium text-gray-700">{post.author.name}</span>
              {post.author.department && <span className="text-gray-400"> · {post.author.department}</span>}
              <span className="text-gray-400"> · {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  )
}
