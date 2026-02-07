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

export default function SubjectListPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(subjects, searchTerm, ["name"]);
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [searchTerm, subjects]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*, classes(name), sections(name)")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching subjects: " + error.message);
    } else {
      setSubjects(data || []);
      setFilteredSubjects(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (subject) => {
    router.push(`/dashboards/admin/subjects/${subject.id}/edit`);
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`Are you sure you want to delete ${subject.name}?`)) return;

    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subject.id);

    if (error) {
      toast.error("Error deleting subject: " + error.message);
    } else {
      toast.success("Subject deleted successfully!");
      fetchSubjects();
    }
  };

  const columns = [
    { header: "Subject Name", field: "name" },
    { 
      header: "Class", 
      render: (row) => row.classes?.name || "N/A" 
    },
    { 
      header: "Section", 
      render: (row) => row.sections?.name || "N/A" 
    },
  ];

  if (loading) return <LoadingSpinner message="Loading subjects..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Subjects">
        <button
          onClick={() => router.push("/dashboards/admin/subjects/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Subject
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search subjects..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredSubjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}