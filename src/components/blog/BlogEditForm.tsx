import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { adminBlogService } from '../../services/admin/blog'
import { adminCategoryService } from '../../services/admin/category'
import { adminTagService } from '../../services/admin/tag'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { TiptapEditor } from '../common/TiptapEditor'
import { ImageUpload } from '../common/ImageUpload'
import { Loading } from '../common/Loading'
import { StatusBadge } from '../approval/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import type { Category, Tag } from '../../types'
import { formatStatus } from '../../utils/formatStatus'

const blogSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  category_id: z.string().min(1, 'Pilih kategori'),
  status: z.enum(['draft', 'waiting_approval']),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

type BlogForm = z.infer<typeof blogSchema>

interface BlogEditFormProps {
  approvalService: {
    getRevisionNotes: (id: string) => Promise<{ notes: string | null; approver_name: string }>
    resubmit: (id: string) => Promise<unknown>
  }
  redirectPath: string
  contextLabel?: string
  readOnly?: boolean
  hideSaveButton?: boolean
  hideCancelButton?: boolean
  actionsExtra?: React.ReactNode
}

export function BlogEditForm({ approvalService, redirectPath, contextLabel = 'Edit Berita', readOnly, hideSaveButton, hideCancelButton, actionsExtra }: BlogEditFormProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [apiError, setApiError] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [tagsDirty, setTagsDirty] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const [revisionNotes, setRevisionNotes] = useState<{ notes: string | null; approver_name: string } | null>(null)

  const isSuperAdmin = user?.role === 'super_admin'
  const canEdit = readOnly ? false : (isSuperAdmin || ['draft', 'waiting_approval', 'revision'].includes(currentStatus))

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  })

  useEffect(() => {
    if (!id) return

    Promise.all([
      adminBlogService.getById(id),
      adminCategoryService.getAll(),
      adminTagService.getAll(),
    ])
      .then(([post, cats, tgs]) => {
        setCurrentStatus(post.status)
        reset({
          title: post.title,
          slug: post.slug,
          category_id: String(post.category_id ?? ''),
          status: post.status === 'published' || post.status === 'approved'
            ? 'draft'
            : post.status === 'revision'
            ? 'waiting_approval'
            : post.status,
          meta_title: post.meta_title ?? '',
          meta_description: post.meta_description ?? '',
        })
        setContent(post.content)
        setExistingThumbnail(post.thumbnail ?? null)
        setCategories(cats ?? [])
        setTags(tgs ?? [])
        setSelectedTagIds(post.post_tags?.map((pt) => Number(pt.tag.id)) ?? [])
        setTagsDirty(false)
      })
      .catch(() => setApiError('Gagal memuat data berita'))
      .finally(() => setLoadingData(false))
  }, [id, reset])

  useEffect(() => {
    if (currentStatus === 'revision' && id) {
      approvalService.getRevisionNotes(id).then((res) => {
        if (res?.notes) {
          setRevisionNotes(res)
        }
      }).catch(() => {})
    }
  }, [currentStatus, id, approvalService])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    setValue('title', title)
    setValue('slug', slug)
  }

  const toggleTag = (tagId: number) => {
    setTagsDirty(true)
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  const onSubmit = async (formData: BlogForm) => {
    if (!id) return
    setApiError('')
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('slug', formData.slug)
      fd.append('content', content)
      fd.append('status', formData.status)
      fd.append('category_id', formData.category_id)
      if (tagsDirty) fd.append('tag_ids', JSON.stringify(selectedTagIds))
      fd.append('meta_title', formData.meta_title ?? '')
      fd.append('meta_description', formData.meta_description ?? '')
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile)

      await adminBlogService.update(id, fd)
      navigate(redirectPath, { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(msg)
    }
  }

  if (loadingData) return <Loading />

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{contextLabel}</h1>
          <StatusBadge status={currentStatus} />
        </div>
        <p className="mt-1 text-sm text-gray-500">Perbarui detail berita</p>
      </div>

      {currentStatus === 'revision' && revisionNotes?.notes && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-orange-800 mb-2">
            Catatan Revisi dari {revisionNotes.approver_name}:
          </h3>
          <div
            className="text-sm text-orange-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: revisionNotes.notes }}
          />
        </div>
      )}

      {!canEdit && currentStatus !== 'revision' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Admin yang memiliki hak approval hanya bisa memberikan revisi dan approve berita dengan status <strong>
            {formatStatus(currentStatus)}</strong>
            {isSuperAdmin && ' Sebagai Super Admin, Anda tetap bisa mengedit.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {apiError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input
              label="Judul Berita"
              placeholder="Masukkan judul berita"
              disabled={!canEdit}
              error={errors.title?.message}
              {...register('title', { onChange: handleTitleChange })}
            />
            <Input
              label="Slug"
              placeholder="auto-generated"
              disabled={!canEdit}
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Select
              label="Kategori"
              disabled={!canEdit}
              error={errors.category_id?.message}
              options={[
                { value: '', label: '-- Pilih Kategori --' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              {...register('category_id')}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-10.5">
                {tags.length === 0 && (
                  <span className="text-sm text-gray-400">Tidak ada tag</span>
                )}
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(Number(tag.id))
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => toggleTag(Number(tag.id))}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-navy-700 text-white border-navy-700'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <ImageUpload
            label="Thumbnail"
            value={existingThumbnail}
            onChange={setThumbnailFile}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  disabled={!canEdit}
                  {...register('status')}
                  className="text-brand-red-700 focus:ring-brand-red-700"
                />
                <span className="text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="waiting_approval"
                  disabled={!canEdit}
                  {...register('status')}
                  className="text-brand-red-700 focus:ring-brand-red-700"
                />
                <span className="text-sm text-gray-700">Submit for Approval</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input
              label="Meta Title (SEO)"
              placeholder="Judul untuk SEO"
              disabled={!canEdit}
              error={errors.meta_title?.message}
              {...register('meta_title')}
            />
            <Input
              label="Meta Description (SEO)"
              placeholder="Deskripsi singkat untuk SEO"
              disabled={!canEdit}
              error={errors.meta_description?.message}
              {...register('meta_description')}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
          <TiptapEditor
            label="Konten"
            value={content}
            onChange={setContent}
          />
        </div>

        {(canEdit && !hideSaveButton) || actionsExtra || !hideCancelButton ? (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {canEdit && !hideSaveButton && (
              <Button type="submit" loading={isSubmitting}>Simpan Perubahan</Button>
            )}
            {actionsExtra}
            {!hideCancelButton && (
              <Button variant="secondary" type="button" onClick={() => navigate(redirectPath)}>Batal</Button>
            )}
          </div>
        ) : null}
      </form>
    </div>
  )
}
