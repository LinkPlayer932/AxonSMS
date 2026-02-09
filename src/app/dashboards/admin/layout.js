// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import supabase from "@/lib/supabaseClient";
// import Link from "next/link";

// export default function AdminLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const { data } = await supabase.auth.getSession();
    
//     if (!data.session) {
//       router.push("/auth/login");
//     } else {
//       setUser(data.session.user);
//     }
//     setLoading(false);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push("/auth/login");
//   };

//   const navItems = [
//     { name: "Dashboard", path: "/dashboards/admin", icon: "📊" },
//     { name: "Students", path: "/dashboards/admin/students", icon: "👨‍🎓" },
//     { name: "Teachers", path: "/dashboards/admin/teachers", icon: "👨‍🏫" },
//     { name: "Classes", path: "/dashboards/admin/classes", icon: "🏫" },
//     { name: "Sections", path: "/dashboards/admin/sections", icon: "📑" },
//     { name: "Subjects", path: "/dashboards/admin/subjects", icon: "📚" },
//     { name: "Exams", path: "/dashboards/admin/exams", icon: "📝" },
//     { name: "Attendance", path: "/dashboards/admin/attendence", icon: "✅" },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-600">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-20"
//         } bg-gradient-to-b from-green-600 to-green-800 text-white transition-all duration-300 flex flex-col`}
//       >
//         {/* Logo/Header */}
//         <div className="p-4 border-b border-green-700">
//           <div className="flex items-center justify-between">
//             {sidebarOpen && (
//               <h1 className="text-xl font-bold">SMS Admin</h1>
//             )}
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="text-white hover:bg-green-700 p-2 rounded"
//             >
//               {sidebarOpen ? "◀" : "▶"}
//             </button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 py-4">
//           <ul className="space-y-2 px-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
//               return (
//                 <li key={item.path}>
//                   <Link
//                     href={item.path}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
//                       isActive
//                         ? "bg-green-700 text-white"
//                         : "text-green-100 hover:bg-green-700 hover:text-white"
//                     }`}
//                   >
//                     <span className="text-xl">{item.icon}</span>
//                     {sidebarOpen && (
//                       <span className="font-medium">{item.name}</span>
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* User Info & Logout */}
//         <div className="p-4 border-t border-green-800">
//           {sidebarOpen && (
//             <div className="mb-3">
//               <p className="text-sm text-green-200">Signed in as</p>
//               <p className="text-sm font-semibold truncate">{user.email}</p>
//             </div>
//           )}
//           <button
//             onClick={handleLogout}
//             className="w-full bg-white text-green-700 font-extrabold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
//           >
//             <span>🚪</span>
//             {sidebarOpen && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         {/* Top Bar */}
//         <header className="bg-white shadow-sm">
//           <div className="px-6 py-4">
//             <h2 className="text-2xl font-bold text-gray-800">
//               School Management System
//             </h2>
//           </div>
//         </header>

