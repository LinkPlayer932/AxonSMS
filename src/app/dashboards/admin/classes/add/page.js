"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import PageHeader from "@/components/shared/PageHeader";
import FormCard from "@/components/shared/FormCard";
import toast from "react-hot-toast";

export default function AddClassPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sections, setSections] = useState([{ name: "" }]);

  const handleSectionChange = (index, value) => {
    const updated = [...sections];
    updated[index].name = value;
    setSections(updated);
  };

  const addSection = () => setSections([...sections, { name: "" }]);
  
  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }

    // Insert class first
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (classError) {
      toast.error("Error adding class: " + classError.message);
      return;
    }

    // Insert sections
    for (const sec of sections) {
      if (sec.name.trim() === "") continue; // skip empty sections
      
      const { error: sectionError } = await supabase.from("sections").insert([
        {
          name: sec.name.trim(),
          class_id: classData.id,
        },
      ]);

      if (sectionError) {
        toast.error("Error adding section: " + sectionError.message);
        return;
      }
    }

    toast.success("Class and sections added successfully!");
    router.push("/dashboards/admin/classes");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader title="Add Class" />

      <FormCard onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Class Name */}
        <div>
          <label className="block mb-2 font-semibold">Class Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Grade 1, Class 10"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sections */}
        <div>
          <label className="block mb-2 font-semibold">Sections</label>
          {sections.map((sec, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={sec.name}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                placeholder={`Section ${index + 1} (e.g., A, B, C)`}
                className="flex-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2 transition"
          >
            + Add Section
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            Add Class
          </button>
        </div>
      </FormCard>
    </div>
  );
}