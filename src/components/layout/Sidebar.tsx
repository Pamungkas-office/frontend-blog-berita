import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, FolderTree, Tags, MessageSquare, DollarSign, X, LogOut } from "lucide-react";
import { authService } from "../../services/auth";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/category", label: "Categories", icon: FolderTree },
  { to: "/admin/tag", label: "Tags", icon: Tags },
  { to: "/admin/comment", label: "Comments", icon: MessageSquare },
  { to: "/admin/ads", label: "Iklan", icon: DollarSign },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const handlerLogout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  };

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-navy-700">Admin Panel</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin/dashboard"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-navy-700 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-navy-700"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handlerLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
