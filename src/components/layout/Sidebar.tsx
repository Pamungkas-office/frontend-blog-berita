import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, FolderTree, Tags, MessageSquare } from "lucide-react";
import { Button } from "../ui";
import { authService } from "../../services/auth";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/blog", label: "Blog Posts", icon: FileText },
  { to: "/admin/category", label: "Categories", icon: FolderTree },
  { to: "/admin/tag", label: "Tags", icon: Tags },
  { to: "/admin/comment", label: "Comments", icon: MessageSquare },
];


export function Sidebar() {

  const handlerLogout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  };
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}

        <Button
          onClick={handlerLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600"
        >
          Logout
        </Button>
      </nav>
    </aside>
  );
}
