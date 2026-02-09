"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function AdmissionsPage() {
  const router = useRouter();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected

  useEffect(() => {
    fetchAdmissions();
  }, [filter]);

  const fetchAdmissions = async () => {
    setLoading(true);
    
    // Get students created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name)")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching admissions");
    } else {
      setAdmissions(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (studentId) => {
    // Here you can add admission_status column or use a separate admissions table
    toast.success("Student admission approved!");
    fetchAdmissions();
  };

  const handleReject = async (studentId) => {
    if (!window.confirm("Are you sure you want to reject this admission?")) return;
    
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) {
      toast.error("Error rejecting admission");
    } else {
      toast.success("Admission rejected and removed!");
      fetchAdmissions();
    }
  };

  if (loading) return <LoadingSpinner message="Loading admissions..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Student Admissions">
        <button
          onClick={() => router.push("/dashboards/admin/students/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + New Admission
        </button>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Total Admissions (30 days)</p>
          <p className="text-3xl font-bold text-blue-600">{admissions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {admissions.filter(a => {
              const admDate = new Date(a.created_at);
              const now = new Date();
              return admDate.getMonth() === now.getMonth();
            }).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">This Week</p>
          <p className="text-3xl font-bold text-purple-600">
            {admissions.filter(a => {
              const admDate = new Date(a.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return admDate >= weekAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Recent Admissions</h2>
        </div>

        {admissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                  <th className="px-4 py-3 text-left font-semibold">Class</th>
                  <th className="px-4 py-3 text-left font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-left font-semibold">Admission Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.rollno || "-"}</td>
                    <td className="px-4 py-3">{student.classes?.name || "N/A"}</td>
                    <td className="px-4 py-3">{student.mobile_no || "-"}</td>
                    <td className="px-4 py-3">{formatDate(student.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboards/admin/students/${student.id}/edit`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleReject(student.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No recent admissions found</p>
          </div>
        )}
      </div>
    </div>
  );
}