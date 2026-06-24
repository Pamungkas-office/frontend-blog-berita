import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authService } from '../../services/auth'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token verifikasi tidak ditemukan.')
      return
    }

    authService.verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Email berhasil diverifikasi! Silakan login.')
      })
      .catch((err: any) => {
        setStatus('error')
        setMessage(err?.response?.data?.message || 'Token tidak valid atau sudah kedaluwarsa.')
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light">
      <div className="w-full max-w-md p-4 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-navy-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-navy-700 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold text-navy-700">Memverifikasi Email...</h1>
              <p className="text-sm text-gray-500">Harap tunggu sebentar.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold text-navy-700">Email Terverifikasi!</h1>
              <p className="text-sm text-gray-500">{message}</p>
              <Link
                to="/auth/login"
                className="inline-block px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
              >
                Login Sekarang
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-brand-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold text-navy-700">Verifikasi Gagal</h1>
              <p className="text-sm text-gray-500">{message}</p>
              <Link
                to="/auth/login"
                className="inline-block px-4 py-2 bg-navy-700 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors"
              >
                Kembali ke Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
