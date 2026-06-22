import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { adminCategoryService } from '../../../services/admin/category'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Loading } from '../../../components/common/Loading'
import { generateSlug } from '../../../utils/slug'
import type { Category } from '../../../types'

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
})

type CategoryForm = z.infer<typeof categorySchema>

export function CategoryEdit() {
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
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  })

  const nameValue = useWatch({ control, name: 'name' })
  useEffect(() => {
    setValue('slug', generateSlug(nameValue ?? ''))
  }, [nameValue, setValue])

  useEffect(() => {
    if (!id) return
    adminCategoryService
      .getAll()
      .then((categories) => {
        const category = categories.find((c: Category) => c.id === id)
        if (category) {
          reset({ name: category.name, slug: category.slug })
        } else {
          setApiError('Kategori tidak ditemukan')
        }
      })
      .catch(() => setApiError('Gagal memuat data kategori'))
      .finally(() => setLoadingData(false))
  }, [id, reset])

  const onSubmit = async (formData: CategoryForm) => {
    if (!id) return
    setApiError('')
    try {
      await adminCategoryService.update(id, formData)
      navigate('/admin/category', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(msg)
    }
  }

  if (loadingData) return <Loading />

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Kategori</h1>
        <p className="mt-1 text-sm text-gray-500">Perbarui nama atau slug kategori</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          <Input
            label="Nama Kategori"
            placeholder="Masukkan nama kategori"
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
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/category')}>Batal</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
