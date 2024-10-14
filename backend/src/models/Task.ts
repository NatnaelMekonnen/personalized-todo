import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  category: string;
  status: 'completed' | 'not completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['completed', 'not completed'], default: 'not completed' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
