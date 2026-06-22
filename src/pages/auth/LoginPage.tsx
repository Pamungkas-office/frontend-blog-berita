import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (formData: LoginForm) => {
    setApiError('')
    try {
      const result = await authService.login(formData.email, formData.password)
      setAuth(result.user, result.token)
      navigate('/admin/dashboard', { replace: true })
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
            {/* <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">B</span>
            </div> */}
            <h1 className="text-2xl font-bold text-navy-700">Login</h1>
            <p className="mt-1 text-sm text-gray-500">
              Masuk ke akun admin Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {apiError}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="admin@gmail.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="******"
              error={errors.password?.message}
              {...register('password')}
            />

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
