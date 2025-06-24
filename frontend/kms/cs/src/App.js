// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard'; // Consolidated Dashboard component
import Employee from './components/Employee';
import AddContent from './components/addcontent';
import Staff from './components/staff';
import DocumentList from './components/DocumentList';
import AddCategory from './components/AddCategory'; 
import Login from './Login';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Employee" element={<Employee/>} />
                <Route path="/addcontent" element={<AddContent/>}/>
                <Route path="/staff" element={<Staff/>}/>
                <Route path="/categories/:categoryId/documents" element={<DocumentList />} />
                <Route path="/addcategory" element={<AddCategory />} /> {/* Add route for category management */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
