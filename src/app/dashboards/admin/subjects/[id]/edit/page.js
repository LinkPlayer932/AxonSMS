"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditSubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id;

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    sectionId: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    if (subjectId && subjectId !== "undefined") {
      fetchSubject();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });
    setClasses(data || []);
  };

  const fetchSections = async (classId) => {
    if (!classId) {
      setSections([]);
      return;
    }

    const { data } = await supabase
      .from("sections")
      .select("id, name")
      .eq("class_id", classId)
      .order("name", { ascending: true });
    setSections(data || []);
  };

  const fetchSubject = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", subjectId)
      .single();

    if (error) {
      toast.error("Error fetching subject: " + error.message);
      router.push("/dashboards/admin/subjects");
      return;
    }

    setFormData({
      name: data.name || "",
      classId: data.class_id || "",
      sectionId: data.section_id || "",
    });

    if (data.class_id) {
      await fetchSections(data.class_id);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "classId") {
      setFormData({ ...formData, classId: value, sectionId: "" });
      fetchSections(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    if (!formData.sectionId) {
      toast.error("Please select a section");
      return;
    }

    // Update subject
    const { error } = await supabase
      .from("subjects")
      .update({
        name: formData.name.trim(),
        class_id: formData.classId,
        section_id: formData.sectionId,
      })
      .eq("id", subjectId);

    if (error) {
      toast.error("Error updating subject: " + error.message);
      return;
    }

    toast.success("Subject updated successfully!");
    router.push("/dashboards/admin/subjects");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subjectId);

    if (error) {
      toast.error("Error deleting subject: " + error.message);
      return;
    }

    toast.success("Subject deleted successfully!");
    router.push("/dashboards/admin/subjects");
  };

  if (loading) return <LoadingSpinner message="Loading subject data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Edit Subject" />

      <FormCard onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Subject Name */}
        <div>
          <label className="block mb-1 font-semibold">Subject Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

        {/* Section */}
        <div>
          <label className="block mb-1 font-semibold">Section *</label>
          <select
            name="sectionId"
            value={formData.sectionId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete Subject
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Update Subject
          </button>
        </div>
      </FormCard>
    </div>
  );
}