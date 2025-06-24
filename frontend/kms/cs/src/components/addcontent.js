import React, { useState, useEffect } from 'react';
import './addcontent.css';

function AddContent() {
    const [categories, setCategories] = useState([]);
    const [documentName, setDocumentName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [message, setMessage] = useState('');

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/routes/category/categories');
                if (!response.ok) {
                    throw new Error('Error fetching categories');
                }
                const data = await response.json();
                setCategories(data); // Set categories to state
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle document form submission
// File type validation (example)
const handleSubmit = async (event) => {
    event.preventDefault();

    if (!documentName || !selectedCategory || !documentFile) {
        setMessage('Please fill out all fields');
        return;
    }

    // Validate file type (optional)
    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validFileTypes.includes(documentFile.type)) {
        setMessage('Invalid file type. Only PDF, JPEG, and PNG are allowed.');
        return;
    }

    // Create form data to send to backend
    const formData = new FormData();
    formData.append('documentName', documentName);
    formData.append('categoryId', selectedCategory);
    formData.append('document', documentFile);

    try {
        const response = await fetch('http://localhost:5000/routes/document/uploadDocument', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error uploading document');
        }

        const data = await response.json();
        setMessage(data.message || 'Document uploaded successfully!');
        setDocumentName('');
        setSelectedCategory('');
        setDocumentFile(null);
    } catch (error) {
        setMessage('Error uploading document: ' + error.message);
    }
};


    return (
        <div className="add-content-container">
            <h2>Add Document to Category</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="add-content-form-group">
                    <label htmlFor="documentName">Document Name</label>
                    <input
                        type="text"
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Enter document name"
                    />
                </div>

                <div className="add-content-form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="add-content-form-group">
                    <label htmlFor="document">Document File</label>
                    <input
                        type="file"
                        id="document"
                        onChange={(e) => setDocumentFile(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="add-content-button">Upload Document</button>
            </form>

            {message && <p className="add-content-message">{message}</p>}
        </div>
    );
}

export default AddContent;