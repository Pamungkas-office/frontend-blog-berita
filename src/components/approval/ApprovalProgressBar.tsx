interface ApprovalProgressBarProps {
  current: number
  required: number
  status: string
}

export function ApprovalProgressBar({
  current,
  required,
  status,
}: ApprovalProgressBarProps) {
  const percentage = Math.min((current / required) * 100, 100)
  const isComplete = current >= required
  const isApproved = status === 'approved'

  const barColor = isComplete
    ? 'bg-green-500'
    : 'bg-amber-400'

  return (
    <div className="mt-2 flex items-center gap-2 max-w-56">
      <div
        className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={required}
        aria-label={`Approval progress: ${current} of ${required} admins`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 shrink-0">
        {current}/{required}
      </span>
      {isApproved && (
        <span className="text-xs text-green-600 font-medium shrink-0">Siap</span>
      )}
    </div>
  )
}
