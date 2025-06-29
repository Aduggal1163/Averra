import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import backgroundImageUrl from '/assets/background.webp'
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterForm = () => {
  const [isLoading,setIsLoading]=useState(false)
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

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        services_offered: checked
          ? [...prev.services_offered, value]
          : prev.services_offered.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { name, email, password, role, houseNumber, services_offered, availability } = formData;
      const payload = {
        name,
        email,
        password,
        role,
        availability,
        ...(role === "resident" && { houseNumber }),
        ...(role === "service_provider" && { services_offered }),
      };

      const res = await axios.post("http://localhost:8080/api/v1/auth/signup", payload);
      console.log(res);
      toast.success("Registration successful");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Register an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"  className="w-full px-4 py-2 rounded bg-white/20 text-black placeholder-black/70 focus:outline-none" />

          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"  className="w-full px-4 py-2 rounded bg-white/20 text-black placeholder-black/70 focus:outline-none" />

          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"  minLength={8} className="w-full px-4 py-2 rounded bg-white/20 text-black placeholder-black/70 focus:outline-none" />

          <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 rounded bg-white/20 text-black focus:outline-none">
            <option value="resident" className="bg-gray-600">Resident</option>
            <option value="admin" className="bg-gray-600">Admin</option>
            <option value="guard" className="bg-gray-600">Guard</option>
            <option value="service_provider" className="bg-gray-600">Service Provider</option>
          </select>

          {formData.role === "resident" && (
            <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} placeholder="House Number"  className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-black/70 focus:outline-none" />
          )}

          {formData.role === "service_provider" && (
            <div className="space-y-2">
              <p className="text-white text-sm">Select Services:</p>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <label key={service} className="flex items-center gap-2 text-white text-sm">
                    <input type="checkbox" name="services_offered" value={service} checked={formData.services_offered.includes(service)} onChange={handleChange} />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="text-white text-sm flex items-center gap-2">
            <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
            Available
          </label>

          <button
  type="submit"
  className="w-full bg-green-700 text-white py-2 rounded-full hover:bg-green-800 transition disabled:opacity-60"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="flex justify-center items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      Submitting...
    </span>
  ) : (
    "Register"
  )}
</button>

        </form>

        <p className="text-center text-white text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-400 underline">Login</a>
        </p>
      </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default RegisterForm;
