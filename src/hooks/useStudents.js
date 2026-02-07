"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("*, classes(name)")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching students: " + error.message);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  const addStudent = async (studentData) => {
    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select();

    if (error) {
      toast.error("Error adding student: " + error.message);
      return { success: false, error };
    }

    toast.success("Student added successfully!");
    fetchStudents();
    return { success: true, data };
  };

  const updateStudent = async (id, studentData) => {
    const { data, error } = await supabase
      .from("students")
      .update(studentData)
      .eq("id", id)
      .select();

    if (error) {
      toast.error("Error updating student: " + error.message);
      return { success: false, error };
    }

    toast.success("Student updated successfully!");
    fetchStudents();
    return { success: true, data };
  };

  const deleteStudent = async (id) => {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting student: " + error.message);
      return { success: false, error };
    }

    toast.success("Student deleted successfully!");
    fetchStudents();
    return { success: true };
  };

  return {
    students,
    loading,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}