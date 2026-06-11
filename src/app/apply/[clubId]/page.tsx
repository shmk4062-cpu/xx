import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import ApplicationForm from '@/components/applications/ApplicationForm'

type Props = { params: Promise<{ clubId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clubId } = await params
  const { data: club } = await supabase.from('Club').select('name').eq('id', clubId).single()
  return { title: `${club?.name ?? '동아리'} 가입 신청` }
}

export default async function ApplyPage({ params }: Props) {
  const { clubId } = await params

  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/login')

  const { data: club } = await supabase.from('Club').select('*').eq('id', clubId).single()
  if (!club) notFound()

  const [{ data: isMember }, { data: hasApplied }] = await Promise.all([
    supabase.from('ClubMember').select('id').eq('clubId', clubId).eq('userId', user.id).single(),
    supabase.from('JoinApplication').select('id').eq('clubId', clubId).eq('userId', user.id).single(),
  ])

  if (isMember) redirect(`/clubs/${clubId}`)
  if (hasApplied) redirect('/dashboard')

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href={`/clubs/${clubId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
        ← {club.name}으로 돌아가기
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{club.name} 가입 신청</h1>
          <p className="text-sm text-gray-500">가입 신청 후 동아리 리더의 승인을 받아야 활동할 수 있습니다.</p>
        </div>
        <ApplicationForm clubId={clubId} clubName={club.name} />
      </div>
    </div>
  )
}
