"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      // User is logged in, redirect to dashboard
      router.push("/dashboards/admin");
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          {/* Logo/Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            School Management System
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-100">
            Streamline your school operations with our comprehensive management platform
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">👨‍🎓</div>
              <h3 className="text-xl font-bold mb-2">Student Management</h3>
              <p className="text-gray-200">
                Efficiently manage student records, enrollment, and academic information
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Class & Subject Management</h3>
              <p className="text-gray-200">
                Organize classes, sections, subjects, and teacher assignments
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Exam & Results</h3>
              <p className="text-gray-200">
                Track exams, grades, and generate comprehensive result reports
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Attendance Tracking</h3>
              <p className="text-gray-200">
                Monitor student attendance with detailed reports and analytics
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">Teacher Management</h3>
              <p className="text-gray-200">
                Manage teacher profiles, assignments, and schedules efficiently
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-200">
                Get insights with real-time analytics and comprehensive reports
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white py-8 mt-16">
        <p className="text-gray-200">
          © 2024 School Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}