import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { MainLayout, AdminLayout } from "./components/layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdsenseHead } from "./components/common/AdsenseHead";

// Public pages
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./pages/blog/BlogListPage";
import { BlogDetailPage } from "./pages/blog/BlogDetailPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ProfilePage } from "./pages/user/ProfilePage";

// Admin pages
import { DashboardPage } from "./pages/admin/dashboard/DashboardPage";
import { BlogIndex } from "./pages/admin/blog/BlogIndex";
import { BlogCreate } from "./pages/admin/blog/BlogCreate";
import { BlogEdit } from "./pages/admin/blog/BlogEdit";
import { CategoryIndex } from "./pages/admin/category/CategoryIndex";
import { CategoryCreate } from "./pages/admin/category/CategoryCreate";
import { CategoryEdit } from "./pages/admin/category/CategoryEdit";
import { TagIndex } from "./pages/admin/tag/TagIndex";
import { TagCreate } from "./pages/admin/tag/TagCreate";
import { TagEdit } from "./pages/admin/tag/TagEdit";
import { CommentIndex } from "./pages/admin/comment/CommentIndex";
import { AdIndex } from "./pages/admin/ad/AdIndex";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdsenseHead />
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              {/* Profile — requires login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Auth routes (no layout) */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Admin routes (protected + require admin) */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="blog" element={<BlogIndex />} />
                <Route path="blog/create" element={<BlogCreate />} />
                <Route path="blog/:id/edit" element={<BlogEdit />} />
                <Route path="category" element={<CategoryIndex />} />
                <Route path="category/create" element={<CategoryCreate />} />
                <Route path="category/:id/edit" element={<CategoryEdit />} />
                <Route path="tag" element={<TagIndex />} />
                <Route path="tag/create" element={<TagCreate />} />
                <Route path="tag/:id/edit" element={<TagEdit />} />
                <Route path="comment" element={<CommentIndex />} />
                <Route path="ads" element={<AdIndex />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
