"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { GENDER_OPTIONS } from "@/utils/constants";
import { isValidEmail, isValidPhone } from "@/utils/validation";
import { formatDateForInput } from "@/utils/formatters";
import toast from "react-hot-toast";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    subject: "",
    qualification: "",
    address: "",
    dateOfBirth: "",
    joiningDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId && teacherId !== "undefined") {
      fetchTeacher();
    } else {
      setLoading(false);
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", teacherId)
      .single();

    if (error) {
      toast.error("Error fetching teacher: " + error.message);
      router.push("/dashboards/admin/teachers");
      return;
    }

    setFormData({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      gender: data.gender || "",
      subject: data.subject || "",
      qualification: data.qualification || "",
      address: data.address || "",
      dateOfBirth: data.date_of_birth ? formatDateForInput(data.date_of_birth) : "",
      joiningDate: data.joining_date ? formatDateForInput(data.joining_date) : "",
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
      toast.error("Teacher name is required");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      toast.error("Invalid phone number");
      return;
    }

    // Update teacher
    const { error } = await supabase
      .from("teachers")
      .update({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        gender: formData.gender || null,
        subject: formData.subject.trim() || null,
        qualification: formData.qualification.trim() || null,
        address: formData.address.trim() || null,
        date_of_birth: formData.dateOfBirth || null,
        joining_date: formData.joiningDate || null,
      })
      .eq("id", teacherId);

    if (error) {
      toast.error("Error updating teacher: " + error.message);
      return;
    }

    toast.success("Teacher updated successfully!");
    router.push("/dashboards/admin/teachers");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", teacherId);

    if (error) {
      toast.error("Error deleting teacher: " + error.message);
      return;
    }

    toast.success("Teacher deleted successfully!");
    router.push("/dashboards/admin/teachers");
  };

  if (loading) return <LoadingSpinner message="Loading teacher data..." />;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Edit Teacher" />

      <FormCard onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-semibold">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
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

          {/* Subject */}
          <div>
            <label className="block mb-1 font-semibold">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block mb-1 font-semibold">Qualification</label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          {/* Joining Date */}
          <div>
            <label className="block mb-1 font-semibold">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
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
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          >
            Delete Teacher
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Update Teacher
          </button>
        </div>
      </FormCard>
    </div>
  );
}