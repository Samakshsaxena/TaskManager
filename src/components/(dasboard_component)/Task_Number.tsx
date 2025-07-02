'use client';
import { useEffect, useState } from 'react';

function Task_List() {
  const [taskSummary, setTaskSummary] = useState({
    newTask: 0,
    active: 0,
    completed: 0,
    failed: 0,
  });

  useEffect(() => {
    const fetchTaskSummary = () => {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (user.role === 'employee' && user.taskSummary) {
        setTaskSummary(user.taskSummary);
      }
    };

    fetchTaskSummary(); // initial fetch
    const interval = setInterval(fetchTaskSummary, 1000); // check every 1 sec

    return () => clearInterval(interval); // clean up interval on unmount
  }, []);

  return (
    <div className="flex flex-wrap gap-10 justify-center px-4 mt-10">
      {[
        { label: 'New Tasks', value: taskSummary.newTask, color: 'bg-yellow-400' },
        { label: 'Active Tasks', value: taskSummary.active, color: 'bg-blue-400' },
        { label: 'Completed', value: taskSummary.completed, color: 'bg-green-400' },
        { label: 'Failed', value: taskSummary.failed, color: 'bg-red-400' },
      ].map((item, index) => (
        <div
          key={index}
          className={`h-40 w-full sm:w-[45%] md:w-[22%] ${item.color} rounded-3xl flex flex-col justify-center px-6`}
        >
          <h1 className="text-3xl font-bold text-black">{item.value}</h1>
          <h2 className="text-xl font-semibold text-black">{item.label}</h2>
        </div>
      ))}
    </div>
  );
}

export default Task_List;
