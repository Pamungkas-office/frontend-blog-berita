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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke akun admin Anda
          </p>

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
            <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
