'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

type ApplicationFormProps = {
  clubId: string
  clubName: string
}

export default function ApplicationForm({ clubId, clubName }: ApplicationFormProps) {
  const router = useRouter()
  const [motivation, setMotivation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!motivation.trim()) {
      setError('가입 동기를 입력해주세요.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId, motivation }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '신청에 실패했습니다.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('서버 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          가입 동기 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={5}
          placeholder={`${clubName}에 가입하고 싶은 이유를 알려주세요.`}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          required
        />
        <p className="mt-1 text-xs text-gray-400">{motivation.length}자</p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        가입 신청하기
      </Button>
    </form>
  )
}
