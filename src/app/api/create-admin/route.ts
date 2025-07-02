import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Employee({
      name: 'ADMIN',
      email,
      password: hashedPassword,
      role: 'admin',
      taskSummary: { newTask: 0, active: 0, completed: 0, failed: 0 },
      tasks: [],
    });

    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error('Create Admin Error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
