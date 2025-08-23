import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import DashboardCustomer from "./pages/DashboardCustomer.js";
import DashboardFarmer from "./pages/DashboardFarmer.js";
import DashboardAdmin from "./pages/DashboardAdmin.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to MandiHub</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<ProtectedRoute roles={['customer']}><DashboardCustomer /></ProtectedRoute>} />
        <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><DashboardFarmer /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardAdmin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
