"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Employee_Dashboard from "@/components/(dasboard)/Employee_Dashboard";

export default function EmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }

    const user = JSON.parse(userData);
    console.log("User from localStorage:", user); // helpful for debugging

    if (user.role !== "employee") {
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return null;

  return <Employee_Dashboard />;
}
        