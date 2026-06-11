import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-primary/20 mb-4 select-none">404</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
