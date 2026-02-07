"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function ExamResultsListPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("*, classes(name), subjects(name)")
      .order("exam_date", { ascending: false });

    if (error) {
      toast.error("Error fetching exams: " + error.message);
    } else {
      setExams(data || []);
    }
    setLoading(false);
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
    {
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => handleViewResults(row)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm transition"
        >
          View/Add Results
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner message="Loading exams..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Exam Results" showBackButton={true} />

      <DataTable
        columns={columns}
        data={exams}
      />
    </div>
  );
}