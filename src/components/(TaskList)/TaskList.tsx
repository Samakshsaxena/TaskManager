'use client';
import React, { useEffect, useState } from 'react';

interface Task {
  title: string;
  description: string;
  date: string;
  category: string;
  active: boolean;
  newTask: boolean;
  completed: boolean;
  failed: boolean;
  remark?: string;
}

interface TaskSummary {
  newTask: number;
  active: number;
  completed: number;
  failed: number;
}

interface User {
  email: string;
  role: 'admin' | 'employee';
  tasks: Task[];
  taskSummary: TaskSummary;
}

const TaskList = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchUserFromAPI = async () => {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!localUser?.email) return;

      try {
        const res = await fetch(`/api/get-tasks/${localUser.email}`);
        const data = await res.json();

        if (res.ok) {
          const userFromAPI: User = {
            email: localUser.email,
            role: localUser.role,
            tasks: data.tasks,
            taskSummary: data.summary,
          };
          setUser(userFromAPI);
          setTasks(data.tasks);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchUserFromAPI();
  }, []);

  const handleAction = async (
    index: number,
    actionType: 'accept' | 'complete' | 'fail'
  ) => {
    if (!user) return;

    const remark = remarks[index]?.trim() || '';

    if ((actionType === 'complete' || actionType === 'fail') && !remark) {
      alert('Please enter a remark before completing or failing the task.');
      return;
    }

    try {
      const res = await fetch('/api/update-task-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          index,
          action: actionType,
          remark: actionType === 'complete' || actionType === 'fail' ? remark : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setTasks(data.user.tasks);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        console.error(data.error);
        alert('❌ Failed to update task: ' + data.error);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('❌ Network error while updating task');
    }
  };

  const getCardColor = (task: Task) => {
    if (task.newTask) return 'bg-yellow-400';
    if (task.active) return 'bg-blue-400';
    if (task.completed) return 'bg-green-400';
    if (task.failed) return 'bg-red-400';
    return 'bg-gray-300';
  };

  return (
    <div className="flex justify-start mt-15 flex-row px-9 gap-9 flex-wrap overflow-x-auto text-black">
      {tasks.map((task, index) => (
        <div
          key={index}
          className={`h-80 w-80 ${getCardColor(task)} rounded-3xl flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-between px-4 py-5">
              <span className="bg-red-700 rounded px-5 py-1 text-white text-sm capitalize">
                {task.category}
              </span>
              <span className="font-bold text-sm ">
              Due Date : {new Date(task.date).toLocaleDateString()}
              </span>
            </div>
            <div className="px-4">
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <p className="text-sm font-semibold">{task.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-3 mt-auto">
            {!task.active && !task.completed && !task.failed && (
              <button
                className="bg-gray-900 text-white rounded py-1 text-sm cursor-pointer"
                onClick={async () => {
                  await handleAction(index, 'accept');
                }}
              >
                Accept Task
              </button>
            )}

            {task.active && !task.completed && !task.failed && (
              <>
                <textarea
                  className="text-sm p-1 rounded"
                  placeholder="Write your remark here..."
                  value={remarks[index] || ''}
                  onChange={(e) =>
                    setRemarks({ ...remarks, [index]: e.target.value })
                  }
                />

                {/* ✅ Mark as Complete with tooltip */}
                <div className="relative group">
                  <button
                    className={`w-full text-white rounded py-1 text-sm ${
                      !remarks[index]?.trim()
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-800'
                    }`}
                    onClick={() => handleAction(index, 'complete')}
                    disabled={!remarks[index]?.trim()}
                  >
                    Mark as Complete
                  </button>
                  {!remarks[index]?.trim() && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
                      Please fill remark
                    </div>
                  )}
                </div>

                {/* ✅ Mark as Failed with tooltip */}
                <div className="relative group">
                  <button
                    className={`w-full text-white rounded py-1 text-sm ${
                      !remarks[index]?.trim()
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-red-700 hover:bg-red-800'
                    }`}
                    onClick={() => handleAction(index, 'fail')}
                    disabled={!remarks[index]?.trim()}
                  >
                    Mark as Failed
                  </button>
                  {!remarks[index]?.trim() && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
                      Please fill remark
                    </div>
                  )}
                </div>
              </>
            )}

            {task.completed && (
              <span className="text-green-800 font-semibold">✅ Completed</span>
            )}
            {task.failed && (
              <span className="text-red-800 font-semibold">❌ Failed</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
