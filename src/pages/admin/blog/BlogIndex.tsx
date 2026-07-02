import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Calendar, FolderOpen, Sparkles, Eye, CheckCircle, MessageSquare } from 'lucide-react'
import { adminBlogService } from '../../../services/admin/blog'
import { adminApprovalService } from '../../../services/admin/approval'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { StatusBadge } from '../../../components/approval/StatusBadge'
import { Pagination } from '../../../components/common/Pagination'
import { formatDate } from '../../../utils/formatDate'
import { useAuth } from '../../../context/AuthContext'
import type { Post } from '../../../types'

const LIMIT = 10

type FilterTab = 'all' | 'draft' | 'waiting_approval' | 'approved' | 'revision' | 'published'

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'waiting_approval', label: 'Waiting' },
  { key: 'approved', label: 'Approved' },
  { key: 'revision', label: 'Revision' },
  { key: 'published', label: 'Published' },
]

export function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [publishing, setPublishing] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const isSuperAdmin = user?.role === 'super_admin'

  const fetchData = () => {
    setLoading(true)
    const params: { page: number; limit: number; status?: string } = { page, limit: LIMIT }
    if (activeFilter !== 'all') params.status = activeFilter
    adminBlogService
      .getAll(params)
      .then((res) => {
        setPosts(res.data.data ?? [])
        setTotalPages(res.data.pagination?.totalPages ?? 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [page, activeFilter])

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminBlogService.delete(deleteTarget.id)
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
    } finally {
      setDeleting(false)
    }
  }

  const handlePublish = async (postId: string) => {
    setPublishing(postId)
    try {
      await adminApprovalService.publish(postId)
      fetchData()
    } catch {
    } finally {
      setPublishing(null)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola berita blog</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/blog/generate">
            <Button variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
          </Link>
          <Link to="/admin/blog/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Buat Berita
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab.key
                ? 'bg-navy-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <EmptyState message="Belum ada berita" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Judul</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Dilihat</th>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{post.category?.name ?? '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.view_count ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(post.created_at ?? post.createdAt ?? '') || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Publish button for super_admin on approved posts */}
                        {isSuperAdmin && post.status === 'approved' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            loading={publishing === post.id}
                            onClick={() => handlePublish(post.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        <Link to={`/admin/blog/${post.id}/edit`}>
                          {post.status === 'revision' ? (
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              <span className="hidden lg:inline">Edit & Lihat Revisi</span>
                              <span className="lg:hidden">Revisi</span>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(post)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</p>
                    {post.category && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FolderOpen className="w-3 h-3" />
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={post.status} />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="w-3 h-3" />
                      {post.view_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at ?? post.createdAt ?? '') || '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSuperAdmin && post.status === 'approved' && (
                      <Button
                        size="sm"
                        loading={publishing === post.id}
                        onClick={() => handlePublish(post.id)}
                      >
                        Publish
                      </Button>
                    )}
                    <Link to={`/admin/blog/${post.id}/edit`}>
                      {post.status === 'revision' ? (
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Revisi
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(post)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Berita">
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus berita <strong>{deleteTarget?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  )
}
