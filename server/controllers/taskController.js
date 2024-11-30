const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { taskId, title, startTime, endTime, priority, status, totalTimeToFinish } = req.body;
  const task = new Task({
    taskId,
    title,
    startTime,
    endTime,
    priority,
    status,
    totalTimeToFinish,
    user: req.user.id
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { taskId, title, startTime, endTime, priority, status, totalTimeToFinish } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    task.taskId = taskId || task.taskId;
    task.title = title || task.title;
    task.startTime = startTime || task.startTime;
    task.endTime = endTime || task.endTime;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.totalTimeToFinish = totalTimeToFinish || task.totalTimeToFinish;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};