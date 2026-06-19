import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { adminTagService } from '../../../services/admin/tag'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Loading } from '../../../components/common/Loading'
import { generateSlug } from '../../../utils/slug'
import type { Tag } from '../../../types'

const tagSchema = z.object({
  name: z.string().min(1, 'Nama tag wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
})

type TagForm = z.infer<typeof tagSchema>

export function TagEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TagForm>({
    resolver: zodResolver(tagSchema),
  })

  const nameValue = useWatch({ control, name: 'name' })
  useEffect(() => {
    setValue('slug', generateSlug(nameValue ?? ''))
  }, [nameValue, setValue])

  useEffect(() => {
    if (!id) return
    adminTagService
      .getAll()
      .then((tags) => {
        const tag = tags.find((t: Tag) => t.id === id)
        if (tag) {
          reset({ name: tag.name, slug: tag.slug })
        } else {
          setApiError('Tag tidak ditemukan')
        }
      })
      .catch(() => setApiError('Gagal memuat data tag'))
      .finally(() => setLoadingData(false))
  }, [id, reset])

  const onSubmit = async (formData: TagForm) => {
    if (!id) return
    setApiError('')
    try {
      await adminTagService.update(id, formData)
      navigate('/admin/tag', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(msg)
    }
  }

  if (loadingData) return <Loading />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Tag</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {apiError}
          </div>
        )}

        <Input
          label="Nama Tag"
          placeholder="Masukkan nama tag"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Slug"
          placeholder="auto-generated"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={isSubmitting}>Simpan Perubahan</Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/tag')}>Batal</Button>
        </div>
      </form>
    </div>
  )
}
