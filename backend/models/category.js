// models/category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document', // Assuming there's a 'Document' model to link
        },
    ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
