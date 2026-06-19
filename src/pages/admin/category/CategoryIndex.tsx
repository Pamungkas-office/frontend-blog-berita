import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { adminCategoryService } from '../../../services/admin/category'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import type { Category } from '../../../types'

export function CategoryIndex() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = () => {
    setLoading(true)
    adminCategoryService
      .getAll()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminCategoryService.delete(deleteTarget.id)
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola kategori artikel</p>
        </div>
        <Link to="/admin/category/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState message="Belum ada kategori" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3 font-medium">Nama</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/category/${category.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(category)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Kategori">
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus kategori <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}
