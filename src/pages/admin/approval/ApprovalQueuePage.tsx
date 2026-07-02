import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Calendar, Eye } from 'lucide-react'
import { adminApprovalService } from '../../../services/admin/approval'
import { Button } from '../../../components/ui/Button'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { StatusBadge } from '../../../components/approval/StatusBadge'
import { ApprovalProgressBar } from '../../../components/approval/ApprovalProgressBar'
import { Pagination } from '../../../components/common/Pagination'
import { formatDate } from '../../../utils/formatDate'
import { useAuth } from '../../../context/AuthContext'
import type { Post } from '../../../types'

const LIMIT = 10

export function ApprovalQueuePage() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const isSuperAdmin = user?.role === 'super_admin'

  const fetchQueue = () => {
    setLoading(true)
    adminApprovalService
      .getQueue(page, LIMIT)
      .then((result) => {
        setQueue(result.data)
        setTotalPages(result.pagination?.totalPages ?? 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchQueue() }, [page])

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Approval Queue</h1>
        <p className="mt-1 text-sm text-gray-500">
          Berita yang menunggu review atau siap publikasi
        </p>
      </div>

      {queue.length === 0 ? (
        <EmptyState message="Tidak ada berita yang menunggu approval" />
      ) : (
        <>
          <div className="space-y-4">
            {queue.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={post.status} />
                      {post.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-gray-500">
                      <span>By {post.author?.name ?? '-'}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at ?? '')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.view_count ?? 0}
                      </span>
                    </div>
                    {post.total_approvals !== undefined && (
                      <ApprovalProgressBar
                        current={post.total_approvals}
                        required={post.min_admin_approvals ?? 2}
                        status={post.status}
                      />
                    )}
                  </div>

                  {post.status === 'waiting_approval' || (isSuperAdmin && post.status === 'approved') ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`${post.id}/edit`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
