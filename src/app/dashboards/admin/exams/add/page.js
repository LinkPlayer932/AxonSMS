"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import { EXAM_TYPES } from "@/utils/constants";
import toast from "react-hot-toast";

export default function AddExamPage() {
  const router = useRouter();
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

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

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

    // Insert exam
    const { error } = await supabase.from("exams").insert([
      {
        name: formData.name.trim(),
        exam_type: formData.examType,
        class_id: formData.classId,
        subject_id: formData.subjectId || null,
        exam_date: formData.examDate || null,
        total_marks: parseInt(formData.totalMarks),
        passing_marks: formData.passingMarks ? parseInt(formData.passingMarks) : null,
      },
    ]);

    if (error) {
      toast.error("Error adding exam: " + error.message);
      return;
    }

    toast.success("Exam added successfully!");
    router.push("/dashboards/admin/exams");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Add Exam" />

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
              placeholder="e.g., Mid Term 2024"
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Add Exam
          </button>
        </div>
      </FormCard>
    </div>
  );
}