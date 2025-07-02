'use client';
import { useState } from 'react';
import Header from '@/components/(dasboard_component)/Header'; // ✅ Add this import

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating employee...');

    try {
      const res = await fetch('/api/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Employee created successfully!');
        setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Failed to create employee');
    }
  };

  return (
    <>
      <Header /> {/* ✅ Shows your admin sidebar */}
      <div className="bg-[#1C1C1C] text-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto mt-10 mb-15">
        <h2 className="text-2xl font-bold mb-5 text-center">Create New Employee</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 py-2 rounded text-white font-bold cursor-pointer"
          >
            Create Employee
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold">{message}</p>
        )}
      </div>
    </>
  );
};

export default CreateEmployee;
