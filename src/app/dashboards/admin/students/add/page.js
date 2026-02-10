// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import supabase from "@/lib/supabaseClient";
// import PageHeader from "@/components/shared/PageHeader";
// import FormCard from "@/components/shared/FormCard";
// import { GENDER_OPTIONS } from "@/utils/constants";
// import { isValidEmail } from "@/utils/validation";
// import toast from "react-hot-toast";

// export default function AddStudentPage() {
//   const router = useRouter();
//   const [classes, setClasses] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     rollNo: "",
//     classId: "",
//     gender: "",
//     email: "",
//     address: "",
//     dateOfBirth: "",
//   });

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const fetchClasses = async () => {
//     const { data, error } = await supabase
//       .from("classes")
//       .select("id, name")
//       .order("name", { ascending: true });
    
//     if (error) {
//       toast.error("Error fetching classes");
//     } else {
//       setClasses(data || []);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.name.trim()) {
//       toast.error("Student name is required");
//       return;
//     }

//     if (!formData.gender) {
//       toast.error("Please select gender");
//       return;
//     }

//     if (!formData.classId) {
//       toast.error("Please select a class");
//       return;
//     }

//     if (formData.email && !isValidEmail(formData.email)) {
//       toast.error("Invalid email address");
//       return;
//     }

//     // Insert student
//     const { error } = await supabase.from("students").insert([
//       {
//         name: formData.name.trim(),
//         rollno: formData.rollNo.trim() || null,
//         class_id: formData.classId,
//         gender: formData.gender,
//         email: formData.email.trim() || null,
//         address: formData.address.trim() || null,
//         date_of_birth: formData.dateOfBirth || null,
//       },
//     ]);

//     if (error) {
//       toast.error("Error adding student: " + error.message);
//       return;
//     }

//     toast.success("Student added successfully!");
//     router.push("/dashboards/admin/students");
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <PageHeader title="Add Student" />

//       <FormCard onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-4">
//           {/* Name */}
//           <div>
//             <label className="block mb-1 font-semibold">Name *</label>
//             <input
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Roll No */}
//           <div>
//             <label className="block mb-1 font-semibold">Roll No</label>
//             <input
//               name="rollNo"
//               value={formData.rollNo}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block mb-1 font-semibold">Gender *</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Gender</option>
//               {GENDER_OPTIONS.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Class */}
//           <div>
//             <label className="block mb-1 font-semibold">Class *</label>
//             <select
//               name="classId"
//               value={formData.classId}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Class</option>
//               {classes.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-semibold">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Date of Birth */}
//           <div>
//             <label className="block mb-1 font-semibold">Date of Birth</label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Address */}
//           <div className="md:col-span-2">
//             <label className="block mb-1 font-semibold">Address</label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               rows="3"
//               className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end mt-6">
//           <button
//             type="submit"
//             className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
//           >
//             Add Student
//           </button>
//         </div>
//       </FormCard>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import { GENDER_OPTIONS } from "@/utils/constants";
import { isValidPhone } from "@/utils/validation";
import toast from "react-hot-toast";

export default function AddStudentPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    classId: "",
    gender: "",
    mobileNo: "",
    // email: "",
    address: "",
    dateOfBirth: "",
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
      toast.error("Student name is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    if (!formData.gender) {
      toast.error("Please select gender");
      return;
    }

    // Mobile number validation
    if (!formData.mobileNo.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!isValidPhone(formData.mobileNo)) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    // Insert student
   

    if (error) {
      toast.error("Error adding student: " + error.message);
      return;
    }

    toast.success("Student added successfully!");
    router.push("/dashboards/admin/students");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Add Student" />

      <FormCard onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block mb-1 font-semibold">Roll Number</label>
            <input
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="e.g., 001, 2024-001"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block mb-1 font-semibold">
              Class <span className="text-red-500">*</span>
            </label>
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

          {/* Gender */}
          <div>
            <label className="block mb-1 font-semibold">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1 font-semibold">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              placeholder="e.g., 03001234567"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 03XXXXXXXXX (11 digits)</p>
          </div>

          {/* Email (Optional) */}
          {/* <div>
            <label className="block mb-1 font-semibold">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Date of Birth */}
          <div>
            <label className="block mb-1 font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter full address"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Add Student
          </button>
        </div>
      </FormCard>
    </div>
  );
}