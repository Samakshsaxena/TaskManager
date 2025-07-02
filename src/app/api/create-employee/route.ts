import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Employee already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      role: 'employee',
      taskSummary: {
        newTask: 0,
        active: 0,
        completed: 0,
        failed: 0,
      },
      tasks: [],
    });

    await newEmployee.save();

    return NextResponse.json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Create Employee Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
