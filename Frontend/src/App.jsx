import './App.css'
import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LandingPage from './Components/LandingPage.jsx'
import Register from './Forms/RegistrationForm.jsx'
import Login from './Forms/Login.jsx'
import RoleProtectedRoute from './Components/RoleProtectedRoute.jsx'
import Unauthorized from './Components/Unauthorized.jsx'
import ResidentDashboard from './Components/Resident/ResidentDashboard.jsx'
import AdminDashboard from './Components/Admin/AdminDashboard.jsx'
import GuardDashboard from './Components/Guard/GuardDasshboard.jsx'
import ServiceProviderDashboard from './Components/SP/ServiceProviderDashboard.jsx'
// import AdminRoutes from './Components/Admin/AdminRoutes.jsx'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
         <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/login' element={<Login/>}/>
          {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
         <Route
    path="/resident-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["resident"]}>
        <ResidentDashboard />
      </RoleProtectedRoute>
    }
  />
  <Route
    path="/admin-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </RoleProtectedRoute>
    }
  />
  <Route
    path="/guard-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["guard"]}>
        <GuardDashboard />
      </RoleProtectedRoute>
    }
  />
  <Route
    path="/provider-dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["service_provider"]}>
        <ServiceProviderDashboard />
      </RoleProtectedRoute>
    }
  />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
