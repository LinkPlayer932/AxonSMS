"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ATTENDENCE_STATUS } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";  // ✅ FIXED - Added curly braces
import toast from "react-hot-toast";

// ... rest of your code stays the same until line 166 ...

export default function TakeAttendencePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdFromQuery = searchParams.get("classId");

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classIdFromQuery || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendence, setAttendence] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });
    setClasses(data || []);
    setLoading(false);
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    
    // Fetch students in selected class
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("id, name, rollno")
      .eq("class_id", selectedClass)
      .order("name", { ascending: true });

    if (studentsError) {
      toast.error("Error fetching students");
      setLoadingStudents(false);
      return;
    }

    setStudents(studentsData || []);

    // Fetch existing attendance for selected date
    const { data: attendenceData } = await supabase
      .from("attendence")
      .select("*")
      .eq("class_id", selectedClass)
      .eq("date", selectedDate);

    const attendenceMap = {};
    (attendenceData || []).forEach((record) => {
      attendenceMap[record.student_id] = {
        id: record.id,
        status: record.status,
      };
    });
    setAttendence(attendenceMap);
    setLoadingStudents(false);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendence({
      ...attendence,
      [studentId]: {
        ...attendence[studentId],
        status: status,
      },
    });
  };

  const handleMarkAll = (status) => {
    const newAttendence = { ...attendence };
    students.forEach((student) => {
      newAttendence[student.id] = {
        ...newAttendence[student.id],
        status: status,
      };
    });
    setAttendence(newAttendence);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (students.length === 0) {
      toast.error("No students in this class");
      return;
    }

    const updates = [];
    const inserts = [];

    for (const student of students) {
      const status = attendence[student.id]?.status || "Absent";
      
      if (attendence[student.id]?.id) {
        // Update existing record
        updates.push({
          id: attendence[student.id].id,
          status: status,
        });
      } else {
        // Insert new record
        inserts.push({
          student_id: student.id,
          class_id: selectedClass,
          date: selectedDate,
          status: status,
        });
      }
    }

    // Perform updates
    for (const update of updates) {
      const { error } = await supabase
        .from("attendence")
        .update({ status: update.status })
        .eq("id", update.id);

      if (error) {
        toast.error("Error updating attendence: " + error.message);
        return;
      }
    }

    // Perform inserts
    if (inserts.length > 0) {
      const { error } = await supabase
        .from("attendence")
        .insert(inserts);

      if (error) {
        toast.error("Error saving attendence: " + error.message);
        return;
      }
    }

     toast.success("Attendence saved successfully!");
    router.push("/dashboards/admin/attendence");  // ✅ FIXED - Removed page.js
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Take Attendence" />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow">
        {/* Class and Date Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-semibold">Select Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
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

          <div>
            <label className="block mb-1 font-semibold">Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        {selectedClass && students.length > 0 && (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll("Present")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition text-sm"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("Absent")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition text-sm"
            >
              Mark All Absent
            </button>
          </div>
        )}

        {/* Students List */}
        {loadingStudents ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : selectedClass && students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                  <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{student.rollno || "-"}</td>
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={attendence[student.id]?.status || "Present"}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedClass ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found in this class</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Please select a class to take attendence</p>
          </div>
        )}

        {/* Submit Button */}
        {selectedClass && students.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg transition"
            >
              Save Attendence
            </button>
          </div>
        )}
      </form>
    </div>
  );
}