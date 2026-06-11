import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { CATEGORY_COLORS } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, string> = {
  SPORTS: '⛰️',
  READING: '📚',
  PHOTO: '📷',
  MUSIC: '🎸',
  COOKING: '🍳',
  TRAVEL: '✈️',
  GAME: '🎲',
  ART: '🎨',
}

type ClubCardProps = {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  maxMembers: number
}

export default function ClubCard({
  id,
  name,
  description,
  category,
  memberCount,
  maxMembers,
}: ClubCardProps) {
  const icon = CATEGORY_ICONS[category] ?? '🏢'
  const bgClasses: Record<string, string> = {
    SPORTS: 'from-orange-400 to-orange-600',
    READING: 'from-green-400 to-green-600',
    PHOTO: 'from-purple-400 to-purple-600',
    MUSIC: 'from-pink-400 to-pink-600',
    COOKING: 'from-yellow-400 to-yellow-600',
    TRAVEL: 'from-blue-400 to-blue-600',
    GAME: 'from-indigo-400 to-indigo-600',
    ART: 'from-red-400 to-red-600',
  }
  const gradient = bgClasses[category] ?? 'from-primary to-primary-dark'

  return (
    <Link href={`/clubs/${id}`} className="group block">
      <article className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 bg-white h-full">
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-5xl">{icon}</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
              {name}
            </h3>
            <Badge category={category} />
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              👥 {memberCount}명
            </span>
            <span className="text-gray-400">
              최대 {maxMembers}명
            </span>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min((memberCount / maxMembers) * 100, 100)}%` }}
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
