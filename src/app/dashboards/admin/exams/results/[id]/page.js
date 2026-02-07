"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getGradeLetter, formatPercentage } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function ExamResultsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id;

  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId && examId !== "undefined") {
      fetchExamAndStudents();
    } else {
      setLoading(false);
    }
  }, [examId]);

  const fetchExamAndStudents = async () => {
    // Fetch exam details
    const { data: examData, error: examError } = await supabase
      .from("exams")
      .select("*, classes(name), subjects(name)")
      .eq("id", examId)
      .single();

    if (examError) {
      toast.error("Error fetching exam: " + examError.message);
      router.push("/dashboards/admin/exams/results");
      return;
    }

    setExam(examData);

    // Fetch students in the same class
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("id, name, rollno")
      .eq("class_id", examData.class_id)
      .order("name", { ascending: true });

    if (studentsError) {
      toast.error("Error fetching students");
    } else {
      setStudents(studentsData || []);
    }

    // Fetch existing results
    const { data: resultsData } = await supabase
      .from("exam_results")
      .select("*")
      .eq("exam_id", examId);

    const resultsMap = {};
    (resultsData || []).forEach((result) => {
      resultsMap[result.student_id] = {
        id: result.id,
        marks_obtained: result.marks_obtained,
      };
    });
    setResults(resultsMap);

    setLoading(false);
  };

  const handleMarksChange = (studentId, marks) => {
    setResults({
      ...results,
      [studentId]: {
        ...results[studentId],
        marks_obtained: marks,
      },
    });
  };

  const handleSaveResults = async () => {
    const updates = [];
    const inserts = [];

    for (const studentId in results) {
      const marks = results[studentId]?.marks_obtained;
      
      if (!marks && marks !== 0) continue; // Skip empty marks

      const marksObtained = parseFloat(marks);
      
      if (marksObtained < 0 || marksObtained > exam.total_marks) {
        toast.error(`Invalid marks for a student. Must be between 0 and ${exam.total_marks}`);
        return;
      }

      const percentage = (marksObtained / exam.total_marks) * 100;
      const grade = getGradeLetter(percentage);
      const isPassed = exam.passing_marks 
        ? marksObtained >= exam.passing_marks 
        : percentage >= 40;

      if (results[studentId]?.id) {
        // Update existing result
        updates.push({
          id: results[studentId].id,
          marks_obtained: marksObtained,
          percentage: percentage,
          grade: grade,
          is_passed: isPassed,
        });
      } else {
        // Insert new result
        inserts.push({
          exam_id: examId,
          student_id: studentId,
          marks_obtained: marksObtained,
          percentage: percentage,
          grade: grade,
          is_passed: isPassed,
        });
      }
    }

    // Perform updates
    for (const update of updates) {
      const { error } = await supabase
        .from("exam_results")
        .update({
          marks_obtained: update.marks_obtained,
          percentage: update.percentage,
          grade: update.grade,
          is_passed: update.is_passed,
        })
        .eq("id", update.id);

      if (error) {
        toast.error("Error updating results: " + error.message);
        return;
      }
    }

    // Perform inserts
    if (inserts.length > 0) {
      const { error } = await supabase
        .from("exam_results")
        .insert(inserts);

      if (error) {
        toast.error("Error saving results: " + error.message);
        return;
      }
    }

    toast.success("Results saved successfully!");
    fetchExamAndStudents(); // Refresh data
  };

  if (loading) return <LoadingSpinner message="Loading exam details..." />;

  if (!exam) {
    return (
      <div className="p-6">
        <p>Exam not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title={`Results: ${exam.name}`} />

      {/* Exam Info Card */}
      <div className="bg-white p-6 rounded-md shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-semibold">{exam.classes?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-semibold">{exam.subjects?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Marks</p>
            <p className="font-semibold">{exam.total_marks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passing Marks</p>
            <p className="font-semibold">{exam.passing_marks || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Roll No</th>
              <th className="px-4 py-3 text-left font-semibold">Student Name</th>
              <th className="px-4 py-3 text-left font-semibold">Marks Obtained</th>
              <th className="px-4 py-3 text-left font-semibold">Percentage</th>
              <th className="px-4 py-3 text-left font-semibold">Grade</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const marksObtained = results[student.id]?.marks_obtained || "";
              const percentage = marksObtained 
                ? (parseFloat(marksObtained) / exam.total_marks) * 100 
                : 0;
              const grade = marksObtained ? getGradeLetter(percentage) : "-";
              const isPassed = exam.passing_marks 
                ? marksObtained >= exam.passing_marks 
                : percentage >= 40;

              return (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{student.rollno || "-"}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={marksObtained}
                      onChange={(e) => handleMarksChange(student.id, e.target.value)}
                      min="0"
                      max={exam.total_marks}
                      className="w-24 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-gray-500 ml-2">/ {exam.total_marks}</span>
                  </td>
                  <td className="px-4 py-3">
                    {marksObtained ? formatPercentage(percentage, 2) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${marksObtained ? "text-blue-600" : "text-gray-400"}`}>
                      {grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {marksObtained ? (
                      <span className={`px-2 py-1 rounded text-sm ${isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {isPassed ? "Passed" : "Failed"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveResults}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg transition"
        >
          Save Results
        </button>
      </div>
    </div>
  );
}