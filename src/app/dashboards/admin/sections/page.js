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

export default function SectionListPage() {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(sections, searchTerm, ["name"]);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(sections);
    }
  }, [searchTerm, sections]);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from("sections")
      .select("*, classes(name)")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching sections: " + error.message);
    } else {
      setSections(data || []);
      setFilteredSections(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (section) => {
    router.push(`/dashboards/admin/sections/${section.id}/edit`);
  };

  const handleDelete = async (section) => {
    if (!window.confirm(`Are you sure you want to delete section ${section.name}?`)) return;

    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", section.id);

    if (error) {
      toast.error("Error deleting section: " + error.message);
    } else {
      toast.success("Section deleted successfully!");
      fetchSections();
    }
  };

  const columns = [
    { header: "Section Name", field: "name" },
    { 
      header: "Class", 
      render: (row) => row.classes?.name || "N/A" 
    },
  ];

  if (loading) return <LoadingSpinner message="Loading sections..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Sections">
        <button
          onClick={() => router.push("/dashboards/admin/sections/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Section
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search sections..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredSections}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}