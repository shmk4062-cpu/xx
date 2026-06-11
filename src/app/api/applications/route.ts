import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabaseAuth = await createClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  try {
    const { clubId, motivation } = await req.json()

    if (!clubId || !motivation?.trim()) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 })
    }

    const { data: club } = await supabase.from('Club').select('id').eq('id', clubId).single()
    if (!club) return NextResponse.json({ error: '동아리를 찾을 수 없습니다.' }, { status: 404 })

    const { data: existing } = await supabase.from('JoinApplication').select('id').eq('clubId', clubId).eq('userId', user.id).single()
    if (existing) return NextResponse.json({ error: '이미 신청한 동아리입니다.' }, { status: 409 })

    const { data: isMember } = await supabase.from('ClubMember').select('id').eq('clubId', clubId).eq('userId', user.id).single()
    if (isMember) return NextResponse.json({ error: '이미 가입된 동아리입니다.' }, { status: 409 })

    const { data: application, error } = await supabase
      .from('JoinApplication')
      .insert({ clubId, userId: user.id, motivation })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
