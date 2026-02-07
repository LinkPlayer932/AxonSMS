"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import toast from "react-hot-toast";

export default function AddSubjectPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
    sectionId: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching classes");
    } else {
      setClasses(data || []);
    }
  };

  const fetchSections = async (classId) => {
    if (!classId) {
      setSections([]);
      return;
    }

    const { data, error } = await supabase
      .from("sections")
      .select("id, name")
      .eq("class_id", classId)
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching sections");
    } else {
      setSections(data || []);
    }
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

    // Insert subject
    const { error } = await supabase.from("subjects").insert([
      {
        name: formData.name.trim(),
        class_id: formData.classId,
        section_id: formData.sectionId,
      },
    ]);

    if (error) {
      toast.error("Error adding subject: " + error.message);
      return;
    }

    toast.success("Subject added successfully!");
    router.push("/dashboards/admin/subjects");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Add Subject" />

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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Add Subject
          </button>
        </div>
      </FormCard>
    </div>
  );
}