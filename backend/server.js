//server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const documentRoutes = require('./routes/document');
const employeeRoutes = require('./routes/employees'); // Import employees routes

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

let bucket;

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'document'
        });
        console.log('GridFSBucket initialized successfully');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });


    app.use((req, res, next) => {
        req.bucket = bucket;
        next();
    });


// Use routes
app.use('/routes/auth', authRoutes);
app.use('/routes/category', categoryRoutes);
app.use('/routes/document', documentRoutes);
app.use('/routes/employees', employeeRoutes); // Add employee routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
