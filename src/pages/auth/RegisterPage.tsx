import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { z } from 'zod/v4'
import { authService } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')

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
      navigate('/auth/login', { replace: true })
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
            <h1 className="text-2xl font-bold text-navy-700">Daftar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Buat akun baru
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
              placeholder="email@contoh.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} className="w-full">
              Daftar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/auth/login" className="text-navy-700 hover:text-navy-800 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
