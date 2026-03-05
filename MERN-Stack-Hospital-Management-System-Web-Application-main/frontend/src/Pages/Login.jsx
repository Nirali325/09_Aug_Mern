import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password, role: "Patient" },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Login Successful!");
      setIsAuthenticated(true);
      navigate("/");

      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="container form-component login-form">
      <h2>Sign In</h2>
      <p>Please login to continue</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px" }}>
          <p style={{ margin: 0 }}>Not Registered?</p>
          <Link to="/register" style={{ color: "#271776ca", textDecoration: "none" }}>
            Register Now
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;