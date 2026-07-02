import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { MainLayout, AdminLayout } from "./components/layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthRedirect } from "./components/auth/AuthRedirect";
import { AdsenseHead } from "./components/common/AdsenseHead";

// Public pages
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./pages/blog/BlogListPage";
import { BlogDetailPage } from "./pages/blog/BlogDetailPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { ProfilePage } from "./pages/user/ProfilePage";

// Admin pages (content management)
import { DashboardPage } from "./pages/admin/dashboard/DashboardPage";
import { BlogIndex } from "./pages/admin/blog/BlogIndex";
import { BlogCreate } from "./pages/admin/blog/BlogCreate";
import { BlogEdit } from "./pages/admin/blog/BlogEdit";
import { BlogGenerate } from "./pages/admin/blog/BlogGenerate";
import { CategoryIndex } from "./pages/admin/category/CategoryIndex";
import { CategoryCreate } from "./pages/admin/category/CategoryCreate";
import { CategoryEdit } from "./pages/admin/category/CategoryEdit";
import { TagIndex } from "./pages/admin/tag/TagIndex";
import { TagCreate } from "./pages/admin/tag/TagCreate";
import { TagEdit } from "./pages/admin/tag/TagEdit";
import { CommentIndex } from "./pages/admin/comment/CommentIndex";
import { AdIndex } from "./pages/admin/ad/AdIndex";
import { ApprovalQueuePage as AdminApprovalQueue } from "./pages/admin/approval/ApprovalQueuePage";
import { ApprovalHistoryPage as AdminApprovalHistory } from "./pages/admin/approval/ApprovalHistoryPage";
import { ApprovalBlogEdit as AdminApprovalBlogEdit } from "./pages/admin/approval/ApprovalBlogEdit";

// Super admin pages (oversight)
import { DashboardPage as SuperDashboard } from "./pages/super_admin/dashboard/DashboardPage";
import { UserManagementPage } from "./pages/super_admin/users/UserManagementPage";
import { ApprovalQueuePage } from "./pages/super_admin/approval/ApprovalQueuePage";
import { ApprovalHistoryPage } from "./pages/super_admin/approval/ApprovalHistoryPage";
import { ApprovalConfigPage } from "./pages/super_admin/approval/ApprovalConfigPage";
import { ApprovalBlogEdit as SuperAdminApprovalBlogEdit } from "./pages/super_admin/approval/ApprovalBlogEdit";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdsenseHead />
          <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<AuthRedirect><HomePage /></AuthRedirect>} />
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
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Admin routes — content management (admin + super_admin) */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="blog" element={<BlogIndex />} />
                <Route path="blog/create" element={<BlogCreate />} />
                <Route path="blog/generate" element={<BlogGenerate />} />
                <Route path="blog/:id/edit" element={<BlogEdit />} />
                <Route path="category" element={<CategoryIndex />} />
                <Route path="category/create" element={<CategoryCreate />} />
                <Route path="category/:id/edit" element={<CategoryEdit />} />
                <Route path="tag" element={<TagIndex />} />
                <Route path="tag/create" element={<TagCreate />} />
                <Route path="tag/:id/edit" element={<TagEdit />} />
                <Route path="comment" element={<CommentIndex />} />
                <Route path="ads" element={<AdIndex />} />
                <Route path="approval-queue" element={<AdminApprovalQueue />} />
                <Route path="approval-queue/:id/edit" element={<AdminApprovalBlogEdit />} />
                <Route path="approval-history" element={<AdminApprovalHistory />} />
              </Route>
            </Route>

            {/* Super admin routes — oversight (super_admin only) */}
            <Route element={<ProtectedRoute requireSuperAdmin />}>
              <Route path="/super-admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<SuperDashboard />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="approval-queue" element={<ApprovalQueuePage />} />
                <Route path="approval-queue/:id/edit" element={<SuperAdminApprovalBlogEdit />} />
                <Route path="approval-history" element={<ApprovalHistoryPage />} />
                <Route path="approval-config" element={<ApprovalConfigPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
