import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { PasswordInput } from '../../components/ui/PasswordInput'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (formData: ResetPasswordForm) => {
    if (!token) return
    setApiError('')
    try {
      await authService.resetPassword(token, formData.password)
      setSuccess(true)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
      setApiError(message)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="w-full max-w-md p-4 sm:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-brand-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-navy-700 mb-2">Token Tidak Ditemukan</h1>
            <p className="text-sm text-gray-500 mb-6">
              Link reset password tidak valid. Silakan minta link baru.
            </p>
            <Link
              to="/auth/forgot-password"
              className="inline-block px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
            >
              Minta Link Baru
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy-700">Reset Password</h1>
            <p className="mt-1 text-sm text-gray-500">
              Masukkan password baru Anda
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-6">
                <div className="flex justify-center mb-3">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium text-green-800 mb-1">Password Berhasil Direset!</p>
                <p>Silakan login dengan password baru Anda.</p>
              </div>
              <Link
                to="/auth/login"
                className="inline-block px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
              >
                Login Sekarang
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {apiError}
                </div>
              )}

              <PasswordInput
                label="Password Baru"
                placeholder="Minimal 8 karakter"
                error={errors.password?.message}
                {...register('password')}
              />

              <PasswordInput
                label="Konfirmasi Password"
                placeholder="Ulangi password baru"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" loading={isSubmitting} className="w-full">
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
