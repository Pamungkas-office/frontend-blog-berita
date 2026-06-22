import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { blogService } from '../services/user/blog'
import { PostCard } from '../components/common/PostCard'
import { UserSidebar } from '../components/layout/UserSidebar'
import { AdBanner } from '../components/common/AdBanner'
import { Loading } from '../components/common/Loading'
import type { Post } from '../types'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService
      .getAllPublished()
      .then((res) => setPosts(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const heroPost = posts[0]
  const restPosts = posts.slice(1, 7)

  return (
    <div>
      {/* Hero section */}
      {heroPost && (
        <section className="bg-gradient-to-br from-navy-700 to-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <Link to={`/blog/${heroPost.slug}`} className="group block max-w-3xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-red-700 text-white mb-4">
                {heroPost.category?.name ?? 'Breaking News'}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight group-hover:text-gray-200 transition-colors">
                {heroPost.title}
              </h1>
              <p className="mt-4 text-lg text-gray-300 line-clamp-3">
                {heroPost.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
              </p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-white/70 group-hover:text-white">
                Baca selengkapnya <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Ad banner after hero */}
      <AdBanner position="in_article" className="py-4" />

      {/* Recent posts — with sidebar on desktop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-navy-700">Berita Terbaru</h2>
          <Link
            to="/blog"
            className="text-sm text-brand-red-700 hover:text-brand-red-800 font-medium flex items-center gap-1 transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <div className="flex-1 min-w-0">
            {restPosts.length === 0 && posts.length <= 1 ? (
              <p className="text-center text-gray-500 py-12">Belum ada artikel</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <UserSidebar />
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
