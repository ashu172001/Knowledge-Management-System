import React, { useState, useEffect } from "react";
import "./staff.css";

const Staff = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const [newEmployee, setNewEmployee] = useState({ username: "", password: "", role: "Employee" });
    const [editEmployee, setEditEmployee] = useState(null); // For editing an employee
    const [error, setError] = useState("");

    // Fetch employees from the backend
    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5000/routes/employees/employees");
            if (!response.ok) throw new Error("Failed to fetch employees");
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees. Please try again.");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle input changes for new employee
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    // Handle form submission for adding new employee
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/routes/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newEmployee),
            });
            if (!response.ok) throw new Error("Failed to add employee");

            alert("Employee added successfully");
            setShowModal(false); // Close modal
            setNewEmployee({ username: "", password: "", role: "Employee" }); // Reset form
            fetchEmployees(); // Refresh employee list
        } catch (error) {
            console.error("Error adding employee:", error);
            setError("Failed to add employee. Please try again.");
        }
    };

    // Handle editing an employee
    const handleEditEmployee = (employee) => {
        setEditEmployee(employee);
        setNewEmployee({ username: employee.username, password: "", role: employee.role });
        setShowModal(true);
    };

    // Handle updating an employee
    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        // Prepare updated data
        const updatedData = {
            username: newEmployee.username,
            role: newEmployee.role,
        };

        // Include password only if it's filled
        if (newEmployee.password) {
            updatedData.password = newEmployee.password;
        }

        try {
            const response = await fetch(`http://localhost:5000/routes/employees/${editEmployee._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message || "Failed to update employee");
            }

            alert(`Employee "${newEmployee.username}" updated successfully`);
            setEditEmployee(null); // Clear edit state
            setShowModal(false); // Close modal
            setNewEmployee({ username: "", password: "", role: "Employee" }); // Reset form
            fetchEmployees(); // Refresh employee list
        } catch (error) {
            setError(error.message || "Failed to update employee. Please try again.");
            console.error("Error updating employee:", error);
        }
    };

    // Handle delete functionality
    const handleDeleteEmployee = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5000/routes/employees/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete employee");
            }
            alert("Employee deleted successfully");
            fetchEmployees();
        } catch (error) {
            setError("Failed to delete employee. Please try again.");
            console.error("Error deleting employee:", error);
        }
    };

    return (
        <div className="staff-container">
            <h2>Employee List</h2>
            {error && <div className="error-message">{error}</div>}

            <button className="add-staff-btn" onClick={() => setShowModal(true)}>Add New Staff</button>

            <table className="employee-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={employee._id}>
                            <td>{index + 1}</td>
                            <td>{employee.username}</td>
                            <td>********</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditEmployee(employee)}>Edit</button>
                            </td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDeleteEmployee(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for adding/updating employee */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editEmployee ? "Edit Employee" : "Add New Employee"}</h3>
                        <form
                            onSubmit={editEmployee ? handleUpdateEmployee : handleAddEmployee}
                            className="modal-form"
                        >
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={newEmployee.username}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={newEmployee.password}
                                onChange={handleInputChange}
                            />
                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">
                                    {editEmployee ? "Update Employee" : "Add Employee"}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
