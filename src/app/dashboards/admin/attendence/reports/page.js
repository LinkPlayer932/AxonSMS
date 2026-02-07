"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate, formatPercentage } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function AttendenceReportsPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchClasses();
    
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    
    setLoading(false);
  }, []);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });
    setClasses(data || []);
  };

  const generateReport = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select date range");
      return;
    }

    setGenerating(true);

    // Fetch students in selected class
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("id, name, rollno")
      .eq("class_id", selectedClass)
      .order("name", { ascending: true });

    if (studentsError) {
      toast.error("Error fetching students");
      setGenerating(false);
      return;
    }

    setStudents(studentsData || []);

    // Fetch attendance records for date range
    const { data: attendenceData, error: attendenceError } = await supabase
      .from("attendence")
      .select("*")
      .eq("class_id", selectedClass)
      .gte("date", startDate)
      .lte("date", endDate);

    if (attendenceError) {
      toast.error("Error fetching attendence");
      setGenerating(false);
      return;
    }

    // Calculate statistics for each student
    const report = studentsData.map((student) => {
      const studentAttendence = attendenceData.filter(
        (a) => a.student_id === student.id
      );

      const totalDays = studentAttendence.length;
      const presentDays = studentAttendence.filter(
        (a) => a.status === "Present"
      ).length;
      const absentDays = studentAttendence.filter(
        (a) => a.status === "Absent"
      ).length;
      const lateDays = studentAttendence.filter(
        (a) => a.status === "Late"
      ).length;
      const excusedDays = studentAttendence.filter(
        (a) => a.status === "Excused"
      ).length;

      const attendenceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        ...student,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendenceRate,
      };
    });

    setReportData(report);
    setGenerating(false);
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Attendence Reports" />

      <div className="bg-white p-6 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Class Selection */}
          <div>
            <label className="block mb-1 font-semibold">Select Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-1 font-semibold">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 font-semibold">End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={generating}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition"
        >
          {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Report Results */}
      {reportData.length > 0 && (
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              Attendence Report ({formatDate(startDate)} - {formatDate(endDate)})
            </h2>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold">Total Days</th>
                <th className="px-4 py-3 text-left font-semibold">Present</th>
                <th className="px-4 py-3 text-left font-semibold">Absent</th>
                <th className="px-4 py-3 text-left font-semibold">Late</th>
                <th className="px-4 py-3 text-left font-semibold">Excused</th>
                <th className="px-4 py-3 text-left font-semibold">Attendence %</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{student.rollno || "-"}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.totalDays}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {student.presentDays}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    {student.absentDays}
                  </td>
                  <td className="px-4 py-3 text-yellow-600 font-semibold">
                    {student.lateDays}
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">
                    {student.excusedDays}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        student.attendenceRate >= 75
                          ? "text-green-600"
                          : student.attendenceRate >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(student.attendenceRate, 1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}