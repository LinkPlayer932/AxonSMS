"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/auth/login");
    } else {
      setUser(data.session.user);
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return { user, loading, logout };
}