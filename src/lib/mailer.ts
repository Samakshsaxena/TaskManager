import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS,   // your app password (not your Gmail password!)
  },
});

export const sendTaskAssignedEmail = async (to: string, taskTitle: string, assignedBy: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: '📨 New Task Assigned',
    html: `
      <h2>New Task Assigned</h2>
      <p><strong>${assignedBy}</strong> has assigned you a task: <strong>${taskTitle}</strong>.</p>
      <p>Please log in to your dashboard to view it.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to', to);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};
