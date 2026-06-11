import { cn, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/utils'

type BadgeProps = {
  category: string
  className?: string
}

export default function Badge({ category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {CATEGORY_LABELS[category] ?? category}
    </span>
  )
}
