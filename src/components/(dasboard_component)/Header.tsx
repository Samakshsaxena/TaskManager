'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [greetingName, setGreetingName] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [onlineEmployees, setOnlineEmployees] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setGreetingName('GUEST');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role === 'admin') {
      setGreetingName('ADMIN');
      setIsAdmin(true);
    } else if (user.role === 'employee') {
      setGreetingName(user.name?.toUpperCase() || 'EMPLOYEE');
    }
  }, []);

  useEffect(() => {
    const fetchOnlineEmployees = async () => {
      try {
        const res = await fetch('/api/online-employees');
        const data = await res.json();
        setOnlineEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error fetching employees:', err);
        setOnlineEmployees([]);
      }
    };

    if (isAdmin) {
      fetchOnlineEmployees();
      const interval = setInterval(fetchOnlineEmployees, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });
      } catch (err) {
        console.error('❌ Logout API failed:', err);
      }
    }

    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 bg-black text-white relative z-10">
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={() => setShowSidebar(true)}
              className="text-white text-2xl cursor-pointer hover:text-gray-300"
            >
              <FaBars />
            </button>
          )}
          <div className="px-10">
            <h1 className="text-xl font-semibold">Hello,</h1>
            <h2 className="text-3xl font-bold">{greetingName} 👋</h2>
          </div>
        </div>

        <button
          className="bg-red-500 hover:bg-red-600 text-white rounded px-5 py-2 text-lg cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Sidebar Overlay and Panel */}
      {showSidebar && (
        <>
          {/* Overlay: click to close */}
          <div
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-40"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar */}
          <div
            className="fixed top-0 left-0 h-full w-72 bg-[#1c1c1c]/70 backdrop-blur-lg border-r border-gray-700 z-50 transition-transform duration-300 animate-slide-in shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-white text-xl hover:text-red-400 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col gap-3 px-6 py-6">
              <SidebarButton text="🏠 Dashboard" color="blue-400" onClick={() => {
                setShowSidebar(false);
                router.push('/admin');
              }} />
              <SidebarButton text="🧑‍💼 Create Admin" color="purple-400" onClick={() => {
                setShowSidebar(false);
                router.push('/admin/create-admin');
              }} />
              <SidebarButton text="➕ Create Employee" color="green-400" onClick={() => {
                setShowSidebar(false);
                router.push('/admin/create-employee');
              }} />
              <SidebarButton text="❌ Remove Employee" color="red-400" onClick={() => {
                setShowSidebar(false);
                router.push('/admin/remove-employee');
              }} />

              {/* Online Status Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">👥 Employees Status</h3>
                <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 pr-1">
                  {onlineEmployees.map((emp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white text-sm">
                      <span className={`h-3 w-3 rounded-full ${emp.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span>{emp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;

// Reusable Sidebar Button Component
const SidebarButton = ({
  text,
  color,
  onClick,
}: {
  text: string;
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-left text-white text-lg py-2 px-3 rounded transition-all duration-200 hover:text-${color} hover:bg-white/10`}
  >
    {text}
  </button>
);



