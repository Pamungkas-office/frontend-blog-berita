import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, FolderTree, Tags, MessageSquare,
  DollarSign, Sparkles, X, LogOut, CheckCircle, Users, Settings,
} from "lucide-react";
import { authService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { adminApprovalService } from "../../services/admin/approval";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'super_admin' || user?.is_approver) {
      adminApprovalService.getQueue()
        .then((q) => setQueueCount(q.pagination?.total ?? q.data.length ?? 0))
        .catch(() => {});
    }
  }, [user]);

  const isSuperAdmin = user?.role === 'super_admin';
  const isApprover = user?.is_approver == true;

  const handlerLogout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      logout();
      navigate("/");
    }
  };

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-navy-700">
          {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isSuperAdmin ? (
          <>
            {/* ── Super Admin Management ── */}
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Management
            </p>

            <NavLink
              to="/super-admin/dashboard"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/super-admin/users"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <Users className="w-5 h-5" />
              Admin Management
            </NavLink>

            <NavLink
              to="/super-admin/approval-config"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <Settings className="w-5 h-5" />
              Approval Config
            </NavLink>

            <NavLink
              to="/super-admin/approval-queue"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <CheckCircle className="w-5 h-5" />
              <span className="flex-1">Approval Queue</span>
              {queueCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {queueCount > 99 ? '99+' : queueCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/super-admin/approval-history"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <MessageSquare className="w-5 h-5" />
              History
            </NavLink>
          </>
        ) : (
          <>
            {/* ── Content Management (admin only) ── */}
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Content
            </p>

            <NavLink
              to="/admin/dashboard"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/blog"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive && !location.pathname.startsWith('/admin/blog/generate')
                    ? "bg-navy-700 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <FileText className="w-5 h-5" />
              Blog Posts
            </NavLink>

            <NavLink
              to="/admin/blog/generate"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <Sparkles className="w-5 h-5" />
              AI Generate
            </NavLink>

            <NavLink
              to="/admin/category"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <FolderTree className="w-5 h-5" />
              Categories
            </NavLink>

            <NavLink
              to="/admin/tag"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <Tags className="w-5 h-5" />
              Tags
            </NavLink>

            <NavLink
              to="/admin/comment"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <MessageSquare className="w-5 h-5" />
              Comments
            </NavLink>

            <NavLink
              to="/admin/ads"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                }`
              }
            >
              <DollarSign className="w-5 h-5" />
              Iklan
            </NavLink>

            {/* ── Approval (admin with is_approver) ── */}
            {isApprover && (
              <>
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
                  Approval
                </p>

                <NavLink
                  to="/admin/approval-queue"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                    }`
                  }
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="flex-1">Approval Queue</span>
                  {queueCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                      {queueCount > 99 ? '99+' : queueCount}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/approval-history"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-navy-700 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
                    }`
                  }
                >
                  <MessageSquare className="w-5 h-5" />
                  History
                </NavLink>
              </>
            )}
          </>
        )}
      </div>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handlerLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
