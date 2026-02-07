"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId && classId !== "undefined") {
      fetchClass();
    } else {
      setLoading(false);
    }
  }, [classId]);

  const fetchClass = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();

    if (error) {
      toast.error("Error fetching class: " + error.message);
      router.push("/dashboards/admin/classes");
      return;
    }

    setName(data.name || "");
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }

    // Update class
    const { error } = await supabase
      .from("classes")
      .update({ name: name.trim() })
      .eq("id", classId);

    if (error) {
      toast.error("Error updating class: " + error.message);
      return;
    }

    toast.success("Class updated successfully!");
    router.push("/dashboards/admin/classes");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this class? This will also delete all associated sections, subjects, and student records.")) return;

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", classId);

    if (error) {
      toast.error("Error deleting class: " + error.message);
      return;
    }

    toast.success("Class deleted successfully!");
    router.push("/dashboards/admin/classes");
  };

  if (loading) return <LoadingSpinner message="Loading class data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Edit Class" />

      <FormCard onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Class Name */}
        <div>
          <label className="block mb-2 font-semibold">Class Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete Class
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Update Class
          </button>
        </div>
      </FormCard>
    </div>
  );
}