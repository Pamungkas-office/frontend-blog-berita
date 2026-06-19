import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import { truncateText } from '../../utils/truncate'
import type { Post } from '../../types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl font-bold">📰</span>
            </div>
          )}
        </div>
        <div className="p-4">
          {post.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
              {post.category.name}
            </span>
          )}
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 line-clamp-3">
            {truncateText(post.content.replace(/<[^>]*>/g, ''), 150)}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.created_at ?? post.createdAt ?? '')}
            </span>
            {post.author && (
              <span>Oleh {post.author.name}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
