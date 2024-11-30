// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  totalTimeToFinish: { type: Number, required: true }, // Total time to finish (hrs)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', taskSchema);