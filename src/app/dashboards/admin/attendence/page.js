"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

export default function AttendenceDashboardPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    presentToday: 0,
    absentToday: 0,
    attendenceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Classes
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, name")
        .order("name", { ascending: true });
      setClasses(classesData || []);

      // Attendance stats
      const today = new Date().toISOString().split("T")[0];
      const { data: attendenceData } = await supabase
        .from("attendence")
        .select("status")
        .eq("date", today);

      const total = attendenceData?.length || 0;
      const present = attendenceData?.filter(a => a.status === "Present").length || 0;
      const absent = attendenceData?.filter(a => a.status === "Absent").length || 0;
      const rate = total > 0 ? (present / total) * 100 : 0;

      setStats({ totalToday: total, presentToday: present, absentToday: absent, attendenceRate: rate });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching attendence stats");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAttendence = (classId) => {
    router.push(`/dashboards/admin/attendence/take?classId=${classId}`);
  };

  if (loading) return <LoadingSpinner message="Loading attendence data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Attendence Management">
        <button
          onClick={() => router.push("/dashboards/admin/attendence/reports")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
        >
          View Reports
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-md shadow">
          <p className="text-sm text-gray-500 mb-1">Total Today</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalToday}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow">
          <p className="text-sm text-gray-500 mb-1">Present Today</p>
          <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow">
          <p className="text-sm text-gray-500 mb-1">Absent Today</p>
          <p className="text-3xl font-bold text-red-600">{stats.absentToday}</p>
        </div>
        <div className="bg-white p-6 rounded-md shadow">
          <p className="text-sm text-gray-500 mb-1">Attendence Rate</p>
          <p className="text-3xl font-bold text-blue-600">{stats.attendenceRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Take Attendence by Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => handleTakeAttendence(cls.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-md font-semibold transition"
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboards/admin/attendence/take")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
          >
            📋 Take Attendence
          </button>
          <button
            onClick={() => router.push("/dashboards/admin/attendence/reports")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md transition"
          >
            📊 View Reports
          </button>
        </div>
      </div>
    </div>
  );
}