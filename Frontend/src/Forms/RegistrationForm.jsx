import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import backgroundImageUrl from '/assets/background.webp';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "resident",
    houseNumber: "",
    services_offered: [],
    availability: false,
  });

  const SERVICES = ["plumber", "electrician", "housekeeping", "cook", "tutor"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "services_offered") {
      setFormData((prev) => ({
        ...prev,
        services_offered: checked
          ? [...prev.services_offered, value]
          : prev.services_offered.filter((item) => item !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { name, email, password, role, houseNumber, services_offered, availability, phoneNumber } = formData;
      const payload = {
        name,
        email,
        password,
        role,
        phoneNumber,
        availability,
        ...(role === "resident" && { houseNumber }),
        ...(role === "service_provider" && { services_offered }),
      };
      console.log(payload);
      await axios.post(`${BACKEND_URL}/auth/signup`, payload);
      toast.success("Registration successful");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#f7fafc"
      }}
    >
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              minLength={8}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                inputMode="numeric"
                maxLength={10}
                minLength={10}
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="resident">Resident</option>
              <option value="admin">Admin</option>
              <option value="guard">Guard</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>
          {formData.role === "resident" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="House Number"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
          )}
          {formData.role === "service_provider" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
              <div className="flex flex-wrap gap-3">
                {SERVICES.map((service) => (
                  <label key={service} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="services_offered"
                      value={service}
                      checked={formData.services_offered.includes(service)}
                      onChange={handleChange}
                      className="accent-indigo-500"
                    />
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="accent-indigo-500"
            />
            <label className="text-sm text-gray-700">Currently available (for service providers) </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default RegisterForm;
