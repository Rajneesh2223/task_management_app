
const express = require('express');
const taskController = require('../controllers/taskController');
const protect = require('../utils/authmiddleware');

const router = express.Router();

// Get all tasks (protected)
router.get('/', protect, taskController.getTasks);

// Create a new task (protected)
router.post('/', protect, taskController.createTask);

// Update task (protected)
router.put('/:id', protect, taskController.updateTask);

// Delete task (protected)
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;
