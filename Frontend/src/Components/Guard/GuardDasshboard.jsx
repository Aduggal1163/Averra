import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Shield,
  Key,
  AlertTriangle,
  CheckSquare,
  Users,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Plus
} from "lucide-react";

function GuardDasshboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gatepasses, setGatepasses] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    // Only fetch data after user is set
    if (userData._id) {
      fetchGuardData(userData._id);
    }
  }, [navigate]);

  const fetchGuardData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch pending gatepasses
      const gatepassRes = await axios.get('http://localhost:8080/api/v1/gatepass/getAllGatepasses', { headers });
      setGatepasses(gatepassRes.data.gatepasses || []);

      // Fetch SOS alerts
      const sosRes = await axios.get('http://localhost:8080/api/v1/sos/getSOSAlerts', { headers });
      setSosAlerts(sosRes.data.sosAlerts || []);

      // Fetch assigned tasks
      const taskRes = await axios.get(`http://localhost:8080/api/v1/guardtask/getTasks/${userId}`, { headers });
      setTasks(taskRes.data.tasks || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleGatepassAction = async (gatepassId, action) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/v1/gatepass/${action}Gatepass/${gatepassId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Gatepass ${action}ed successfully!`);
      fetchGuardData(user._id);
    } catch (error) {
      toast.error(`Failed to ${action} gatepass`);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/v1/guardtask/completeTask/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Task marked as completed!');
      fetchGuardData(user._id);
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleSOSResponse = async (alertId, response) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/v1/sos/respondToSOSAlert/${alertId}`, {
        response,
        guardId: user._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('SOS Alert responded to successfully!');
      fetchGuardData(user._id);
    } catch (error) {
      toast.error('Failed to respond to SOS alert');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Key className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Pending Gatepass</p>
            <p className="text-2xl font-bold">{gatepasses.filter(g => g.status === 'pending').length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Active SOS Alerts</p>
            <p className="text-2xl font-bold">{sosAlerts.filter(s => s.status === 'active').length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <CheckSquare className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <p className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Today's Visitors</p>
            <p className="text-2xl font-bold">{visitors.filter(v => new Date(v.visitDate).toDateString() === new Date().toDateString()).length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGatepassManagement = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Gatepass Management</h3>
      <div className="space-y-4">
        {gatepasses.map((gatepass) => (
          <div key={gatepass._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">{gatepass.visitorName}</h4>
                </div>
                <p className="text-gray-600 text-sm">Purpose: {gatepass.purpose}</p>
                <p className="text-gray-600 text-sm">Phone: {gatepass.visitorPhone}</p>
                <p className="text-gray-600 text-sm">House: {gatepass.houseNumber}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(gatepass.visitDate).toLocaleDateString()} at {gatepass.visitTime}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {gatepass.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGatepassAction(gatepass._id, 'approve')}
                      disabled={loading}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleGatepassAction(gatepass._id, 'reject')}
                      disabled={loading}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  gatepass.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  gatepass.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gatepass.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {gatepasses.length === 0 && (
          <p className="text-gray-500 text-center py-8">No gatepass requests found</p>
        )}
      </div>
    </div>
  );

  const renderSOSAlerts = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">SOS Alerts</h3>
      <div className="space-y-4">
        {sosAlerts.map((alert) => (
          <div key={alert._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold">Emergency Alert</h4>
                </div>
                <p className="text-gray-600 text-sm">Location: {alert.location}</p>
                <p className="text-gray-600 text-sm">Description: {alert.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleSOSResponse(alert._id, 'Responding to emergency')}
                    disabled={loading}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Respond
                  </button>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {sosAlerts.length === 0 && (
          <p className="text-gray-500 text-center py-8">No SOS alerts found</p>
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Assigned Tasks</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CheckSquare className={`h-5 w-5 ${task.completed ? 'text-green-600' : 'text-blue-600'}`} />
                  <h4 className="font-semibold">{task.description}</h4>
                </div>
                <p className="text-gray-600 text-sm">Assigned by: {task.assignedBy}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {!task.completed && (
                  <button
                    onClick={() => handleTaskComplete(task._id)}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-8">No tasks assigned</p>
        )}
      </div>
    </div>
  );

  const renderVisitorLog = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Visitor Log</h3>
      <div className="space-y-4">
        {visitors.map((visitor) => (
          <div key={visitor._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold">{visitor.visitorName}</h4>
                </div>
                <p className="text-gray-600 text-sm">Visiting: House {visitor.houseNumber}</p>
                <p className="text-gray-600 text-sm">Purpose: {visitor.purpose}</p>
                <p className="text-gray-600 text-sm">Phone: {visitor.visitorPhone}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(visitor.visitDate).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  visitor.status === 'approved' ? 'bg-green-100 text-green-800' :
                  visitor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {visitor.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {visitors.length === 0 && (
          <p className="text-gray-500 text-center py-8">No visitor logs found</p>
        )}
      </div>
    </div>
  );

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Averra Guard Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Security Guard</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'gatepass', label: 'Gatepass', icon: Key },
            { id: 'sos', label: 'SOS Alerts', icon: AlertTriangle },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'visitors', label: 'Visitor Log', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'gatepass' && renderGatepassManagement()}
        {activeTab === 'sos' && renderSOSAlerts()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'visitors' && renderVisitorLog()}
      </main>
    </div>
  );
}

export default GuardDasshboard;
