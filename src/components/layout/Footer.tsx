import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-navy-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold">Blog Berita</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Portal berita terkini dan terpercaya. Menyajikan informasi terbaru
              seputar teknologi, bisnis, dan gaya hidup.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Masuk
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories placeholder */}
          {/* <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              Kategori
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Teknologi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Bisnis
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Gaya Hidup
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Pendidikan
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact / Social */}
          {/* <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
              Ikuti Kami
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Blog Berita. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
