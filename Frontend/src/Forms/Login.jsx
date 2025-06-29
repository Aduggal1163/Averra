import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    nameoremail: "",
    password: "",
    role: "resident",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post("http://localhost:8080/api/v1/auth/signin", formData);

    // Save token and user
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    toast.success(response.data.message);

    // Role-based redirect after short delay
    setTimeout(() => {
      const role = response.data.user.role;
      if (role === "resident") {
        navigate("/resident-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "guard") {
        navigate("/guard-dashboard");
      } else if (role === "service_provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard"); // fallback
      }
    }, 1000);
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/assets/background2.png')` }}>
      <div className="backdrop-blur-lg bg-black/10 shadow-2xl rounded-xl p-10 w-full max-w-md text-black border border-black/20">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to Averra</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Name or Email</label>
            <input
              type="text"
              name="nameoremail"
              value={formData.nameoremail}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-black placeholder-gray-200 focus:outline-none"
              placeholder="Enter your name or email"
              
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-black placeholder-gray-200 focus:outline-none"
              placeholder="Enter your password"
              
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-black focus:outline-none"
            >
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
              <option value="guard">Guard</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover/>
    </div>
  );
};

export default Login;
