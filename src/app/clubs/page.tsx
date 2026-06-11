import { Suspense } from 'react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import ClubGrid from '@/components/clubs/ClubGrid'
import ClubFilter from '@/components/clubs/ClubFilter'

export const metadata: Metadata = { title: '동아리' }

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ClubsPage({ searchParams }: Props) {
  const { category } = await searchParams

  let query = supabase.from('Club').select('*').eq('isActive', true).order('createdAt', { ascending: true })
  if (category) query = query.eq('category', category)

  const { data: clubs } = await query
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">동아리</h1>
        <p className="text-gray-500">삼천리 구성원이 만든 다양한 동아리에 참여해보세요.</p>
      </div>

      <div className="mb-6">
        <Suspense>
          <ClubFilter />
        </Suspense>
      </div>

      <ClubGrid
        clubs={clubsData}
        emptyMessage="해당 카테고리의 동아리가 없습니다."
      />
    </div>
  )
}
