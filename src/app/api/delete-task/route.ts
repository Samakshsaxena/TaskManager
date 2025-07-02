import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  await dbConnect();

  const { employeeName, taskTitle } = await req.json();

  if (!employeeName || !taskTitle) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const employee = await Employee.findOne({ name: employeeName });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const originalTaskCount = employee.tasks.length;

    // Filter out the task to be deleted
    employee.tasks = (employee.tasks as Task[]).filter(task => task.title !== taskTitle);

    const newTaskCount = employee.tasks.length;

    if (newTaskCount === originalTaskCount) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Recalculate task summary
    const summary = {
      newTask: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };

    for (const task of employee.tasks as Task[]) {
      if (task.newTask) summary.newTask++;
      if (task.active) summary.active++;
      if (task.completed) summary.completed++;
      if (task.failed) summary.failed++;
    }

    employee.taskSummary = summary;

    await employee.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Delete task error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
