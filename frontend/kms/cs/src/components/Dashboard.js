import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

let debounceTimer; // Debounce timer

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (!role || (role !== 'Admin' && role !== 'Employee')) {
            navigate('/');
        }
        fetchCategories();
    }, [navigate]);

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/routes/category/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
            setFilteredCategories(data); // Initialize with all categories
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle search with debounce
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (!query) {
                setFilteredCategories(categories); // Reset to all categories if query is empty
                return;
            }
            searchCategories(query);
        }, 300); // Adjust debounce delay as needed
    };

    // Fetch filtered categories
    const searchCategories = async (query) => {
        try {
            const response = await fetch(`http://localhost:5000/routes/category/categories?query=${query}`);
            if (!response.ok) throw new Error('Failed to fetch filtered categories');
            const data = await response.json();
            setFilteredCategories(data);
        } catch (error) {
            console.error('Error searching categories:', error);
        }
    };

    const handleHomeClick = () => {
        if (location.pathname !== '/Dashboard') {
            navigate('/Dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/Login');
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>LOGINWARE</h1>
            </header>

            <nav className="sidebar-nav">
                <a href="/Dashboard" onClick={(e) => { e.preventDefault(); handleHomeClick(); }}>Home</a>
                <a href="/addcategory">AddCategory</a>
                <a href="/addcontent">Add Content</a>
                <a href="/staff">Staff</a>
                <a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
            </nav>

            <div className="dashboard-content">
                <form className="search-bar">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </form>

                <div className="content">
                    <div className="categories-container">
                        <h2>Document Categories</h2>
                        {filteredCategories.length > 0 ? (
                            <div className="categories-row">
                                {filteredCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="category-item"
                                        onClick={() => navigate(`/categories/${category._id}/documents`)}
                                    >
                                        <p>{category.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No matching categories found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
