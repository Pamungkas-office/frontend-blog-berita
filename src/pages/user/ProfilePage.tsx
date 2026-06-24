import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { Card } from '../../components/ui/Card'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

const profileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.email('Email tidak valid'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')

  // Change password state
  const [pwApiError, setPwApiError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const pwForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const onSubmit = async (formData: ProfileForm) => {
    setApiError('')
    setSuccess('')
    try {
      const updatedUser = await authService.updateProfile({
        name: formData.name,
        email: formData.email,
      })
      updateUser(updatedUser)
      setSuccess('Profil berhasil diperbarui')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center text-xl font-bold text-navy-700">
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-700">Profil Saya</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-5 lg:p-6">
          <h2 className="text-sm font-semibold text-navy-700 uppercase tracking-wider mb-4">Informasi Akun</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 bg-bg-light rounded-lg">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:p-6">
          <h2 className="text-sm font-semibold text-navy-700 uppercase tracking-wider mb-4">Edit Profil</h2>
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

            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isSubmitting}>
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-5 lg:p-6">
          <h2 className="text-sm font-semibold text-navy-700 uppercase tracking-wider mb-4">Ubah Password</h2>
          <form onSubmit={pwForm.handleSubmit(async (formData) => {
            setPwApiError('')
            setPwSuccess('')
            try {
              await authService.changePassword(formData.currentPassword, formData.newPassword)
              setPwSuccess('Password berhasil diubah')
              pwForm.reset()
            } catch (err: any) {
              const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
              setPwApiError(message)
            }
          })} className="space-y-4">
            {pwApiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {pwApiError}
              </div>
            )}
            {pwSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                {pwSuccess}
              </div>
            )}

            <PasswordInput
              label="Password Saat Ini"
              placeholder="Masukkan password saat ini"
              error={pwForm.formState.errors.currentPassword?.message}
              {...pwForm.register('currentPassword')}
            />

            <PasswordInput
              label="Password Baru"
              placeholder="Minimal 8 karakter"
              error={pwForm.formState.errors.newPassword?.message}
              {...pwForm.register('newPassword')}
            />

            <PasswordInput
              label="Konfirmasi Password Baru"
              placeholder="Ulangi password baru"
              error={pwForm.formState.errors.confirmPassword?.message}
              {...pwForm.register('confirmPassword')}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={pwForm.formState.isSubmitting}>
                Ubah Password
              </Button>
            </div>
          </form>
        </Card>

        <div className="flex justify-end">
          <Button variant="danger" onClick={async () => { try { await authService.logout() } catch {} finally { logout(); navigate('/') } }}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
