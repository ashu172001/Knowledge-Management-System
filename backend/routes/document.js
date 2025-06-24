const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Document = require('../models/document');
const Category = require('../models/category');
const GridFSBucket = require('mongodb').GridFSBucket;
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const path = require('path');



const router = express.Router();

// Create a multer instance for file upload (keep this the same)
const storage = multer.memoryStorage();  // Use memoryStorage instead of diskStorage
const upload = multer({ storage });

// Middleware to set up GridFSBucket
router.use((req, res, next) => {
    const db = mongoose.connection.db;
    req.bucket = new GridFSBucket(db, { bucketName: 'documents' });
    next();
});


// Route to upload a document
router.post('/uploadDocument', upload.single('document'), async (req, res) => {
    const { documentName, categoryId } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Validate categoryId
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const uploadStream = req.bucket.openUploadStream(req.file.originalname, {
            metadata: { categoryId, documentName },
            contentType: req.file.mimetype,
        });

        // Handle stream finish event
        uploadStream.on('finish', async () => {
            try {
                const newDocument = new Document({
                    name: documentName,
                    categoryId,
                    fileId: uploadStream.id,
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                });

                // Link the document to the category
                category.documents.push(newDocument._id);
                await category.save();
                await newDocument.save();

                res.status(200).json({
                    message: 'Document uploaded successfully',
                    document: {
                        id: newDocument._id,
                        name: newDocument.name,
                        categoryId: newDocument.categoryId,
                        fileId: newDocument.fileId,
                        fileName: newDocument.fileName,
                        fileSize: newDocument.fileSize,
                        mimeType: newDocument.mimeType,
                    },
                });
            } catch (error) {
                console.error('Error saving document metadata:', error);
                res.status(500).json({ message: 'Error saving document metadata', error });
            }
        });

        // Handle stream error event
        uploadStream.on('error', (error) => {
            console.error('Upload stream error:', error);
            res.status(500).json({ message: 'Error uploading document', error });
        });

        // End the stream with the file buffer
        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error('Error during upload:', error);
        res.status(500).json({ message: 'Error uploading document', error });
    }
});


// Route to fetch documents by category
router.get('/:categoryId/documents', async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Fetch documents associated with the given category ID
        const documents = await Document.find({ categoryId });
        const documentsWithUrls = documents.map((doc) => ({
            _id: doc._id,
            name: doc.name,
            fileId: doc.id, // Replace with actual file ID logic
            mimeType: doc.mimeType,
            fileSize: doc.fileSize,
            createdAt: doc.createdAt,
        }));

        res.json(documentsWithUrls);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Error fetching documents', error });
    }
});



// Route to retrieve and preview a document by fileId
router.get('/preview/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).send('Document not found');

        // Open a download stream from GridFS
        const downloadStream = req.bucket.openDownloadStream(document.fileId);
        
        // Set the correct MIME type
        res.set('Content-Type', document.mimeType);
        
        // Pipe the download stream to the response
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            console.error('Error streaming document:', error);
            res.status(500).send('Error previewing document');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error previewing document');
    }
});


module.exports = router;
