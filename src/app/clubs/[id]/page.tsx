import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import { formatDate, CATEGORY_LABELS } from '@/lib/utils'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: club } = await supabase.from('Club').select('name').eq('id', id).single()
  return { title: club?.name ?? '동아리' }
}

export default async function ClubDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const { tab = 'about' } = await searchParams
  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()

  const [{ data: club }, { data: memberRows }, { data: posts }] = await Promise.all([
    supabase.from('Club').select('*').eq('id', id).single(),
    supabase.from('ClubMember').select('*, user:User(id, name, department)').eq('clubId', id).order('memberRole').order('joinedAt'),
    supabase.from('Post').select('*, author:User(name)').eq('clubId', id).order('createdAt', { ascending: false }).limit(20),
  ])

  if (!club) notFound()

  const members = memberRows ?? []
  const memberCount = members.length

  const isMember = user?.id ? members.some((m) => m.userId === user.id) : false

  const hasApplied = user?.id
    ? (await supabase.from('JoinApplication').select('id').eq('clubId', id).eq('userId', user.id).single()).data !== null
    : false

  const CATEGORY_BG: Record<string, string> = {
    SPORTS: 'from-orange-400 to-orange-600',
    READING: 'from-green-400 to-green-600',
    PHOTO: 'from-purple-400 to-purple-600',
    MUSIC: 'from-pink-400 to-pink-600',
    COOKING: 'from-yellow-400 to-yellow-600',
    TRAVEL: 'from-blue-400 to-blue-600',
    GAME: 'from-indigo-400 to-indigo-600',
    ART: 'from-red-400 to-red-600',
  }
  const gradient = CATEGORY_BG[club.category] ?? 'from-primary to-primary-dark'

  const ICONS: Record<string, string> = {
    SPORTS: '⛰️', READING: '📚', PHOTO: '📷', MUSIC: '🎸',
    COOKING: '🍳', TRAVEL: '✈️', GAME: '🎲', ART: '🎨',
  }

  const tabs = [
    { key: 'about', label: '소개' },
    { key: 'members', label: `멤버 (${memberCount})` },
    { key: 'posts', label: `게시글 (${posts?.length ?? 0})` },
  ]

  return (
    <div>
      <div className={`bg-gradient-to-br ${gradient} text-white py-16`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-5xl">
              {ICONS[club.category] ?? '🏢'}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge category={club.category} className="bg-white/20 text-white border-0" />
              </div>
              <h1 className="text-3xl font-bold mb-1">{club.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>👥 {memberCount}명 / 최대 {club.maxMembers}명</span>
                <span>📅 {formatDate(club.createdAt)}</span>
              </div>
            </div>
            <div>
              {!user ? (
                <Link href="/login" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                  로그인 후 가입 신청
                </Link>
              ) : isMember ? (
                <span className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/30">✓ 가입된 동아리</span>
              ) : hasApplied ? (
                <span className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/30">⏳ 신청 검토 중</span>
              ) : (
                <Link href={`/apply/${club.id}`} className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
                  가입 신청하기
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <Link key={t.key} href={`/clubs/${id}?tab=${t.key}`}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {tab === 'about' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">동아리 소개</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{club.description}</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-primary">{memberCount}</p>
                <p className="text-sm text-gray-500 mt-1">현재 멤버</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-primary">{club.maxMembers}</p>
                <p className="text-sm text-gray-500 mt-1">최대 정원</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-lg font-bold text-primary">{CATEGORY_LABELS[club.category]}</p>
                <p className="text-sm text-gray-500 mt-1">카테고리</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">멤버 목록</h2>
            {members.length === 0 ? (
              <p className="text-gray-500">멤버가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 bg-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                      {m.user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {m.user.name}
                        {m.memberRole === 'LEADER' && <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">리더</span>}
                      </p>
                      {m.user.department && <p className="text-xs text-gray-400">{m.user.department}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'posts' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">게시글</h2>
            {!posts?.length ? (
              <p className="text-gray-500">게시글이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/board/${post.id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 bg-white hover:border-primary/40 hover:shadow-sm transition-all">
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{post.author.name} · {formatDate(post.createdAt)}</p>
                    </div>
                    <span className="text-gray-300 text-lg">›</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
