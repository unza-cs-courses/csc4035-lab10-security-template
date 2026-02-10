/**
 * Lab 10: Task Model
 * CSC4035 Web Programming and Technologies
 *
 * Task model with basic CRUD operations.
 * This model is provided - no changes needed.
 */

const { v4: uuidv4 } = require('uuid');

// In-memory task storage
let tasks = [
    {
        id: '1',
        title: 'Complete security audit',
        description: 'Review and fix all security vulnerabilities',
        status: 'in-progress',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Implement rate limiting',
        description: 'Add rate limiting to prevent abuse',
        status: 'pending',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

function getAll() {
    return [...tasks];
}

function getById(id) {
    return tasks.find(task => task.id === id) || null;
}

function create(data) {
    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(task);
    return task;
}

function update(id, data) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    tasks[index] = {
        ...tasks[index],
        ...data,
        id: tasks[index].id, // Preserve original ID
        createdAt: tasks[index].createdAt, // Preserve creation date
        updatedAt: new Date().toISOString()
    };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

function reset() {
    tasks = [
        {
            id: '1',
            title: 'Complete security audit',
            description: 'Review and fix all security vulnerabilities',
            status: 'in-progress',
            priority: 'high',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Implement rate limiting',
            description: 'Add rate limiting to prevent abuse',
            status: 'pending',
            priority: 'high',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    reset
};
