import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui';
import { authService } from '../../services/auth';

export function Header() {
  const {isAuthenticated} = useAuth();

  const handlerLogout = async () => {
    try {
      await authService.logout()
    } catch (error: any) {
      console.log(error.message)
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Blog Berita
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Beranda</Link>
            <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link>
            { isAuthenticated ? (
              <Button onClick={handlerLogout} className='w-20 rounded-md bg-red-500 hover:bg-red-600'>Logout</Button>
            ) 
            : 
            (
              <>
                <Link to="/auth/register" className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Daftar</Link>
                <Link to="/auth/login" className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
              </>
            )
          }
          </nav>
        </div>
      </div>
    </header>
  )
}
