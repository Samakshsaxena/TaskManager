// src/app/api/update-task-status/route.ts
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, index, action, remark } = await req.json(); // ✅ Include remark

    const user = await Employee.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const task = user.tasks[index];
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (action === 'accept') {
      task.newTask = false;
      task.active = true;
      // ❌ DO NOT set remark here
      user.taskSummary.newTask -= 1;
      user.taskSummary.active += 1;
    } 
    else if (action === 'complete') {
      task.active = false;
      task.completed = true;
      task.remark = remark || ''; // ✅ Save the remark only now
      user.taskSummary.active -= 1;
      user.taskSummary.completed += 1;
    } 
    else if (action === 'fail') {
      task.active = false;
      task.failed = true;
      task.remark = remark || ''; // ✅ Save remark for failed too
      user.taskSummary.active -= 1;
      user.taskSummary.failed += 1;
    }

    await user.save();
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Error updating task:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
