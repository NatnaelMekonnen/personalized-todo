import  { Router, Request, Response } from 'express';
import Task, { ITask } from '../../models/Task';

const taskRouter = Router();

// GET all tasks
taskRouter.get('/', async (req: Request, res: Response) => {
  console.log("HERE")
  try {
    const tasks: ITask[] = await Task.find();
    // Calculate priority based on due date
    const tasksWithPriority = tasks.map(task => {
      const daysUntilDue = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      let priority: 'High' | 'Medium' | 'Low';
      if (daysUntilDue <= 1) {
        priority = 'High';
      } else if (daysUntilDue <= 3) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }
      return { ...task.toObject(), priority };
    });
    res.json(tasksWithPriority);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// POST a new task
taskRouter.post('/', async (req: Request, res: Response) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    category: req.body.category
  });

  try {
    const newTask: ITask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// PUT (update) a task
taskRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const task: ITask | null = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// DELETE a task
taskRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default taskRouter;
