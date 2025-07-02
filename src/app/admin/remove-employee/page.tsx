// File: src/app/admin/remove-employee/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/(dasboard_component)/Header'; 

export default function RemoveEmployeePage() {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch('/api/all-employees');
      const data = await res.json();
      setEmployees(data.employees || []);
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (email: string) => {
    const confirm = window.confirm(`Are you sure you want to delete ${email}?`);
    if (!confirm) return;

    const res = await fetch('/api/delete-employee', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Employee deleted!');
      setEmployees((prev) => prev.filter((e) => e.email !== email));
    } else {
      alert(`❌ ${data.error}`);
    }
  };

  return (
    <>
    <Header />
    
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">❌ Remove Employee</h1>
      <div className="grid gap-4">
        {employees.map((emp) => (
          <div
            key={emp.email}
            className="flex justify-between items-center bg-[#1C1C1C] px-4 py-2 rounded shadow"
          >
            <span>{emp.name}</span>
            <button
              onClick={() => handleDelete(emp.email)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
