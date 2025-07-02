import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all employees, including their name and tasks
    const employees = await Employee.find({}, 'name email tasks');

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('❌ Failed to fetch all tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
