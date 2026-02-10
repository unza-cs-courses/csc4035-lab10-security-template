/**
 * Lab 10: Task Routes
 * CSC4035 Web Programming and Technologies
 *
 * Task routes - provided implementation.
 *
 * TODO: Apply security middleware to these routes
 */

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

// TODO: Import validation middleware from ../middleware/security
// const { validateTaskInput, validateIdParam } = require('../middleware/security');


// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Get single task
// TODO: Add validateIdParam middleware
router.get('/:id', taskController.getTask);

// POST /api/tasks - Create task
// TODO: Add validateTaskInput middleware
// TODO: Consider adding strictLimiter middleware for write operations
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update task
// TODO: Add validateIdParam and validateTaskInput middleware
// TODO: Consider adding strictLimiter middleware for write operations
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
// TODO: Add validateIdParam middleware
// TODO: Consider adding strictLimiter middleware for write operations
router.delete('/:id', taskController.deleteTask);

module.exports = router;
