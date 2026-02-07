// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import supabase from "@/lib/supabaseClient";
// import PageHeader from "@/components/shared/PageHeader";
// import DataTable from "@/components/shared/DataTable";
// import toast from "react-hot-toast";

// export default function StudentListPage() {
//   const router = useRouter();
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     const { data, error } = await supabase
//       .from("students")
//       .select("*, classes(name)");
    
//     if (error) {
//       toast.error("Error fetching students");
//     } else {
//       setStudents(data || []);
//     }
//     setLoading(false);
//   };

//   const handleEdit = (student) => {
//     router.push(`/dashboards/admin/students/${student.id}/edit`);
//   };

//   const handleDelete = async (student) => {
//     if (!window.confirm("Are you sure?")) return;
    
//     const { error } = await supabase
//       .from("students")
//       .delete()
//       .eq("id", student.id);
    
//     if (error) {
//       toast.error("Error deleting student");
//     } else {
//       toast.success("Student deleted successfully");
//       fetchStudents();
//     }
//   };

//   const columns = [
//     { header: "Name", field: "name" },
//     { header: "Roll No", field: "rollno" },
//     { header: "Gender", field: "gender" },
//     { 
//       header: "Class", 
//       render: (row) => row.classes?.name || "N/A" 
//     },
//     { header: "Email", field: "email" },
//   ];

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <PageHeader title="Students">
//         <button
//           onClick={() => router.push("/dashboards/admin/students/add")}
//           className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
//         >
//           + Add Student
//         </button>
//       </PageHeader>

//       <DataTable
//         columns={columns}
//         data={students}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// }
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

export default function StudentListPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterBySearch(students, searchTerm, ["name", "email", "rollno"]);
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name)")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching students: " + error.message);
    } else {
      setStudents(data || []);
      setFilteredStudents(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    router.push(`/dashboards/admin/students/${student.id}/edit`);
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) return;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", student.id);

    if (error) {
      toast.error("Error deleting student: " + error.message);
    } else {
      toast.success("Student deleted successfully!");
      fetchStudents();
    }
  };

  const columns = [
    { header: "Name", field: "name" },
    { header: "Roll No", field: "rollno" },
    { header: "Gender", field: "gender" },
    { 
      header: "Class", 
      render: (row) => row.classes?.name || "N/A" 
    },
    { header: "Email", field: "email" },
  ];

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Students">
        <button
          onClick={() => router.push("/dashboards/admin/students/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
        >
          + Add Student
        </button>
      </PageHeader>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search students by name, roll no, or email..."
        className="mb-4"
      />

      <DataTable
        columns={columns}
        data={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}