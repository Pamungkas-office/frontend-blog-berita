import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loading } from '../common/Loading'

interface ProtectedRouteProps {
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
}

export function ProtectedRoute({ requireAdmin, requireSuperAdmin }: ProtectedRouteProps) {
  const { isAuthenticated, authLoading, user } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requireSuperAdmin && user?.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
