export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  })
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const CATEGORY_LABELS: Record<string, string> = {
  SPORTS: '스포츠',
  READING: '독서',
  PHOTO: '사진',
  MUSIC: '음악',
  COOKING: '요리',
  TRAVEL: '여행',
  GAME: '게임',
  ART: '미술',
}

export const CATEGORY_COLORS: Record<string, string> = {
  SPORTS: 'bg-orange-100 text-orange-700',
  READING: 'bg-green-100 text-green-700',
  PHOTO: 'bg-purple-100 text-purple-700',
  MUSIC: 'bg-pink-100 text-pink-700',
  COOKING: 'bg-yellow-100 text-yellow-700',
  TRAVEL: 'bg-blue-100 text-blue-700',
  GAME: 'bg-indigo-100 text-indigo-700',
  ART: 'bg-red-100 text-red-700',
}
