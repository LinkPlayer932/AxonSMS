// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import supabase from "@/lib/supabaseClient";
// import { StatCard } from "@/components/dashboards/StatCard";

// export default function AdminDashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [stats, setStats] = useState({
//     students: 0,
//     classes: 0,
//     exams: 0,
//     attendance: 0,
//   });

//   useEffect(() => {
//     const checkSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       if (!data.session) {
//         router.push("/auth/login");
//       } else {
//         setUser(data.session.user);
//         await fetchDashboardStats();
//       }
//       setLoading(false);
//     };

//     checkSession();

//     // Refetch stats when window regains focus
//     const handleFocus = () => {
//       fetchDashboardStats();
//     };

//     window.addEventListener("focus", handleFocus);

//     return () => {
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, [router]);

//   const fetchDashboardStats = async () => {
//     try {
//       const { count: studentCount } = await supabase
//         .from("students")
//         .select("*", { count: "exact", head: true });

//       const { count: classCount } = await supabase
//         .from("classes")
//         .select("*", { count: "exact", head: true });

//       const { count: examCount } = await supabase
//         .from("exams")
//         .select("*", { count: "exact", head: true });

//       const currentDate = new Date();
//       const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//       const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//       const { count: attendanceCount } = await supabase
//         .from("attendance")
//         .select("*", { count: "exact", head: true })
//         .gte("date", firstDayOfMonth.toISOString().split('T')[0])
//         .lte("date", lastDayOfMonth.toISOString().split('T')[0]);

//       setStats({
//         students: studentCount || 0,
//         classes: classCount || 0,
//         exams: examCount || 0,
//         attendance: attendanceCount || 0,
//       });
//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//     }
//   };

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (!user) return null;

//   return (
//     <>
//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">
//           Welcome, <span className="text-blue-600">{user.email}</span>
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <StatCard
//             title="Students"
//             value={stats.students.toString()}
//             subtitle="Total Students"
//             color="bg-cyan-500"
//             href="/dashboards/admin/students"
//           />
//           <StatCard
//             title="Classes"
//             value={stats.classes.toString()}
//             subtitle="Total Classes"
//             color="bg-purple-500"
//             href="/dashboards/admin/classes"
//           />
//           <StatCard
//             title="Exams"
//             value={stats.exams.toString()}
//             subtitle="Total Exams"
//             color="bg-indigo-500"
//             href="/dashboards/admin/exams"
//           />
//           <StatCard
//             title="Attendance"
//             value={stats.attendance.toString()}
//             subtitle="Current Month"
//             color="bg-blue-500"
//             href="/dashboards/admin/attendance"
//           />
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 bg-white p-6 rounded-md shadow">
//           <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <button
//               onClick={() => router.push("/dashboards/admin/students/add")}
//               className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-md transition"
//             >
//               ➕ Add Student
//             </button>
//             <button
//               onClick={() => router.push("/dashboards/admin/attendance/take")}
//               className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md transition"
//             >
//               ✅ Take Attendance
//             </button>
//             <button
//               onClick={() => router.push("/dashboards/admin/exams/add")}
//               className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-md transition"
//             >
//               📝 Create Exam
//             </button>
//             <button
//               onClick={() => router.push("/dashboards/admin/teachers/add")}
//               className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-md transition"
//             >
//               👨‍🏫 Add Teacher
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { StatCard } from "@/components/dashboards/StatCard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    exams: 0,
    attendance: 0,
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/login");
      } else {
        setUser(data.session.user);
        await fetchDashboardStats();
      }
      setLoading(false);
    };

    checkSession();

    const handleFocus = () => {
      fetchDashboardStats();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      const { count: classCount } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true });

      const { count: examCount } = await supabase
        .from("exams")
        .select("*", { count: "exact", head: true });

      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const { count: attendanceCount } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .gte("date", firstDayOfMonth.toISOString().split("T")[0])
        .lte("date", lastDayOfMonth.toISOString().split("T")[0]);

      setStats({
        students: studentCount || 0,
        classes: classCount || 0,
        exams: examCount || 0,
        attendance: attendanceCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!user) return null;

  return (
  <div className="min-h-screen bg-slate-100 px-4 py-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-base sm:text-lg font-medium text-gray-700">
          Welcome – <span className="text-indigo-600">Admin</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 truncate">
          {user.email}
        </p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        title="Students"
        value={stats.students.toString()}
        subtitle="Total Students"
        color="border-cyan-400"
        href="/dashboards/admin/students"
      />
      <StatCard
        title="Classes"
        value={stats.classes.toString()}
        subtitle="Total Classes"
        color="border-purple-400"
        href="/dashboards/admin/classes"
      />
      <StatCard
        title="Exams"
        value={stats.exams.toString()}
        subtitle="Total Exams"
        color="border-indigo-400"
        href="/dashboards/admin/exams"
      />
      <StatCard
        title="Attendance"
        value={stats.attendance.toString()}
        subtitle="Current Month"
        color="border-blue-400"
        href="/dashboards/admin/attendance"
      />
    </div>

    {/* Quick Actions */}
    <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="text-sm font-semibold text-gray-700">
          Quick Actions
        </h2>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => router.push("/dashboards/admin/students/add")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-3 rounded-md transition"
        >
          Add Student
        </button>

        <button
          onClick={() => router.push("/dashboards/admin/attendence/take")}
          className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-3 rounded-md transition"
        >
          Take Attendance
        </button>

        <button
          onClick={() => router.push("/dashboards/admin/exams/add")}
          className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-3 rounded-md transition"
        >
          Create Exam
        </button>

        <button
          onClick={() => router.push("/dashboards/admin/teachers/add")}
          className="bg-pink-500 hover:bg-pink-600 text-white text-sm py-3 rounded-md transition"
        >
          Add Teacher
        </button>
      </div>
    </div>
  </div>
)
}