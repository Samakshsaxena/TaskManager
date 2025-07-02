import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({ role: 'employee' }, '_id email'); // only employee users
    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Fetch Employees Error:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}
