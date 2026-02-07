"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import toast from "react-hot-toast";

export default function AddSectionPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Section name is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    // Insert section
    const { error } = await supabase.from("sections").insert([
      {
        name: formData.name.trim(),
        class_id: formData.classId,
      },
    ]);

    if (error) {
      toast.error("Error adding section: " + error.message);
      return;
    }

    toast.success("Section added successfully!");
    router.push("/dashboards/admin/sections");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Add Section" />

      <FormCard onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Section Name */}
        <div>
          <label className="block mb-1 font-semibold">Section Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., A, B, C"
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

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Add Section
          </button>
        </div>
      </FormCard>
    </div>
  );
}