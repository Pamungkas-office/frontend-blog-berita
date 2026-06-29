import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loading } from '../common/Loading'

interface AuthRedirectProps {
  children: React.ReactNode
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}
