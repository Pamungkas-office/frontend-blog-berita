import { useEffect, useState } from 'react'
import { superAdminApprovalService } from '../../../services/super_admin/approval'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { Pagination } from '../../../components/common/Pagination'
import { StatusBadge } from '../../../components/approval/StatusBadge'
import { formatDate } from '../../../utils/formatDate'
import type { LogApproval } from '../../../types'

export function ApprovalHistoryPage() {
  const [logs, setLogs] = useState<LogApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchHistory = (p: number) => {
    setLoading(true)
    superAdminApprovalService
      .getHistory(p)
      .then((res) => {
        setLogs(res.data)
        setTotalPages(res.pagination.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHistory(page) }, [page])

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Approval History</h1>
        <p className="mt-1 text-sm text-gray-500">Riwayat approval dan revisi</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState message="Belum ada riwayat approval" />
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Post</th>
                  <th className="px-6 py-3 font-medium">Approver</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Notes</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {log.post?.title ?? '-'}
                      </p>
                      {log.post && <StatusBadge status={log.post.status} />}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {log.approver.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.action === 1 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {log.action === 1 ? 'Approved' : 'Revision'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.notes ? (
                        <div className="text-sm text-gray-600 line-clamp-2 max-w-xs" dangerouslySetInnerHTML={{ __html: log.notes }} />
                      ) : (
                        <span className="text-sm text-gray-400">Tidak ada catatan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {log.post?.title ?? '-'}
                    </p>
                    {log.post && <StatusBadge status={log.post.status} />}
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${log.action === 1 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {log.action === 1 ? 'Approved' : 'Revision'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  By {log.approver.name} &middot; {formatDate(log.created_at)}
                </div>
                {log.notes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" dangerouslySetInnerHTML={{ __html: log.notes }} />
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
