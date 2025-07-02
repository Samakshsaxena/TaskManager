import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

type Context = {
  params: {
    email: string;
  };
};

export async function GET(req: Request, context: Context) {
  try {
    await dbConnect();

    const email = context.params?.email;

    if (!email) {
      return NextResponse.json({ error: 'Email param missing' }, { status: 400 });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({
      tasks: employee.tasks,
      summary: employee.taskSummary,
    });
  } catch (error) {
    console.error('❌ Fetch Tasks Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
