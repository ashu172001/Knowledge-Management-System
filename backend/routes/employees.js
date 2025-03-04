const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const bcrypt = require('bcrypt');


// POST route to add an employee
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;

    if (role !== 'Employee') {
        return res.status(400).send('Role must be Employee');
    }

    try {
        const newEmployee = new User({ username, password, role });
        await newEmployee.save();
        res.status(201).send('Employee added');
    } catch (error) {
        res.status(400).send('Error adding employee: ' + error.message);
    }
});

// GET route to fetch employees (username and password only)
router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find({ role: 'Employee' });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});

// PUT route to update employee details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    try {
        const employee = await User.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update fields
        if (username) employee.username = username;
        if (role) employee.role = role;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(password, salt);
        }

        await employee.save();
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE route to remove an employee
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('Employee deleted');
    } catch (error) {
        res.status(400).send('Error deleting employee: ' + error.message);
    }
});

module.exports = router;
