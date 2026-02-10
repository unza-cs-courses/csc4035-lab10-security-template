/**
 * Lab 10: Task Controller
 * CSC4035 Web Programming and Technologies
 *
 * Task controller with CRUD operations.
 * This controller is provided - no changes needed.
 */

const Task = require('../models/Task');

function getAllTasks(req, res) {
    const tasks = Task.getAll();
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
}

function getTask(req, res) {
    const task = Task.getById(req.params.id);
    if (!task) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }
    res.json({
        success: true,
        data: task
    });
}

function createTask(req, res) {
    const { title, description, status, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Title is required'
        });
    }

    const task = Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status,
        priority
    });

    res.status(201).json({
        success: true,
        data: task
    });
}

function updateTask(req, res) {
    const task = Task.update(req.params.id, req.body);
    if (!task) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }
    res.json({
        success: true,
        data: task
    });
}

function deleteTask(req, res) {
    const deleted = Task.remove(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Task not found'
        });
    }
    res.status(204).send();
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};
