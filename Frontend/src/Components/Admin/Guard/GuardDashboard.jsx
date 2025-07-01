import React, { useEffect, useState } from "react";
import { Plus, Search, Bell, MoreHorizontal, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

// Your exact original API setup - UNCHANGED
const api = (() => {
  const axiosInstance = {
    baseURL: "http://localhost:8080/api/v1",
    get: async (url) => {
      const token = localStorage?.getItem?.("token") || "";
      const headers = token ? { Authorization: token } : {};
      const response = await fetch(`http://localhost:8080/api/v1${url}`, {
        method: 'GET',
        headers
      });
      return { data: await response.json() };
    },
    post: async (url, data) => {
      const token = localStorage?.getItem?.("token") || "";
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {})
      };
      const response = await fetch(`http://localhost:8080/api/v1${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      return { data: await response.json() };
    },
    delete: async (url) => {
      const token = localStorage?.getItem?.("token") || "";
      const headers = token ? { Authorization: token } : {};
      const response = await fetch(`http://localhost:8080/api/v1${url}`, {
        method: 'DELETE',
        headers
      });
      return { data: await response.json() };
    }
  };
  
  return axiosInstance;
})();

const GuardDashboard = () => {
  // Your exact original state - UNCHANGED
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "" });
  const [tasks, setTasks] = useState([]);
  const [guards, setGuards] = useState([]);
  const [refresh, setRefresh] = useState(false);
  
  // New state for slide navigation
  const [currentSlide, setCurrentSlide] = useState(0);

  // Updated to fetch ALL tasks (not just unachieved)
  const fetchTasks = async () => {
    try {
      // First try to get all tasks
      let allTasks = [];
      
      // Fetch unachieved tasks
      try {
        const unachievedRes = await api.get("/guardtask/unachieved");
        if (unachievedRes.data.tasks) {
          allTasks = [...allTasks, ...unachievedRes.data.tasks];
        }
      } catch (err) {
        console.error("Fetch Unachieved Tasks Error:", err);
      }
      
      // Try to fetch achieved/completed tasks if endpoint exists
      try {
        const achievedRes = await api.get("/guardtask/achieved");
        if (achievedRes.data.tasks) {
          allTasks = [...allTasks, ...achievedRes.data.tasks];
        }
      } catch (err) {
        // If achieved endpoint doesn't exist, that's okay
        console.log("Achieved tasks endpoint not available");
      }
      
      // If there's an endpoint for all tasks, try that
      try {
        const allTasksRes = await api.get("/guardtask/all");
        if (allTasksRes.data.tasks) {
          allTasks = allTasksRes.data.tasks;
        }
      } catch (err) {
        // If all tasks endpoint doesn't exist, that's okay
        console.log("All tasks endpoint not available");
      }
      
      setTasks(allTasks);
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

  // Your exact original useEffect - UNCHANGED
  useEffect(() => {
    fetchTasks();
    fetchGuards();
  }, [refresh]);

  // Helper functions for UI display - improved status mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
      case 'pending':
      case 'created':
        return 'bg-orange-100 text-orange-600';
      case 'in_progress':
      case 'inprogress':
      case 'started':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
      case 'achieved':
      case 'done':
      case 'finished':
        return 'bg-green-100 text-green-600';
      default: 
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case 'assigned':
      case 'pending':
      case 'created':
        return 'Pending';
      case 'in_progress':
      case 'inprogress':
      case 'started':
        return 'In Progress';
      case 'completed':
      case 'achieved':
      case 'done':
      case 'finished':
        return 'Completed';
      default:
        return status || 'Pending';
    }
  };

  // Filter tasks by status - improved logic
  const pendingTasks = tasks.filter(task => 
    task.status === 'assigned' || 
    task.status === 'pending' || 
    !task.status || 
    task.status === 'created'
  );
  const inProgressTasks = tasks.filter(task => 
    task.status === 'in_progress' || 
    task.status === 'in_progress' ||
    task.status === 'started'
  );
  const completedTasks = tasks.filter(task => 
    task.status === 'completed' || 
    task.status === 'achieved' ||
    task.status === 'done' ||
    task.status === 'finished'
  );

  const taskColumns = [
    { title: 'Pending Tasks', tasks: pendingTasks, color: 'orange', icon: '⏳' },
    { title: 'In Progress', tasks: inProgressTasks, color: 'blue', icon: '🔄' },
    { title: 'Completed', tasks: completedTasks, color: 'green', icon: '✅' }
  ];

  const TaskCard = ({ task, columnType }) => (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
          {getDisplayStatus(task.status)}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {task.assignedTo?.name?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {(task.status === "assigned" || !task.status || task.status === "pending") && (
          <button
            onClick={() => handleMarkAchieved(task._id)}
            className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
          >
            Mark Achieved
          </button>
        )}
        <button
          onClick={() => handleDelete(task._id)}
          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % taskColumns.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + taskColumns.length) % taskColumns.length);
  };

  return (
    <div className="min-h-screen">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Create Task Form */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Plus size={20} className="mr-2" />
              Create New Task
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Title"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex space-x-2">
                <select
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button 
                  onClick={handleCreateTask}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>

          {/* Task Status Overview Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {taskColumns.map((column, index) => (
              <div 
                key={index}
                className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  currentSlide === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{column.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <p className="text-sm text-gray-500">{column.tasks.length} tasks</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold text-${column.color}-600`}>
                    {column.tasks.length}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sliding Task Columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Slide Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{taskColumns[currentSlide].icon}</span>
                  <h2 className="font-semibold text-gray-900 flex items-center">
                    {taskColumns[currentSlide].title}
                    <span className={`ml-2 bg-${taskColumns[currentSlide].color}-100 text-${taskColumns[currentSlide].color}-600 text-xs px-2 py-1 rounded-full`}>
                      {taskColumns[currentSlide].tasks.length}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={prevSlide}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-500">
                    {currentSlide + 1} / {taskColumns.length}
                  </span>
                  <button 
                    onClick={nextSlide}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Slide Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {taskColumns[currentSlide].tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">{taskColumns[currentSlide].icon}</div>
                    <p>No {taskColumns[currentSlide].title.toLowerCase()} found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {taskColumns[currentSlide].tasks.map((task) => (
                      <TaskCard key={task._id} task={task} columnType={taskColumns[currentSlide].title} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex justify-between items-center">
                Task Overview
                <MoreHorizontal size={16} className="text-gray-400" />
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">{pendingTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{inProgressTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Guards</span>
                  <span className="font-semibold text-purple-600">{guards.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Guard List</h3>
              <div className="space-y-3">
                {guards.slice(0, 4).map((guard) => (
                  <div key={guard._id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {guard.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {guard.name}
                      </p>
                      <p className="text-xs text-gray-500">Guard</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;