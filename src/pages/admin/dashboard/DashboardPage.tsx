import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, FolderTree, Tags, Eye } from 'lucide-react'
import { adminBlogService } from '../../../services/admin/blog'
import { adminCategoryService } from '../../../services/admin/category'
import { adminTagService } from '../../../services/admin/tag'
import { Loading } from '../../../components/common/Loading'
import { formatDate } from '../../../utils/formatDate'
import type { Post, Category, Tag } from '../../../types'

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminBlogService.getAll({ limit: 5 }),
      adminCategoryService.getAll(),
      adminTagService.getAll(),
    ])
      .then(([postsRes, cats, tgs]) => {
        setPosts(postsRes.data ?? [])
        setCategories(cats ?? [])
        setTags(tgs ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const stats = [
    { label: 'Total Artikel', value: posts.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Kategori', value: categories.length, icon: FolderTree, color: 'bg-emerald-500' },
    { label: 'Total Tag', value: tags.length, icon: Tags, color: 'bg-purple-500' },
    { label: 'Total Pengunjung', value: '-', icon: Eye, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Artikel Terbaru</h2>
          <Link
            to="/admin/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Judul</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{post.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(post.created_at ?? post.createdAt ?? '') || '-'}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                    Belum ada artikel
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
