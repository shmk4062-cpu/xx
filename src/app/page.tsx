import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ClubGrid from '@/components/clubs/ClubGrid'

export default async function Home() {
  const { data: clubs } = await supabase
    .from('Club')
    .select('*')
    .eq('isActive', true)
    .order('createdAt', { ascending: true })
    .limit(8)

  const { data: memberRows } = await supabase.from('ClubMember').select('clubId')
  const countMap: Record<string, number> = {}
  memberRows?.forEach((m) => { countMap[m.clubId] = (countMap[m.clubId] || 0) + 1 })

  const clubsData = (clubs ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
    memberCount: countMap[c.id] || 0,
    maxMembers: c.maxMembers,
  }))

  const totalClubs = clubs?.length ?? 0
  const totalMembers = memberRows?.length ?? 0

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-20 h-64 w-64 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/2 h-32 w-32 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span>🏢</span>
              <span>삼천리 임직원 전용</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              함께하는 즐거움,<br />
              <span className="text-blue-200">삼천리 동아리</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              취미를 공유하고 동료와 친해지세요.<br />
              삼천리 구성원을 위한 사내 동아리 커뮤니티입니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                동아리 둘러보기 →
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                지금 가입하기
              </Link>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="relative border-t border-white/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-bold text-2xl">{totalClubs}</span>
                <span className="ml-1 text-blue-200">개 동아리</span>
              </div>
              <div>
                <span className="font-bold text-2xl">{totalMembers}</span>
                <span className="ml-1 text-blue-200">명 활동 중</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 동아리 목록 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">인기 동아리</h2>
            <p className="mt-1 text-gray-500">지금 바로 참여할 수 있는 동아리를 찾아보세요</p>
          </div>
          <Link
            href="/clubs"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <ClubGrid clubs={clubsData} emptyMessage="등록된 동아리가 없습니다." />
      </section>

      {/* CTA 배너 */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">원하는 동아리가 없나요?</h2>
          <p className="text-gray-500 mb-6">게시판에 새로운 동아리 개설을 제안해보세요.</p>
          <Link
            href="/board"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            게시판 바로가기
          </Link>
        </div>
      </section>
    </div>
  )
}
