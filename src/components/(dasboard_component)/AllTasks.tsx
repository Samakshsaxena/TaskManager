

'use client';
import React, { useEffect, useState } from 'react';

interface Task {
  title: string;
  description: string;
  date: string;
  category: string;
  newTask: boolean;
  active: boolean;
  completed: boolean;
  failed: boolean;
  remark?: string;
}

interface EmployeeTask {
  employeeName: string;
  taskTitle: string;
  status: string;
  category: string;
  remark?: string;
  date: string;
}

function AllTasks() {
  const [allTasks, setAllTasks] = useState<EmployeeTask[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [nameFilter, setNameFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await fetch('/api/all-tasks');
        const data = await res.json();

        if (res.ok) {
          const tasks: EmployeeTask[] = [];
          const categorySet = new Set<string>();

          for (const emp of data.employees) {
            for (const task of emp.tasks) {
              let status = 'New';
              if (task.completed) status = 'Completed';
              else if (task.failed) status = 'Failed';
              else if (task.active) status = 'Active';

              const taskDate = new Date(task.date).toLocaleDateString('en-GB');

              tasks.push({
                employeeName: emp.name,
                taskTitle: task.title,
                status,
                category: task.category,
                remark: task.remark || '',
                date: taskDate,
              });

              categorySet.add(task.category);
            }
          }

          setAllTasks(tasks);
          setUniqueCategories(['All', ...Array.from(categorySet)]);
        } else {
          console.error('❌ Failed to load all tasks:', data.error);
        }
      } catch (err) {
        console.error('❌ Error fetching all tasks:', err);
      }
    };

    fetchAllTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-yellow-400';
      case 'Active': return 'bg-blue-400';
      case 'Completed': return 'bg-green-400';
      case 'Failed': return 'bg-red-400';
      default: return 'bg-purple-400';
    }
  };

  const handleDelete = async (taskTitle: string, employeeName: string) => {
    const confirmDelete = confirm(`Delete task "${taskTitle}" for ${employeeName}?`);
    if (!confirmDelete) return;

    const res = await fetch('/api/delete-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskTitle, employeeName }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Task deleted successfully');
      setAllTasks(prev => prev.filter(task =>
        !(task.taskTitle === taskTitle && task.employeeName === employeeName)
      ));
    } else {
      alert(`❌ Failed to delete: ${data.error}`);
    }
  };

  const filteredTasks = allTasks.filter(task => {
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchName = task.employeeName.toLowerCase().includes(nameFilter.toLowerCase());
    const matchDate = dateFilter === '' || task.date.includes(dateFilter);
    return matchStatus && matchCategory && matchName && matchDate;
  });

  return (
    <div>
      <h1 className='font-bold text-center mt-20 text-2xl'>ALL TASKS</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 mb-4 px-4">
        <select
          className="px-4 py-2 rounded text-sm bg-gray-800 text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          className="px-4 py-2 rounded text-sm bg-gray-800 text-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="px-4 py-2 rounded text-sm bg-gray-800 text-white"
        />

        <input
          type="text"
          placeholder="Date (dd/mm/yyyy)"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded text-sm bg-gray-800 text-white"
        />
      </div>

      {/* Task List */}
      <div className="bg-[#1C1C1C] p-5 mt-2 h-96 overflow-auto">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className={`${getStatusColor(task.status)} py-3 px-6 flex flex-col rounded mb-3 w-[95%] mx-auto`}
          >
            <div className="flex justify-between text-black text-xl font-medium">
              <h2>{task.employeeName}</h2>
              <h3>{task.taskTitle}</h3>
              <h4>{task.status}</h4>
            </div>
            <div className="text-black text-sm pl-1">
              📅 {task.date}
            </div>
            {task.remark && (
              <div className="mt-1 px-2 py-1 bg-white/70 rounded text-black text-sm italic whitespace-pre-wrap break-words">
                <strong>Remark:</strong> {task.remark}
              </div>
            )}
            <button
              onClick={() => handleDelete(task.taskTitle, task.employeeName)}
              className="text-red-600 text-sm mt-2 underline self-end cursor-pointer"
            >
              ❌ Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllTasks;
