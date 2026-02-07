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

export default function ClassListPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(classes, searchTerm, ["name"]);
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching classes: " + error.message);
    } else {
      setClasses(data || []);
      setFilteredClasses(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (classItem) => {
    router.push(`/dashboards/admin/classes/${classItem.id}/edit`);
  };

  const handleDelete = async (classItem) => {
    if (!window.confirm(`Are you sure you want to delete class ${classItem.name}?`)) return;

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", classItem.id);

    if (error) {
      toast.error("Error deleting class: " + error.message);
    } else {
      toast.success("Class deleted successfully!");
      fetchClasses();
    }
  };

  const columns = [
    { header: "Class Name", field: "name" },
  ];

  if (loading) return <LoadingSpinner message="Loading classes..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Classes">
        <button
          onClick={() => router.push("/dashboards/admin/classes/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Class
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search classes..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}