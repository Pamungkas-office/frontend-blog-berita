import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { AdBanner } from '../common/AdBanner'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <AdBanner position="header" className="py-2 bg-gray-100 border-b border-gray-200" />
      <main className="flex-1">
        <Outlet />
      </main>
      <AdBanner position="footer" className="py-2 bg-gray-100 border-t border-gray-200" />
      <Footer />
    </div>
  )
}
