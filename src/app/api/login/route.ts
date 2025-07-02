import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Find full Mongoose user doc (✅ NO .lean())
    const user = await Employee.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("👤 Logging in user:", user.name, user.role);

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // 3. Update isOnline directly in the user doc
    user.isOnline = true;
    await user.save(); // ✅ THIS is safer than updateOne here

    // 4. Strip password before returning
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


