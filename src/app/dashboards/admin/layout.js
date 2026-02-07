// const AdminLayout = ({ children }) => {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar activeItem="dashboard" onItemClick={() => {}} userRole="Admin" />
//       <div className="flex-1 ml-64">
//         {children}
//       </div>
//     </div>
//   );
// };

// const AuthLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
//       <div className="max-w-md w-full">
//         {children}
//       </div>
//     </div>
//   );
// };

// export { AdminLayout, AuthLayout };
// app/dashboards/admin/layout.js

"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      router.push("/auth/login");
    } else {
      setUser(data.session.user);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboards/admin", icon: "📊" },
    { name: "Students", path: "/dashboards/admin/students", icon: "👨‍🎓" },
    { name: "Teachers", path: "/dashboards/admin/teachers", icon: "👨‍🏫" },
    { name: "Classes", path: "/dashboards/admin/classes", icon: "🏫" },
    { name: "Sections", path: "/dashboards/admin/sections", icon: "📑" },
    { name: "Subjects", path: "/dashboards/admin/subjects", icon: "📚" },
    { name: "Exams", path: "/dashboards/admin/exams", icon: "📝" },
    { name: "Attendance", path: "/dashboards/admin/attendence", icon: "✅" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-green-600 to-green-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">SMS Admin</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-green-700 p-2 rounded"
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-green-700 text-white"
                        : "text-green-100 hover:bg-green-700 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-green-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm text-green-200">Signed in as</p>
              <p className="text-sm font-semibold truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-white text-green-700 font-extrabold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">
              School Management System
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-0">
          {children}
        </div>
      </main>
    </div>
  );
}