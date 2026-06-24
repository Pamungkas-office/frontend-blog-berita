import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PasswordInput } from '../../components/ui/PasswordInput'

const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [apiError, setApiError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [sendingResend, setSendingResend] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (formData: LoginForm) => {
    setApiError('')
    setUnverifiedEmail('')
    setResendSent(false)
    try {
      const result = await authService.login(formData.email, formData.password)
      setAuth(result.user, result.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setUnverifiedEmail(formData.email)
        setApiError('Email belum diverifikasi. Silakan cek email Anda atau Kirim Ulang link verifikasi.')
      } else {
        const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan'
        setApiError(message)
      }
    }
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return
    setSendingResend(true)
    try {
      await authService.resendVerification(unverifiedEmail)
      setResendSent(true)
      setApiError('')
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Gagal mengirim ulang'
      setApiError(message)
    } finally {
      setSendingResend(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            {/* <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">B</span>
            </div> */}
            <h1 className="text-2xl font-bold text-navy-700">Login</h1>
            <p className="mt-1 text-sm text-gray-500">
              Masuk ke akun admin Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {apiError && !resendSent && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <p>{apiError}</p>
                {unverifiedEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={sendingResend}
                    className="mt-2 text-sm font-medium text-navy-700 hover:text-navy-800 underline disabled:opacity-50"
                  >
                    {sendingResend ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                  </button>
                )}
              </div>
            )}
            {resendSent && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                Link verifikasi telah dikirim ulang. Silakan cek email Anda.
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="user@gmail.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="******"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-navy-700 hover:text-navy-800 font-medium transition-colors"
              >
                Lupa Password?
              </Link>
            </div>

            <Button type="submit" loading={isSubmitting} className="w-full">
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/auth/register" className="text-navy-700 hover:text-navy-800 font-medium transition-colors">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
