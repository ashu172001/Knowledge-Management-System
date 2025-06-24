//routes/
const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // Adjust the path as necessary
const Document = require('../models/document');


// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
    const query = req.query.query || '';
    try {
        const categories = await Category.find({ 
            name: { $regex: query, $options: 'i' } // Case-insensitive regex search
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/categories/add', async (req, res) => {
    const { name } = req.body;

    try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name });
        await newCategory.save(); // Save to DB
        res.status(200).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding category', error });
    }
});

// Delete Category
router.delete('/categories/delete/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

module.exports = router;



