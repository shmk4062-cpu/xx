import type { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: '회원가입' }

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
            삼
          </div>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-1 text-sm text-gray-500">삼천리 구성원으로 함께하세요</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
