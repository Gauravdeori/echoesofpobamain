import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/integrations/firebase/AuthContext";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Image,
  Users,
  Heart,
  UserCog,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Posts & Updates", icon: FileText, path: "/admin/posts" },
  { label: "Events", icon: CalendarDays, path: "/admin/events" },
  { label: "Gallery", icon: Image, path: "/admin/gallery" },
  { label: "Volunteers", icon: Users, path: "/admin/volunteers" },
  { label: "Donations", icon: Heart, path: "/admin/donations" },
  { label: "Team Members", icon: UserCog, path: "/admin/team" },
  { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f0d] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.06]
          bg-[#080d0a]/95 backdrop-blur-xl transition-transform duration-300 ease-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-base font-semibold text-white tracking-tight">
              Echoes of Poba
            </span>
          </div>
          <button
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-emerald-500/[0.12] text-emerald-400 shadow-sm shadow-emerald-500/5"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                    }`
                  }
                >
                  <item.icon
                    className={`h-[18px] w-[18px] flex-shrink-0 transition-colors`}
                  />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-[11px] font-bold text-white uppercase">
              {user?.email?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white/70">
                {user?.email || "admin"}
              </p>
              <p className="text-[10px] text-white/30">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-400/70 transition-all duration-150 hover:bg-red-500/[0.08] hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center border-b border-white/[0.06] bg-[#0a0f0d]/80 px-4 backdrop-blur-md lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80 lg:hidden"
            id="admin-sidebar-toggle"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
