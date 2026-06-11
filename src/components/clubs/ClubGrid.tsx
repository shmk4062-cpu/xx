import ClubCard from './ClubCard'

type Club = {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  maxMembers: number
}

type ClubGridProps = {
  clubs: Club[]
  emptyMessage?: string
}

export default function ClubGrid({
  clubs,
  emptyMessage = '동아리가 없습니다.',
}: ClubGridProps) {
  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clubs.map((club) => (
        <ClubCard key={club.id} {...club} />
      ))}
    </div>
  )
}
