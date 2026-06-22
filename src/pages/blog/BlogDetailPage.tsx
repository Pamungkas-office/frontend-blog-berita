import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowLeft,
  MessageSquare,
  Trash2,
  Send,
  Clock,
  BookOpen,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { blogService } from "../../services/user/blog";
import { commentService } from "../../services/user/comment";
import { PostCard } from "../../components/common/PostCard";
import { Loading } from "../../components/common/Loading";
import { Button } from "../../components/ui/Button";
import { AdBanner } from "../../components/common/AdBanner";
import { UserSidebar } from "../../components/layout/UserSidebar";
import { formatDate, formatRelativeDate, truncateText } from "../../utils";
import { useAuth } from "../../context/AuthContext";
import type { Post, Comment } from "../../types";

export function BlogDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  // Comment state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogService
      .getBySlug(slug)
      .then((p) => {
        setPost(p);
        if (p.category_id) {
          blogService
            .getAllPublished({ category: String(p.category_id), limit: 4 })
            .then((res) => {
              setRelatedPosts((res.data ?? []).filter((r) => r.slug !== slug));
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Berita tidak ditemukan");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const fetchComments = () => {
    if (!slug) return;
    setCommentsLoading(true);
    commentService
      .getByPost(slug)
      .then(setComments)
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleSubmit = async () => {
    if (!slug || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await commentService.create(slug, commentText.trim());
      setCommentText("");
      fetchComments();
    } catch {
      // Silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // Silently fail
    }
  };

  if (loading) return <Loading />;

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-light flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Berita Tidak Ditemukan
        </h1>
        <p className="text-gray-500 mb-8">
          {error || "Berita yang Anda cari tidak tersedia atau telah dihapus."}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-red-700 hover:text-brand-red-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  const tags = post.post_tags?.map((pt: any) => pt.tag).filter(Boolean) ?? [];
  const readingTime = Math.max(
    1,
    Math.ceil(post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200),
  );

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | Blog Berita</title>
        <meta
          name="description"
          content={
            post.meta_description ||
            truncateText(post.content.replace(/<[^>]*>/g, ""), 160)
          }
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Main Article */}
          <article className="flex-1 min-w-0 max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-navy-700 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category + Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-red-700 text-white">
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(post.created_at ?? post.createdAt ?? "")}
              </span>
              {post.author && (
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {readingTime} menit baca
              </span>
            </div>

            {/* Content (HTML from Tiptap) */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-navy-700 prose-a:text-brand-red-700 mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* In-article ad */}
            <AdBanner
              position="in_article"
              className="my-8 py-4 border-y border-gray-100"
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200">
                {tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg-light text-gray-600 hover:bg-navy-700 hover:text-white cursor-default transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-navy-700 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Komentar ({comments.length})
              </h2>

              {commentsLoading ? (
                <Loading />
              ) : comments.length === 0 ? (
                <div className="text-center py-10 bg-bg-light rounded-xl">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Belum ada komentar. Jadilah yang pertama!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-4 rounded-xl bg-bg-light"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-sm font-semibold text-navy-700 shrink-0">
                        {comment.user?.name?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {comment.user?.name ?? "Anonim"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatRelativeDate(comment.created_at)}
                            </span>
                          </div>
                          {user && String(comment.user?.id) === user.id && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Hapus komentar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="mt-6 p-5 rounded-xl bg-white border border-gray-200">
                {user ? (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-sm font-semibold text-navy-700 shrink-0">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Tulis komentar..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-700 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <Button
                          onClick={handleSubmit}
                          loading={submitting}
                          disabled={!commentText.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4 mr-1.5" />
                          Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Ingin berdiskusi? Silakan login terlebih dahulu.
                    </p>
                    <Link to="/auth/login">
                      <Button size="sm">Login untuk Komentar</Button>
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-navy-700 mb-6">
                  Berita Terkait
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 2).map((rp) => (
                    <PostCard key={rp.id} post={rp} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <UserSidebar />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
