"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.id;

  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    classId: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    if (sectionId && sectionId !== "undefined") {
      fetchSection();
    } else {
      setLoading(false);
    }
  }, [sectionId]);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name")
      .order("name", { ascending: true });
    setClasses(data || []);
  };

  const fetchSection = async () => {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("id", sectionId)
      .single();

    if (error) {
      toast.error("Error fetching section: " + error.message);
      router.push("/dashboards/admin/sections");
      return;
    }

    setFormData({
      name: data.name || "",
      classId: data.class_id || "",
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
      toast.error("Section name is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    // Update section
    const { error } = await supabase
      .from("sections")
      .update({
        name: formData.name.trim(),
        class_id: formData.classId,
      })
      .eq("id", sectionId);

    if (error) {
      toast.error("Error updating section: " + error.message);
      return;
    }

    toast.success("Section updated successfully!");
    router.push("/dashboards/admin/sections");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", sectionId);

    if (error) {
      toast.error("Error deleting section: " + error.message);
      return;
    }

    toast.success("Section deleted successfully!");
    router.push("/dashboards/admin/sections");
  };

  if (loading) return <LoadingSpinner message="Loading section data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Edit Section" />

      <FormCard onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Section Name */}
        <div>
          <label className="block mb-1 font-semibold">Section Name *</label>
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

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete Section
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Update Section
          </button>
        </div>
      </FormCard>
    </div>
  );
}