//         {/* Page Content */}
//         <div className="p-0">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

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
  const [expandedMenus, setExpandedMenus] = useState({
    students: false,
    teachers: false,
    classes: false,
    exams: false,
    attendance: false,
    fees: false,
  });

  useEffect(() => {
    checkAuth();
    // Auto-expand active menu
    autoExpandActiveMenu();
  }, [pathname]);

  const autoExpandActiveMenu = () => {
    if (pathname.includes("/students")) {
      setExpandedMenus(prev => ({ ...prev, students: true }));
    } else if (pathname.includes("/teachers")) {
      setExpandedMenus(prev => ({ ...prev, teachers: true }));
    } else if (pathname.includes("/classes") || pathname.includes("/sections")) {
      setExpandedMenus(prev => ({ ...prev, classes: true }));
    } else if (pathname.includes("/exams")) {
      setExpandedMenus(prev => ({ ...prev, exams: true }));
    } else if (pathname.includes("/attendance")) {
      setExpandedMenus(prev => ({ ...prev, attendance: true }));
    } else if (pathname.includes("/fees")) {
      setExpandedMenus(prev => ({ ...prev, fees: true }));
    }
  };

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

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/dashboards/admin", 
      icon: "📊",
      type: "single"
    },
    {
      name: "Students",
      icon: "👨‍🎓",
      type: "dropdown",
      key: "students",
      subItems: [
        { name: "All Students", path: "/dashboards/admin/students" },
        { name: "Add Student", path: "/dashboards/admin/students/add" },
        { name: "Admissions", path: "/dashboards/admin/students/admissions" },
        { name: "Promoted Students", path: "/dashboards/admin/students/promoted" },
      ]
    },
    {
      name: "Teachers",
      icon: "👨‍🏫",
      type: "dropdown",
      key: "teachers",
      subItems: [
        { name: "All Teachers", path: "/dashboards/admin/teachers" },
        { name: "Add Teacher", path: "/dashboards/admin/teachers/add" },
        { name: "Teacher Attendance", path: "/dashboards/admin/teachers/attendance" },
      ]
    },
    {
      name: "Classes & Sections",
      icon: "🏫",
      type: "dropdown",
      key: "classes",
      subItems: [
        { name: "All Classes", path: "/dashboards/admin/classes" },
        { name: "Add Class", path: "/dashboards/admin/classes/add" },
        { name: "All Sections", path: "/dashboards/admin/sections" },
        { name: "Add Section", path: "/dashboards/admin/sections/add" },
      ]
    },
    { 
      name: "Subjects", 
      path: "/dashboards/admin/subjects", 
      icon: "📚",
      type: "single"
    },
    {
      name: "Exams",
      icon: "📝",
      type: "dropdown",
      key: "exams",
      subItems: [
        { name: "All Exams", path: "/dashboards/admin/exams" },
        { name: "Create Exam", path: "/dashboards/admin/exams/add" },
        { name: "Exam Results", path: "/dashboards/admin/exams/results" },
      ]
    },
    {
      name: "Attendance",
      icon: "✅",
      type: "dropdown",
      key: "attendance",
      subItems: [
        { name: "Dashboard", path: "/dashboards/admin/attendance" },
        { name: "Take Attendance", path: "/dashboards/admin/attendance/take" },
        { name: "View Reports", path: "/dashboards/admin/attendance/reports" },
      ]
    },
    {
      name: "Fees",
      icon: "💰",
      type: "dropdown",
      key: "fees",
      subItems: [
        { name: "Fee Structure", path: "/dashboards/admin/fees" },
        { name: "Collect Fee", path: "/dashboards/admin/fees/collect" },
        { name: "Fee Reports", path: "/dashboards/admin/fees/reports" },
      ]
    },
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
        } bg-gradient-to-b from-green-600 to-green-800 text-white transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-white">
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
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              if (item.type === "single") {
                const isActive = pathname === item.path;
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
              }

              // Dropdown menu
              const isExpanded = expandedMenus[item.key];
              const hasActiveChild = item.subItems.some(sub => pathname.startsWith(sub.path));

              return (
                <li key={item.key}>
                  {/* Parent Menu */}
                  <button
                    onClick={() => sidebarOpen && toggleMenu(item.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      hasActiveChild
                        ? "bg-green-700 text-white"
                        : "text-green-100 hover:bg-green-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {sidebarOpen && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isActive = pathname === subItem.path;
                        return (
                          <li key={subItem.path}>
                            <Link
                              href={subItem.path}
                              className={`block px-4 py-2 rounded-lg text-sm transition ${
                                isActive
                                  ? "bg-green-600 text-white font-semibold"
                                  : "text-green-200 hover:bg-green-600 hover:text-white"
                              }`}
                            >
                              • {subItem.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
            className="w-full bg-white hover:bg-green-600 text-green-700 font-extrabold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
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