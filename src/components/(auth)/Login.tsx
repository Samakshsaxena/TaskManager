'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') router.push('/admin');
        else if (data.user.role === 'employee') router.push('/employee');
        else alert('⚠️ Unknown role');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('❌ Network error. Please try again.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#1d4193] to-[#0f1d4d] px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border-4 border-[#1d4193] animate-fade-in">
        <form className="flex flex-col items-center w-full" onSubmit={submitHandler}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-[#1d4193] font-bold text-4xl tracking-wide">LOG IN</h1>
            <img
              src="/finalLogo.png"
              alt="Coverwell Logo"
              className="h-14 w-14 object-contain"
            />
          </div>

          <label className="text-[#1d4193] font-medium text-left w-full mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-4 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4193]"
          />

          <label className="text-[#1d4193] font-medium text-left w-full mb-1">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 mb-6 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d4193]"
          />

          <button
            type="submit"
            className="w-full bg-[#1d4193] text-white py-2 rounded-lg font-semibold hover:bg-[#152c63] transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
