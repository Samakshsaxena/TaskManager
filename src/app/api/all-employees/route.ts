import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({ role: 'employee' }, 'name email');
    return NextResponse.json({ employees });
  } catch (error) {
    console.error('❌ Failed to fetch all employees:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
