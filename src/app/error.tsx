'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
        <p className="text-gray-500 mb-6">일시적인 오류입니다. 다시 시도해 주세요.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-white font-medium px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
