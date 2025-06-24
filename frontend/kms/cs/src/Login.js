import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setUsername(""); // Reset username when role changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/routes/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const { token, role: serverRole } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("role", serverRole);

      if (serverRole === "Admin") navigate("/Dashboard");
      else if (serverRole === "Employee") navigate("/Employee");
      else if (serverRole === "CAO") navigate("/CAO");
      else throw new Error("Invalid role");
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div id="login-page">
      <div className="login-box">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <select value={role} onChange={handleRoleChange}>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="off"
            />
          </div>

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
