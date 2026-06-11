import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white font-bold text-xs">
              삼
            </div>
            <span className="font-bold text-primary">삼천리 동아리 커뮤니티</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="/clubs" className="hover:text-primary transition-colors">동아리</Link>
            <Link href="/board" className="hover:text-primary transition-colors">게시판</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">마이페이지</Link>
          </nav>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} 삼천리. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
