'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORY_LABELS } from '@/lib/utils'

const CATEGORIES = ['전체', ...Object.keys(CATEGORY_LABELS)]

export default function ClubFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('category') ?? '전체'

  function handleSelect(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === '전체') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === cat
              ? 'bg-primary text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'
          }`}
        >
          {cat === '전체' ? '전체' : (CATEGORY_LABELS[cat] ?? cat)}
        </button>
      ))}
    </div>
  )
}
