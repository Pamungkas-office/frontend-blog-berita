import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = 'Tidak ada data' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
