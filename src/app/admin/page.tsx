"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Admin_Dashboard from "@/components/(dasboard)/Admin_Dashboard";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // block UI until check completes

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      setLoading(false); // allow rendering
    }
  }, [router]);

  if (loading) return null; // nothing shown while checking

  return <Admin_Dashboard />;
}





