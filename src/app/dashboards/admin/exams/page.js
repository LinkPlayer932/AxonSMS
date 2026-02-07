"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { filterBySearch } from "@/utils/helpers";
import { formatDate } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function ExamListPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(exams, searchTerm, ["name", "exam_type"]);
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
  }, [searchTerm, exams]);

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("*, classes(name), subjects(name)")
      .order("exam_date", { ascending: false });

    if (error) {
      toast.error("Error fetching exams: " + error.message);
    } else {
      setExams(data || []);
      setFilteredExams(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (exam) => {
    router.push(`/dashboards/admin/exams/${exam.id}/edit`);
  };

  const handleDelete = async (exam) => {
    if (!window.confirm(`Are you sure you want to delete ${exam.name}?`)) return;

    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", exam.id);

    if (error) {
      toast.error("Error deleting exam: " + error.message);
    } else {
      toast.success("Exam deleted successfully!");
      fetchExams();
    }
  };

  const handleViewResults = (exam) => {
    router.push(`/dashboards/admin/exams/results/${exam.id}`);
  };

  const columns = [
    { header: "Exam Name", field: "name" },
    { header: "Type", field: "exam_type" },
    { 
      header: "Class", 
      render: (row) => row.classes?.name || "N/A" 
    },
    { 
      header: "Subject", 
      render: (row) => row.subjects?.name || "N/A" 
    },
    { 
      header: "Date", 
      render: (row) => formatDate(row.exam_date) 
    },
    { header: "Total Marks", field: "total_marks" },
  ];

  if (loading) return <LoadingSpinner message="Loading exams..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Exams">
        <button
          onClick={() => router.push("/dashboards/admin/exams/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Exam
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search exams by name or type..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredExams}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}