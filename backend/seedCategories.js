const mongoose = require('mongoose');
const Category = require('./models/category'); // Adjust the path as necessary

const categories = [
    { name: 'Training and Skills Development' },
    { name: 'Employee Training Manuals' },
    { name: 'Certification Documentation' },
    { name: 'Skills Assessment Forms' },
    { name: 'Onboarding Training Modules' },
    { name: 'Technical Skill Development Programs' },
    { name: 'Compliance Training Records' },
    { name: 'Apprenticeship and Internship Documentation' },
    { name: 'Human Resources' },
    { name: 'Information Services' },
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Existing categories deleted.');

        // Seed new categories
        await Category.insertMany(categories);
        console.log('Categories seeded successfully.');

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding categories:', error);
        mongoose.connection.close();
    }
};

seedCategories();
