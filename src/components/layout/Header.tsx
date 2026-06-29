import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui";
import { authService } from "../../services/auth";

export function Header() {
  const { isAuthenticated, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlerLogout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      logout();
      navigate("/blog");
    }
  };

  const navLinks = [
    { to: "/", label: "Beranda" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-navy-700 hidden sm:block">
              Blog Berita
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-navy-700 hover:bg-bg-light rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-3">
            {authLoading ? (
              <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-1.5" />
                    Profil
                  </Button>
                </Link>
                <Button onClick={handlerLogout} variant="danger" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-bg-light"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-bg-light rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-gray-100">
              {authLoading ? (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-bg-light rounded-lg"
                  >
                    Profil
                  </Link>
                  <Button onClick={handlerLogout} variant="danger" className="w-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-navy-700 border border-navy-700 rounded-lg hover:bg-bg-light"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-navy-700 rounded-lg hover:bg-navy-800"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
