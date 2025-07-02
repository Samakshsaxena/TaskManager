import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { email, index, updatedTask } = await req.json();

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Update the task
    employee.tasks[index] = updatedTask;

    // Update taskSummary
    const summary = {
      newTask: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };

    employee.tasks.forEach((task: any) => {
      if (task.newTask) summary.newTask++;
      if (task.active) summary.active++;
      if (task.completed) summary.completed++;
      if (task.failed) summary.failed++;
    });

    employee.taskSummary = summary;

    await employee.save();
    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
