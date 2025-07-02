import mongoose, { Schema, Document, models, model } from 'mongoose';

interface Task {
  title: string;
  description: string;
  date: string;
  category: string;
  newTask: boolean;
  active: boolean;
  completed: boolean;
  failed: boolean;
  remark?: string;
}

export interface EmployeeDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  isOnline: boolean; // ✅ NEW FIELD
  taskSummary: {
    newTask: number;
    active: number;
    completed: number;
    failed: number;
  };
  tasks: Task[];
}

const TaskSchema = new Schema<Task>({
  title: String,
  description: String,
  date: String,
  category: String,
  newTask: Boolean,
  active: Boolean,
  completed: Boolean,
  failed: Boolean,
  remark: String,
});

const EmployeeSchema = new Schema<EmployeeDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], required: true },
  isOnline: { type: Boolean, default: false }, // ✅ ADDED FIELD
  taskSummary: {
    newTask: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  tasks: [TaskSchema],
});

export default models.Employee || model<EmployeeDocument>('Employee', EmployeeSchema);
