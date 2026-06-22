import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { adminBlogService } from '../../../services/admin/blog'
import { adminCategoryService } from '../../../services/admin/category'
import { adminTagService } from '../../../services/admin/tag'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { TiptapEditor } from '../../../components/common/TiptapEditor'
import { ImageUpload } from '../../../components/common/ImageUpload'
import type { Category, Tag } from '../../../types'

const blogSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  category_id: z.string().min(1, 'Pilih kategori'),
  status: z.enum(['draft', 'published']),
})

type BlogForm = z.infer<typeof blogSchema>

export function BlogCreate() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [content, setContent] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: { status: 'draft' },
  })

  useEffect(() => {
    Promise.all([
      adminCategoryService.getAll(),
      adminTagService.getAll(),
    ]).then(([cats, tgs]) => {
      setCategories(cats ?? [])
      setTags(tgs ?? [])
    }).catch(() => {})
  }, [])

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
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  const onSubmit = async (formData: BlogForm) => {
    setApiError('')
    try {
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('content', content)
      fd.append('status', formData.status)
      fd.append('category_id', formData.category_id)
      fd.append('tag_ids', JSON.stringify(selectedTagIds))
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile)

      await adminBlogService.create(fd)
      navigate('/admin/blog', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(msg)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Buat Artikel Baru</h1>
        <p className="mt-1 text-sm text-gray-500">Isi detail artikel untuk dipublikasikan</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {apiError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Input
              label="Judul Artikel"
              placeholder="Masukkan judul artikel"
              error={errors.title?.message}
              {...register('title', { onChange: handleTitleChange })}
            />
            <Input
              label="Slug"
              placeholder="auto-generated"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Select
              label="Kategori"
              error={errors.category_id?.message}
              options={[
                { value: '', label: '-- Pilih Kategori --' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              {...register('category_id')}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[42px]">
                {tags.length === 0 && (
                  <span className="text-sm text-gray-400">Tidak ada tag</span>
                )}
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(Number(tag.id))
                  return (
                    <button
                      key={tag.id}
                      type="button"
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
            onChange={setThumbnailFile}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="draft"
                  {...register('status')}
                  className="text-brand-red-700 focus:ring-brand-red-700"
                />
                <span className="text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="published"
                  {...register('status')}
                  className="text-brand-red-700 focus:ring-brand-red-700"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
          <TiptapEditor
            label="Konten"
            value={content}
            onChange={setContent}
            error={content.length < 15 ? 'Konten minimal 15 karakter' : undefined}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Publikasikan</Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/blog')}>Batal</Button>
        </div>
      </form>
    </div>
  )
}
