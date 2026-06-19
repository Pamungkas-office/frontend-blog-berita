import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'

const profileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  })

  const onSubmit = async (formData: ProfileForm) => {
    setApiError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('name', formData.name)
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      })
      if (!res.ok) throw new Error('Gagal update profil')
      setSuccess('Profil berhasil diperbarui')
    } catch (err: any) {
      setApiError(err.message || 'Terjadi kesalahan')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

      <Card className="p-6 space-y-6">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="text-sm font-medium text-gray-900 capitalize">{user?.role}</p>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Profil</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              {success}
            </div>
          )}

          <Input
            label="Nama"
            error={errors.name?.message}
            {...register('name')}
          />

          <Button type="submit" loading={isSubmitting}>
            Simpan Perubahan
          </Button>
        </form>
      </Card>

      <div className="mt-6">
        <Button variant="danger" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
