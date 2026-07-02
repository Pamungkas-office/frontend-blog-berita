import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Tag as TagIcon } from 'lucide-react'
import { adminTagService } from '../../../services/admin/tag'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { Pagination } from '../../../components/common/Pagination'
import type { Tag } from '../../../types'

const LIMIT = 10

export function TagIndex() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)

  const fetchData = () => {
    setLoading(true)
    adminTagService
      .getAll()
      .then(setTags)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const totalPages = Math.ceil(tags.length / LIMIT)
  const displayTags = tags.slice((page - 1) * LIMIT, page * LIMIT)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminTagService.delete(deleteTarget.id)
      setTags((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tag</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola tag berita</p>
        </div>
        <Link to="/admin/tag/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tag
          </Button>
        </Link>
      </div>

      {tags.length === 0 ? (
        <EmptyState message="Belum ada tag" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Nama</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayTags.map((tag) => (
                  <tr key={tag.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tag.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tag.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/tag/${tag.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(tag)}>
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
            {displayTags.map((tag) => (
              <div key={tag.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{tag.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{tag.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/admin/tag/${tag.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(tag)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Tag">
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus tag <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  )
}
