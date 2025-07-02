import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({ role: 'employee' }, 'name isOnline');
    return NextResponse.json(employees); // ✅ return array directly
  } catch (error) {
    console.error('❌ Failed to fetch employees:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
