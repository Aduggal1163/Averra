import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // your backend base URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = token;
  return config;
});

const GuardDashboard = () => {
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "" });
  const [tasks, setTasks] = useState([]);
  const [guards, setGuards] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/guardtask/unachieved");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    }
  };

  const fetchGuards = async () => {
  try {
    const res = await api.get("/users/allusers?role=guard");
    // Filter users who have role "guard"
    const guardUsers = res.data.users.filter(user => user.role === 'guard');
    setGuards(guardUsers);
  } catch (err) {
    console.error("Fetch Guards Error:", err);
  }
};


  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/guardtask/create", form);
      setForm({ title: "", description: "", assignedTo: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  const handleMarkAchieved = async (taskId) => {
    try {
      await api.post(`/guardtask/achieve/${taskId}`);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Mark Achieved Error:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/guardtask/deleteTask/${taskId}`);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGuards();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Create Task Form */}
      <section className="bg-white p-6 rounded-lg shadow-md max-w-2xl mb-12">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            required
          >
            <option value="">Select Guard</option>
            {guards.map((guard) => (
              <option key={guard._id} value={guard._id}>
                {guard.name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Create Task
          </button>
        </form>
      </section>

      {/* Unachieved Tasks List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Unachieved Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Title</th>
                <th className="text-left px-4 py-2 border-b">Description</th>
                <th className="text-left px-4 py-2 border-b">Status</th>
                <th className="text-left px-4 py-2 border-b">Assigned To</th>
                <th className="text-left px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No tasks found</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2">{task.description}</td>
                    <td className="px-4 py-2 capitalize">{task.status}</td>
                    <td className="px-4 py-2">{task.assignedTo?.name || "Unknown"}</td>
                    <td className="px-4 py-2 space-x-3">
                      {task.status === "assigned" && (
                        <button
                          onClick={() => handleMarkAchieved(task._id)}
                          className="text-green-600 hover:underline"
                        >
                          Mark Achieved
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default GuardDashboard;
