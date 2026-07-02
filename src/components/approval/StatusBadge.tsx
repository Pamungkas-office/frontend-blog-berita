interface StatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700',
  },
  waiting_approval: {
    label: 'Waiting Approval',
    className: 'bg-blue-100 text-blue-800',
  },
  approved: {
    label: 'Approved',
    className: 'bg-purple-100 text-purple-800',
  },
  revision: {
    label: 'Revision',
    className: 'bg-orange-100 text-orange-800',
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-800',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
