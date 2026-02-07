"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { filterBySearch } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function TeacherListPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(teachers, searchTerm, ["name", "email", "phone", "subject"]);
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching teachers: " + error.message);
    } else {
      setTeachers(data || []);
      setFilteredTeachers(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (teacher) => {
    router.push(`/dashboards/admin/teachers/${teacher.id}/edit`);
  };

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) return;

    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", teacher.id);

    if (error) {
      toast.error("Error deleting teacher: " + error.message);
    } else {
      toast.success("Teacher deleted successfully!");
      fetchTeachers();
    }
  };

  const columns = [
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "Phone", field: "phone" },
    { header: "Subject", field: "subject" },
    { header: "Gender", field: "gender" },
  ];

  if (loading) return <LoadingSpinner message="Loading teachers..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Teachers">
        <button
          onClick={() => router.push("/dashboards/admin/teachers/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Teacher
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search teachers by name, email, phone, or subject..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredTeachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}