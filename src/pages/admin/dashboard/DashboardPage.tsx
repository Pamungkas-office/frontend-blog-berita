import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, FolderTree, Tags, Eye, ChevronRight } from 'lucide-react'
import { adminBlogService } from '../../../services/admin/blog'
import { adminCategoryService } from '../../../services/admin/category'
import { adminTagService } from '../../../services/admin/tag'
import { adminStatsService } from '../../../services/admin/stats'
import { Loading } from '../../../components/common/Loading'
import { formatDate } from '../../../utils/formatDate'
import type { Post, Category, Tag } from '../../../types'

const statIcons = { FileText, FolderTree, Tags, Eye }

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [totalViews, setTotalViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminBlogService.getAll({ limit: 5 }),
      adminCategoryService.getAll(),
      adminTagService.getAll(),
      adminStatsService.getTotalViews(),
    ])
      .then(([postsRes, cats, tgs, views]) => {
        setPosts(postsRes.data ?? [])
        setCategories(cats ?? [])
        setTags(tgs ?? [])
        setTotalViews(views)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const stats = [
    { label: 'Total Berita', value: posts.length, icon: 'FileText' as const, color: 'from-navy-700 to-navy-600' },
    { label: 'Total Kategori', value: categories.length, icon: 'FolderTree' as const, color: 'from-brand-red-700 to-brand-red-600' },
    { label: 'Total Tag', value: tags.length, icon: 'Tags' as const, color: 'from-navy-700 to-navy-600' },
    { label: 'Total Pengunjung', value: totalViews.toLocaleString(), icon: 'Eye' as const, color: 'from-brand-red-700 to-brand-red-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Ringkasan aktivitas blog Anda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = statIcons[stat.icon]
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shrink-0`}>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Berita Terbaru</h2>
          <Link
            to="/admin/blog"
            className="text-sm font-medium text-brand-red-700 hover:text-brand-red-800 flex items-center gap-1"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Judul</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(post.created_at ?? post.createdAt ?? '') || '-'}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                    Belum ada berita
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {posts.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">Belum ada berita</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="px-4 py-4">
                <p className="text-sm font-medium text-gray-900">{post.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(post.created_at ?? post.createdAt ?? '') || '-'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
