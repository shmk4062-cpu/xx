import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { formatDate, CATEGORY_LABELS } from '@/lib/utils'

export const metadata: Metadata = { title: '마이페이지' }

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: '검토 중', className: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: '승인', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: '거절', className: 'bg-red-100 text-red-700' },
}

export default async function DashboardPage() {
  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: memberRows }, { data: applications }] = await Promise.all([
    supabase.from('ClubMember').select('*, club:Club(*)').eq('userId', user.id).order('joinedAt', { ascending: false }),
    supabase.from('JoinApplication').select('*, club:Club(id, name, category)').eq('userId', user.id).order('createdAt', { ascending: false }),
  ])

  const { data: memberCounts } = await supabase.from('ClubMember').select('clubId')
  const countMap: Record<string, number> = {}
  memberCounts?.forEach((m) => { countMap[m.clubId] = (countMap[m.clubId] || 0) + 1 })

  const memberships = (memberRows ?? []).map((m) => ({
    ...m,
    club: { ...m.club, memberCount: countMap[m.club.id] || 0 },
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">마이페이지</h1>
        <p className="text-gray-500">
          안녕하세요, <span className="text-primary font-medium">{user.user_metadata?.name ?? user.email}</span>님!
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">내 동아리</h2>
        {memberships.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
            <span className="text-3xl block mb-2">🏃</span>
            <p className="mb-4">아직 가입한 동아리가 없습니다.</p>
            <Link href="/clubs" className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm">
              동아리 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberships.map((m) => (
              <Link key={m.id} href={`/clubs/${m.club.id}`}
                className="rounded-xl border border-gray-200 p-5 bg-white hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{m.club.name}</span>
                  {m.memberRole === 'LEADER' && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">리더</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">{CATEGORY_LABELS[m.club.category]}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>👥 {m.club.memberCount}명</span>
                  <span>가입 {formatDate(m.joinedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">신청 현황</h2>
        {!applications?.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
            <span className="text-3xl block mb-2">📝</span>
            <p>신청 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => {
              const status = STATUS_LABELS[app.status] ?? { label: app.status, className: '' }
              return (
                <div key={app.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 bg-white">
                  <div>
                    <Link href={`/clubs/${app.club.id}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {app.club.name}
                    </Link>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {CATEGORY_LABELS[app.club.category]} · 신청일 {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>{status.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
