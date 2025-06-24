import React, { useState, useEffect } from 'react';
import './AddCategory.css';

function AddCategory() {
const [categoryName, setCategoryName] = useState('');
const [categories, setCategories] = useState([]); // Stores the list of categories
const [message, setMessage] = useState('');
const [showCategories, setShowCategories] = useState(false); // Toggle state for categories list

// Fetch categories from backend when component mounts
useEffect(() => {
    fetchCategories();
}, []);

const fetchCategories = async () => {
    try {
        const response = await fetch('http://localhost:5000/routes/category/categories');
        const data = await response.json();
        setCategories(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categoryName) {
        setMessage('Please enter a category name');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/routes/category/categories/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error adding category');

        setMessage('Category added successfully!');
        setCategoryName('');
        fetchCategories(); // Refresh categories list
    } catch (error) {
        setMessage('Error adding category: ' + error.message);
    }
};

const handleDelete = async (id) => {
    try {
        const response = await fetch(`http://localhost:5000/routes/category/categories/delete/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error deleting category');
        fetchCategories(); // Refresh categories list after deletion
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};

return (
    <div className="add-category-container">
        <h2 className="title">ADD CATEGORIES</h2>
        
        <div className="input-container">
            <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="input-field"
            />
            <button type="submit" className="add-btn" onClick={handleSubmit}>Add Category</button>
        </div>

        {message && <p className="message">{message}</p>}

        <button className="toggle-btn" onClick={() => setShowCategories(!showCategories)}>
            {showCategories ? "Hide Categories" : "Show Categories"}
        </button>

        {showCategories && (
            <div className="category-list-container">
                {categories.map((category) => (
                    <div key={category._id} className="category-item">
                        <span>{category.name}</span>
                        <button className="delete-btn" onClick={() => handleDelete(category._id)}>Delete</button>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}

export default AddCategory;
