import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { blogService } from '../services/user/blog'
import { PostCard } from '../components/common/PostCard'
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
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <Link to={`/blog/${heroPost.slug}`} className="group block max-w-3xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-4">
                {heroPost.category?.name ?? 'Artikel'}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight group-hover:text-blue-100 transition-colors">
                {heroPost.title}
              </h1>
              <p className="mt-4 text-lg text-blue-100 line-clamp-3">
                {heroPost.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
              </p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-white/80 group-hover:text-white">
                Baca selengkapnya <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Recent posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Berita Terbaru</h2>
          <Link
            to="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {restPosts.length === 0 && posts.length <= 1 ? (
          <p className="text-center text-gray-500 py-12">Belum ada artikel</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
