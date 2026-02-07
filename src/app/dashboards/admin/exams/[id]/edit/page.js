"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { EXAM_TYPES } from "@/utils/constants";
import { formatDateForInput } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id;

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    examType: "",
    classId: "",
    subjectId: "",
    examDate: "",
    totalMarks: "",
    passingMarks: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    if (examId && examId !== "undefined") {
      fetchExam();
    } else {
      setLoading(false);
    }
  }, [examId]);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });
    setClasses(data || []);
  };

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from("subjects")
      .select("id, name")
      .order("name", { ascending: true });
    setSubjects(data || []);
  };

  const fetchExam = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    if (error) {
      toast.error("Error fetching exam: " + error.message);
      router.push("/dashboards/admin/exams");
      return;
    }

    setFormData({
      name: data.name || "",
      examType: data.exam_type || "",
      classId: data.class_id || "",
      subjectId: data.subject_id || "",
      examDate: data.exam_date ? formatDateForInput(data.exam_date) : "",
      totalMarks: data.total_marks?.toString() || "",
      passingMarks: data.passing_marks?.toString() || "",
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Exam name is required");
      return;
    }

    if (!formData.examType) {
      toast.error("Please select exam type");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    if (!formData.totalMarks || formData.totalMarks <= 0) {
      toast.error("Please enter valid total marks");
      return;
    }

    // Update exam
    const { error } = await supabase
      .from("exams")
      .update({
        name: formData.name.trim(),
        exam_type: formData.examType,
        class_id: formData.classId,
        subject_id: formData.subjectId || null,
        exam_date: formData.examDate || null,
        total_marks: parseInt(formData.totalMarks),
        passing_marks: formData.passingMarks ? parseInt(formData.passingMarks) : null,
      })
      .eq("id", examId);

    if (error) {
      toast.error("Error updating exam: " + error.message);
      return;
    }

    toast.success("Exam updated successfully!");
    router.push("/dashboards/admin/exams");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", examId);

    if (error) {
      toast.error("Error deleting exam: " + error.message);
      return;
    }

    toast.success("Exam deleted successfully!");
    router.push("/dashboards/admin/exams");
  };

  if (loading) return <LoadingSpinner message="Loading exam data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Edit Exam" />

      <FormCard onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Exam Name */}
          <div>
            <label className="block mb-1 font-semibold">Exam Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exam Type */}
          <div>
            <label className="block mb-1 font-semibold">Exam Type *</label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {EXAM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 font-semibold">Class *</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
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

          {/* Subject */}
          <div>
            <label className="block mb-1 font-semibold">Subject</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subject (Optional)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block mb-1 font-semibold">Exam Date</label>
            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Marks */}
          <div>
            <label className="block mb-1 font-semibold">Total Marks *</label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              min="1"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Passing Marks */}
          <div>
            <label className="block mb-1 font-semibold">Passing Marks</label>
            <input
              type="number"
              name="passingMarks"
              value={formData.passingMarks}
              onChange={handleChange}
              min="1"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete Exam
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Update Exam
          </button>
        </div>
      </FormCard>
    </div>
  );
}