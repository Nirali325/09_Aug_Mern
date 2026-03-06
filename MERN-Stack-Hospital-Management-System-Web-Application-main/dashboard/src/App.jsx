import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import AddNewAdmin from "./components/AddNewAdmin";
import Sidebar from "./components/Sidebar";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );

        setIsAuthenticated(true);
        setAdmin(data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };

    fetchUser();
  }, []); // ✅ IMPORTANT: empty dependency

  return (
    <Router>
      {isAuthenticated && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/doctor/addnew"
          element={
            isAuthenticated ? <AddNewDoctor /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin/addnew"
          element={
            isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/messages"
          element={
            isAuthenticated ? <Messages /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/doctors"
          element={
            isAuthenticated ? <Doctors /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;