import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden mr-3"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>


      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-semibold">
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.name ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
