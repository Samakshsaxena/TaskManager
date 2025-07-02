
'use client'
import Image from "next/image";
import Login from "@/components/(auth)/Login";
import Employee_Dashboard from "@/components/(dasboard)/Employee_Dashboard";
import Admin_Dashboard from "@/components/(dasboard)/Admin_Dashboard";
import { useEffect } from "react";
import { useState } from "react";


export default function Home() {
  
  return (
    <main>
      <Login /> 
    </main>
  );
}
