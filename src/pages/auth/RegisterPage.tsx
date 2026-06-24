import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/ui/PasswordInput'

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (formData: RegisterForm) => {
    setApiError('')
    try {
      await authService.register(formData.name, formData.email, formData.password)
      setSuccess(true)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy-700">Daftar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Buat akun baru
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-6">
                <div className="flex justify-center mb-3">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-medium text-green-800 mb-1">Registrasi Berhasil!</p>
                <p>
                  Silakan cek email Anda untuk verifikasi. Link akan kedaluwarsa dalam 24 jam.
                </p>
              </div>
              <Link
                to="/auth/login"
                className="inline-block text-sm text-navy-700 hover:text-navy-800 font-medium transition-colors"
              >
                Ke Halaman Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {apiError}
                </div>
              )}

              <Input
                label="Nama"
                type="text"
                placeholder="Nama lengkap"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="user@gmail.com"
                error={errors.email?.message}
                {...register('email')}
              />

            <PasswordInput
              label="Password"
              placeholder="Minimal 8 karakter"
              error={errors.password?.message}
              {...register('password')}
            />

              <Button type="submit" loading={isSubmitting} className="w-full">
                Daftar
              </Button>
            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/auth/login" className="text-navy-700 hover:text-navy-800 font-medium transition-colors">
                Masuk
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
