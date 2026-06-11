'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const department = formData.get('department') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, department },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? '이미 가입된 이메일입니다.'
        : '회원가입에 실패했습니다.')
      setLoading(false)
      return
    }

    // Supabase User 테이블에 프로필 생성
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: data.user?.id, name, email, department }),
    })

    if (!res.ok) {
      const resData = await res.json()
      setError(resData.error ?? '프로필 생성에 실패했습니다.')
      setLoading(false)
      return
    }

    router.push('/login?registered=true')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input id="name" name="name" label="이름" type="text" placeholder="홍길동" required autoComplete="name" />
      <Input id="email" name="email" label="이메일" type="email" placeholder="your@samchully.co.kr" required autoComplete="email" />
      <Input id="department" name="department" label="부서" type="text" placeholder="예: 영업팀, 경영지원팀" />
      <Input id="password" name="password" label="비밀번호" type="password" placeholder="8자 이상" required minLength={8} autoComplete="new-password" />
      <Input id="confirmPassword" name="confirmPassword" label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" required autoComplete="new-password" />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인
        </Link>
      </p>
    </form>
  )
}
