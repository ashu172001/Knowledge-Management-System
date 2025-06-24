const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
});

// Define user schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'CAO', 'Employee'] }, // Added enum for roles
});

const User = mongoose.model('User', userSchema);

// Function to create a user
const createUser = async (username, password, role) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        console.log(`User ${username} created successfully!`);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
};

// Call the function with desired credentials
createUser('Herald', '12345', 'Admin')
    .catch((error) => console.error('Error:', error));
