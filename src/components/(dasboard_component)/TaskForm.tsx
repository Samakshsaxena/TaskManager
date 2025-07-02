'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [assignedToList, setAssignedToList] = useState<{ label: string; value: string }[]>([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: string }[]>([]);

  const categories = [
    'design', 'development', 'testing', 'frontend', 'backend',
    'devops', 'research', 'a11y', 'code-review', 'integration',
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees');
        const data = await res.json();
        if (res.ok) {
          const formatted = data.employees.map((emp: any) => ({
            label: emp.email,
            value: emp.email,
          }));
          setEmployeeOptions(formatted);
        } else {
          console.error('❌ Failed to load employees:', data.error);
        }
      } catch (err) {
        console.error('❌ Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const task = {
      title,
      description,
      date,
      category,
      employeeEmails: assignedToList.map((emp) => emp.value),
    };

    try {
      const res = await fetch('/api/assign-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Task assigned successfully!');
      } else {
        alert('❌ Failed: ' + data.error);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      alert('❌ Network error while assigning task.');
    }

    setTitle('');
    setDate('');
    setAssignedToList([]);
    setCategory('');
    setDescription('');
  };

  return (
    <div className="bg-[#1C1C1C] py-10 px-6 rounded-lg shadow-inner">
      <h1 className="text-center text-4xl font-bold text-white mb-8"> Assign New Task</h1>

      <form
        onSubmit={handleCreateTask}
        className="flex flex-col lg:flex-row gap-10 bg-[#1C1C1C]/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
      >
        {/* Left Side */}
        <div className="flex flex-col w-full lg:w-1/2 gap-5">
          <div>
            <label className="text-white font-medium mb-1 block">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Eg. Design landing page"
              className="bg-[#2B2B2B] text-white px-4 py-2 rounded-lg border border-gray-600 w-full"
              required
            />
          </div>

          <div>
            <label className="text-white font-medium mb-1 block"> Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#2B2B2B] text-white px-4 py-2 rounded-lg border border-gray-600 w-full"
              required
            />
          </div>

          <div>
            <label className="text-white font-medium mb-1 block">Assign To</label>
            <Select
              isMulti
              options={employeeOptions}
              value={assignedToList}
              onChange={(selected) => setAssignedToList(selected as any)}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#2B2B2B',
                  color: 'white',
                  borderColor: '#444',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#2B2B2B',
                  color: 'white',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#3b3b3b' : '#2B2B2B',
                  color: 'white',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#444', // ✅ slightly lighter gray
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  ':hover': {
                    backgroundColor: '#555',
                    color: 'red',
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'white',
                }),
              }}
            />

          </div>

          <div>
            <label className="text-white font-medium mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#2B2B2B] text-white px-4 py-2 rounded-lg border border-gray-600 w-full"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-full lg:w-1/2">
          <label className="text-white font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task here..."
            className="bg-[#2B2B2B] text-white px-4 py-3 rounded-lg border border-gray-600 h-60 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            className="mt-6 py-3 px-6 bg-[#00FFB2] text-black font-semibold rounded-lg shadow hover:bg-[#00e2a0] transition-all duration-300 text-lg cursor-pointer"
          >
            ➕ Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;





