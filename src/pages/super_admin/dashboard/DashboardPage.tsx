import { useEffect, useState } from 'react'
import { Users, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Loading } from '../../../components/common/Loading'
import { StatusBadge } from '../../../components/approval/StatusBadge'
import { formatDate } from '../../../utils/formatDate'
import { superAdminUserService } from '../../../services/super_admin/user'

interface DashboardData {
  users: { total: number; admins: number; super_admins: number }
  posts: { total: number; draft: number; waiting_approval: number; approved: number; revision: number; published: number }
  recent_activity: {
    id: string
    /** 0 = revision, 1 = approved */
    action: 0 | 1
    notes?: string
    created_at: string
    post: { id: string; title: string }
    approver: { id: string; name: string }
  }[]
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    superAdminUserService.getDashboard()
      .then((res) => setData(res as DashboardData))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (!data) return <div className="text-center py-12 text-gray-500">Gagal memuat data dashboard</div>

  const statsCards = [
    { label: 'Total Users', value: data.users.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Posts', value: data.posts.total, icon: FileText, color: 'bg-purple-500' },
    { label: 'Waiting Approval', value: data.posts.waiting_approval, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Published', value: data.posts.published, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Revision', value: data.posts.revision, icon: AlertTriangle, color: 'bg-orange-500' },
  ]

  const statusBreakdown = [
    { label: 'Draft', value: data.posts.draft, color: 'bg-gray-400' },
    { label: 'Waiting Approval', value: data.posts.waiting_approval, color: 'bg-blue-400' },
    { label: 'Approved', value: data.posts.approved, color: 'bg-purple-400' },
    { label: 'Revision', value: data.posts.revision, color: 'bg-orange-400' },
    { label: 'Published', value: data.posts.published, color: 'bg-green-400' },
  ]

  const maxStatusValue = Math.max(...statusBreakdown.map((s) => s.value), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview keseluruhan aplikasi</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Posts by status */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts by Status</h2>
        <div className="space-y-3">
          {statusBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-28 shrink-0">{item.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${item.color}`}
                  style={{ width: `${(item.value / maxStatusValue) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent approval activity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Approval Activity</h2>
        </div>
        {data.recent_activity.length === 0 ? (
          <div className="p-6 text-sm text-gray-400 text-center">Belum ada aktivitas</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recent_activity.map((activity) => (
              <div key={activity.id} className="px-4 lg:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 w-2 h-2 rounded-full ${activity.action === 1 ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      <span className="font-medium">{activity.approver.name}</span>
                      {' '}{activity.action === 1 ? 'approved' : 'requested revision on'}{' '}
                      <span className="font-medium">{activity.post.title}</span>
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
                <StatusBadge status={activity.action === 1 ? 'approved' : 'revision'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
