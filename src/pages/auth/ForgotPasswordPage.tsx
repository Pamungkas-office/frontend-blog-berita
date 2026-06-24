import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const forgotPasswordSchema = z.object({
  email: z.email('Email tidak valid'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (formData: ForgotPasswordForm) => {
    setApiError('')
    setSuccess(false)
    try {
      await authService.forgotPassword(formData.email)
      setSuccess(true)
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setApiError(
          'Anda sudah meminta link reset password sebelumnya. Silakan periksa email Anda atau tunggu 30 menit sebelum meminta ulang.',
        )
      } else {
        const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
        setApiError(message)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy-700">Lupa Password</h1>
            <p className="mt-1 text-sm text-gray-500">
              Masukkan email terdaftar Anda untuk menerima link reset password
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
                <p className="font-medium text-green-800 mb-1">Email Terkirim!</p>
                <p>
                  Jika email terdaftar, link reset password telah dikirim. Silakan cek inbox atau folder spam Anda.
                </p>
              </div>
              <Link
                to="/auth/login"
                className="inline-block text-sm text-navy-700 hover:text-navy-800 font-medium transition-colors"
              >
                Kembali ke Login
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
                label="Email"
                type="email"
                placeholder="nama@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" loading={isSubmitting} className="w-full">
                Kirim Link Reset
              </Button>
            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-gray-600">
              <Link to="/auth/login" className="text-navy-700 hover:text-navy-800 font-medium transition-colors">
                Kembali ke Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
