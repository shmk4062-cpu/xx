import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, department } = await req.json()

    if (!id || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 })
    }

    const { data: existing } = await supabase.from('User').select('id').eq('email', email).single()
    if (existing) {
      return NextResponse.json({ ok: true })
    }

    const { error } = await supabase.from('User').insert({
      id,
      name: name.trim(),
      email: email.trim(),
      password: 'supabase_auth_managed',
      department: department?.trim() || null,
      role: 'USER',
    })

    if (error) throw error

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
