import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log("🔴 Logout called for:", email);

    const user = await Employee.findOne({ email });

    if (user) {
      console.log("👀 Found user:", user.name, "| isOnline before:", user.isOnline);

      user.isOnline = false;
      await user.save();

      console.log("✅ isOnline updated to false in DB");
    } else {
      console.log("❌ User not found for logout");
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
