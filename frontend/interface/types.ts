export type Task = {
  _id: number;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: "high" | "medium" | "low";
};