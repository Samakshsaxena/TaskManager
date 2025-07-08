import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';
import { sendTaskAssignedEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { title, description, date, category, employeeEmails } = await req.json();
    console.log('📥 Incoming Task:', { title, description, date, category, employeeEmails });

    // Validation
    if (!title || !description || !date || !category || !Array.isArray(employeeEmails) || employeeEmails.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const newTask = {
      title,
      description,
      date: new Date(date).toISOString(),
      category,
      newTask: true,
      active: false,
      completed: false,
      failed: false,
    };

    let successCount = 0;
    let failedEmails: string[] = [];

    // Run task assignment and emails in parallel
    await Promise.all(
      employeeEmails.map(async (email) => {
        try {
          const employee = await Employee.findOne({ email });

          if (!employee) {
            console.warn(`❌ Employee not found: ${email}`);
            failedEmails.push(email);
            return;
          }

          employee.tasks.push(newTask);
          employee.taskSummary.newTask = (employee.taskSummary?.newTask || 0) + 1;
          await employee.save();

          await sendTaskAssignedEmail(employee.email, title, 'Admin');

          successCount++;
        } catch (err) {
          console.error(`❌ Failed to assign task to ${email}:`, err);
          failedEmails.push(email);
        }
      })
    );

    return NextResponse.json({
      message: `✅ Task assigned to ${successCount} employee(s)`,
      failed: failedEmails.length ? failedEmails : null,
    });

  } catch (error) {
    console.error('❌ Assign Task Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
