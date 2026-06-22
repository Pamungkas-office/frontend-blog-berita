import { useEffect, useState } from 'react'
import { Trash2, User, FileText } from 'lucide-react'
import Swal from 'sweetalert2'
import { adminCommentService } from '../../../services/admin/comment'
import { Button } from '../../../components/ui/Button'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { Pagination } from '../../../components/common/Pagination'
import { formatRelativeDate } from '../../../utils'
import type { Comment } from '../../../types'

export function CommentIndex() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = (p: number) => {
    setLoading(true)
    adminCommentService
      .getAll(p)
      .then((res) => {
        setComments(res.data)
        setTotalPages(res.pagination.totalPages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData(page) }, [page])

  const handleDelete = (comment: Comment) => {
    Swal.fire({
      title: 'Hapus Komentar',
      text: `Yakin ingin menghapus komentar dari "${comment.user?.name ?? 'Anonim'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (!result.isConfirmed) return
      try {
        await adminCommentService.delete(comment.id)
        setComments((prev) => prev.filter((c) => c.id !== comment.id))
        Swal.fire('Terhapus!', 'Komentar berhasil dihapus', 'success')
      } catch {
        Swal.fire('Gagal!', 'Gagal menghapus komentar', 'error')
      }
    })
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Komentar</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola komentar pengguna</p>
      </div>

      {comments.length === 0 ? (
        <EmptyState message="Belum ada komentar" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium w-12">No</th>
                  <th className="px-6 py-3 font-medium">Komentar</th>
                  <th className="px-6 py-3 font-medium">Penulis</th>
                  <th className="px-6 py-3 font-medium">Post</th>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, idx) => (
                  <tr key={comment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {comment.comment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {comment.user?.name ?? 'Anonim'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                      {comment.post?.title ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatRelativeDate(comment.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(comment)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user?.name ?? 'Anonim'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatRelativeDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(comment)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{comment.comment}</p>
                {comment.post?.title && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span className="truncate">{comment.post.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
