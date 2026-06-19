import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { blogService } from '../../services/user/blog'
import { categoryService } from '../../services/user/category'
import { PostCard } from '../../components/common/PostCard'
import { Loading } from '../../components/common/Loading'
import { EmptyState } from '../../components/common/EmptyState'
import type { Post, Category } from '../../types'

export function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    Promise.all([
      blogService.getAllPublished(),
      categoryService.getAll(),
    ])
      .then(([postsRes, cats]) => {
        setPosts(postsRes.data ?? [])
        setCategories(cats ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter((post) => {
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      !selectedCategory ||
      post.category?.slug === selectedCategory ||
      post.category_id === selectedCategory

    return matchSearch && matchCategory
  })

  if (loading) return <Loading />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-600 mb-8">Jelajahi artikel-artikel terbaru</p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Tidak ada artikel yang ditemukan" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
