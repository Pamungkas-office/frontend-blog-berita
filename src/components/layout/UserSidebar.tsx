import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, FolderTree, Tags, ArrowRight } from "lucide-react";
import { blogService } from "../../services/user/blog";
import { categoryService } from "../../services/user/category";
import { tagService } from "../../services/user/tag";
import { AdBanner } from "../common/AdBanner";
import { formatDate } from "../../utils/formatDate";
import type { Post, Category, Tag } from "../../types";

export function UserSidebar() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    Promise.all([
      blogService.getAllPublished({ limit: 5 }),
      categoryService.getAll(),
      tagService.getAll(),
    ])
      .then(([postsRes, cats, tgs]) => {
        setRecentPosts(postsRes.data ?? []);
        setCategories(cats ?? []);
        setTags(tgs ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="space-y-6">
      {/* Trending / Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-700 mb-4">
          <TrendingUp className="w-4 h-4 text-brand-red-700" />
          Terpopuler
        </h3>
        <div className="space-y-3">
          {recentPosts.slice(0, 5).map((post, idx) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <span className="text-lg font-bold text-gray-300 leading-none shrink-0 w-6">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-red-700 transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(post.created_at ?? post.createdAt ?? "")}
                </p>
              </div>
            </Link>
          ))}
          {recentPosts.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada berita</p>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-700 mb-4">
            <FolderTree className="w-4 h-4 text-brand-red-700" />
            Kategori
          </h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog?category=${cat.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-bg-light hover:text-navy-700 transition-colors"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-700 mb-4">
            <Tags className="w-4 h-4 text-brand-red-700" />
            Tag
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/blog?tag=${tag.slug}`}
                className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-bg-light text-gray-600 hover:bg-navy-700 hover:text-white transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ad */}
      <AdBanner position="sidebar" className="min-h-[250px]" />
    </aside>
  );
}
