// models/documents.js
const mongoose = require('mongoose');

// Create schema for the document
const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },   // Document name (e.g., file name)
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },   // Category reference (assuming 'Category' model exists)
    fileId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },  // GridFS file URL, which will store the file in MongoDB
    fileName: { type: String, required: true },   // Original file name
    fileSize: { type: Number, required: true },    // Size of the file
    mimeType: { type: String, required: true },    // MIME type of the file (PDF, Word, etc.)
}, { timestamps: true });   // Adds createdAt and updatedAt fields

// Create a mongoose model for documents
const Document = mongoose.model('Document', documentSchema);

// Export the model
module.exports = Document;
