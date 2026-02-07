"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error fetching classes: " + error.message);
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  const addClass = async (classData) => {
    const { data, error } = await supabase
      .from("classes")
      .insert([classData])
      .select();

    if (error) {
      toast.error("Error adding class: " + error.message);
      return { success: false, error };
    }

    toast.success("Class added successfully!");
    fetchClasses();
    return { success: true, data };
  };

  const updateClass = async (id, classData) => {
    const { data, error } = await supabase
      .from("classes")
      .update(classData)
      .eq("id", id)
      .select();

    if (error) {
      toast.error("Error updating class: " + error.message);
      return { success: false, error };
    }

    toast.success("Class updated successfully!");
    fetchClasses();
    return { success: true, data };
  };

  const deleteClass = async (id) => {
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting class: " + error.message);
      return { success: false, error };
    }

    toast.success("Class deleted successfully!");
    fetchClasses();
    return { success: true };
  };

  return {
    classes,
    loading,
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
  };
}