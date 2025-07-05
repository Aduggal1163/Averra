import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner"; // <-- import Sonner
import { BACKEND_URL } from "../../config";
const Login = () => {
  const navigate = useNavigate();
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
      const response = await axios.post(`${BACKEND_URL}/auth/signin`, formData);

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
          navigate("/login"); // fallback
        }
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Averra</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name or Email</label>
            <input
              type="text"
              name="nameoremail"
              value={formData.nameoremail}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your name or email"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
              <option value="guard">Guard</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <a href="/register">Dont have an account ? <span className="text-blue-400">register</span> </a>
        </form>
      </div>
      <Toaster position="top-right" richColors
       toastOptions={{
    className: "text-lg",
    style: { fontSize: "1.15rem" } 
  }}/> 
    </div>
  );
};

export default Login;
