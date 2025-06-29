import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/admin-dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" />}>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
