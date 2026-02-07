"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }) {
  const router = useRouter();
  
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-full shadow-sm transition ${className}`}
    >
      ← Back
    </button>
  );
}