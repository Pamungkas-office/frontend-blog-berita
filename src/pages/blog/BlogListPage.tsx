import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { blogService } from '../../services/user/blog'
import { categoryService } from '../../services/user/category'
import { PostCard } from '../../components/common/PostCard'
import { UserSidebar } from '../../components/layout/UserSidebar'
import { AdBanner } from '../../components/common/AdBanner'
import { Loading } from '../../components/common/Loading'
import type { Post, Category } from '../../types'

export function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const search = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || ''

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

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  const categoryName = useMemo(() => {
    if (!selectedCategory) return null
    return categories.find((c) => c.slug === selectedCategory)?.name || null
  }, [selectedCategory, categories])

  const pageTitle = categoryName ? `Kategori: ${categoryName}` : search ? `Pencarian: "${search}"` : 'Blog'
  const pageDesc = categoryName
    ? `Berita dalam kategori ${categoryName}`
    : search
      ? `Hasil pencarian untuk "${search}"`
      : 'Jelajahi berita-berita terbaru'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-navy-700">{pageTitle}</h1>
          {(selectedCategory || search) && (
            <button
              onClick={() => setSearchParams({}, { replace: true })}
              className="text-sm text-gray-400 hover:text-brand-red-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-4 h-4" />
              Hapus filter
            </button>
          )}
        </div>
        <p className="text-gray-500 mt-1">{pageDesc}</p>
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">{filtered.length} berita ditemukan</p>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-700 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-bg-light"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
        <select
          value={selectedCategory}
          onChange={(e) => updateParam('category', e.target.value)}
          className="hidden sm:block px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-700 focus:border-transparent bg-white"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile filter dropdown */}
      {showFilters && (
        <div className="sm:hidden mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => updateParam('category', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-700"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <AdBanner position="in_article" className="mb-8" />

      {/* Main content + sidebar layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm mb-2">Tidak ada berita yang ditemukan</p>
              <p className="text-gray-400 text-xs">Coba ubah kata kunci atau filter kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24">
            <UserSidebar />
          </div>
        </aside>
      </div>
    </div>
  )
}
