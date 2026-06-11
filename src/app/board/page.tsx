import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: '게시판' }

export default async function BoardPage() {
  const { data: posts } = await supabase
    .from('Post')
    .select('*, author:User(name, department)')
    .is('clubId', null)
    .order('isPinned', { ascending: false })
    .order('createdAt', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">게시판</h1>
        <p className="text-gray-500">전체 공지사항 및 자유게시판입니다.</p>
      </div>

      {!posts?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-4xl mb-3">📋</span>
          <p>게시글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 bg-white hover:border-primary/40 hover:shadow-sm transition-all group">
              {post.isPinned && (
                <span className="flex-shrink-0 text-xs font-bold text-white bg-primary px-2 py-1 rounded">공지</span>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate group-hover:text-primary transition-colors ${post.isPinned ? 'text-gray-900' : 'text-gray-800'}`}>
                  {post.title}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {post.author.name}{post.author.department && ` · ${post.author.department}`}
                </p>
              </div>
              <span className="flex-shrink-0 text-sm text-gray-400">{formatDate(post.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
