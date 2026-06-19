import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { adminCategoryService } from '../../../services/admin/category'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { generateSlug } from '../../../utils/slug'

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
})

type CategoryForm = z.infer<typeof categorySchema>

export function CategoryCreate() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  })

  const nameValue = useWatch({ control, name: 'name' })
  useEffect(() => {
    setValue('slug', generateSlug(nameValue ?? ''))
  }, [nameValue, setValue])

  const onSubmit = async (formData: CategoryForm) => {
    setApiError('')
    try {
      await adminCategoryService.create(formData)
      navigate('/admin/category', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(msg)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tambah Kategori</h1>

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
          <Button type="submit" loading={isSubmitting}>
            Simpan
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate('/admin/category')}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
