import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Home,
  MessageSquare,
  Key,
  AlertTriangle,
  Megaphone,
  BarChart2,
  LogOut,
  Plus,
  Clock,
  Calendar
} from "lucide-react";
import Dashboard from './Dashboard';

function ResidentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [gatepasses, setGatepasses] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    if (userData.id) {
      fetchUserData(userData.id);
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };

      // Fetch complaints
      const complaintsRes = await axios.get(`http://localhost:8080/api/v1/complaints/getComplaints/${userId}`, { headers });
      setComplaints(complaintsRes.data.complaints || []);

      // Fetch gatepasses
      const gatepassRes = await axios.get(`http://localhost:8080/api/v1/gatepass/mygatepass/${userId}`, { headers });
      setGatepasses(gatepassRes.data.gatepass || []);

      // Fetch broadcasts
      const broadcastRes = await axios.get('http://localhost:8080/api/v1/broadcast/getAllBroadcast', { headers });
      setBroadcasts(broadcastRes.data.broadcasts || []);

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

  const [alertType, setAlertType] = useState("medical");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedType, setSelectedType] = useState("");
   const raiseSOSAlert = async () => {
    if (!selectedType) {
      toast.error("Please select an alert type");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/v1/sos/create",
        { type: selectedType },
        { headers: { Authorization: token } }
      );

      toast.success("SOS Alert sent successfully!");
      setShowPopup(false);
      setSelectedType("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send SOS alert");
    } finally {
      setLoading(false);
    }
  };


  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Active Complaints</p>
            <p className="text-2xl font-bold">{complaints.filter(c => c.status === 'open' || c.status === 'in-progress').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Key className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Pending Gatepass</p>
            <p className="text-2xl font-bold">{gatepasses.filter(g => g.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Megaphone className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">New Announcements</p>
            <p className="text-2xl font-bold">{broadcasts.filter(b => new Date(b.createdAt) > new Date(Date.now() - 400 * 60 * 60 * 1000)).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <BarChart2 className="h-8 w-8 text-orange-600" />
          POLLS
        </div>
      </div>
      <div>
      <Dashboard/>
      </div>
    </div>
    
  );
  const handleDeleteComplaint = async (complaintId) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Deleting complaint with ID:", complaintId);
      await axios.delete(`http://localhost:8080/api/v1/complaints/deleteComplaint/${complaintId}`, {
        headers: { Authorization: token }
      });
      toast.success("Complaint deleted successfully");
      fetchUserData(user.id);
    } catch (error) {
      toast.error("Failed to delete complaint");
      console.error("Delete error:", error);
    }
  };

  const renderComplaints = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">My Complaints</h3>
        <button
          onClick={() => setActiveTab('new-complaint')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </button>
      </div>
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">Issue Posted: {complaint.issue}</h4>
                <p className="text-gray-600 text-sm">Description: {complaint.description}</p>
                <p className="text-gray-600 text-sm">Urgency: {complaint.urgency}</p>
                <p className="text-gray-600 text-sm">Status: {complaint.status}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                <button onClick={() => handleDeleteComplaint(complaint._id)}
                  className='text-lg bg-red-300 mt-3 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded'>
                  Delete
                </button>
              </div>
              <div className="flex items-center gap-2">
                {complaint.status === 'pending' && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
                )}
                {complaint.status === 'resolved' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Resolved</span>
                )}
                {complaint.status === 'in_progress' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">In Progress</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {complaints.length === 0 && (
          <p className="text-gray-500 text-center py-8">No complaints found</p>
        )}
      </div>
    </div>
  );

  const renderGatepass = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Visitor Gatepass</h3>
        <button
          onClick={() => setActiveTab('new-gatepass')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Request Gatepass
        </button>
      </div>

      <div className="space-y-4">
        {gatepasses.map((gatepass) => (
          <div key={gatepass.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{gatepass.visitorName || 'N/A'}</h4>
                <p className="text-gray-600 text-sm">visit Purpose: {gatepass.visitPurpose || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Guard Comments: {gatepass.guardComments || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(gatepass.visitTime).toLocaleDateString() || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {gatepass.status === 'pending' && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
                )}
                {gatepass.status === 'approved' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Approved</span>
                )}
                {gatepass.status === 'rejected' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Rejected</span>
                )}
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

  const renderAnnouncements = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Community Announcements</h3>
      <div className="space-y-4">
        {broadcasts.map((broadcast) => (
          <div key={broadcast.id} className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Megaphone className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold">{broadcast.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{broadcast.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(broadcast.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {broadcasts.length === 0 && (
          <p className="text-gray-500 text-center py-8">No announcements found</p>
        )}
      </div>
    </div>
  );
 

  const renderNewComplaint = () => (
    <NewComplaintForm onBack={() => setActiveTab('complaints')} onSuccess={() => {
      setActiveTab('complaints');
      fetchUserData(user.id);
    }} />
  );

  const renderNewGatepass = () => (
    <NewGatepassForm onBack={() => setActiveTab('gatepass')} onSuccess={() => {
      setActiveTab('gatepass');
      fetchUserData(user.id);
    }} />
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
              <Home className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Averra Resident Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>

                <p className="text-xs text-gray-500">Appt Number: {user.houseNumber}</p>
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

      {/* Emergency SOS Button */}
  <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Popup */}
      {showPopup && (
        <div className="bg-white shadow-lg border rounded-lg p-4 w-64 mb-2 animate-slide-up">
          <h3 className="text-md font-semibold mb-3">Select SOS Type</h3>

          <div className="space-y-2">
            {["medical", "fire", "security"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full p-2 rounded-md border text-left transition ${
                  selectedType === type
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type === "medical" && "🚑 Medical"}
                {type === "fire" && "🔥 Fire"}
                {type === "security" && "🛡️ Security"}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowPopup(false)}
              className="text-sm px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={raiseSOSAlert}
              disabled={loading}
              className="text-sm px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* SOS Floating Button */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <AlertTriangle className="h-6 w-6" />
      </button>
    </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'complaints', label: 'Complaints', icon: MessageSquare },
            { id: 'gatepass', label: 'Gatepass', icon: Key },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id
                ? 'bg-green-600 text-white'
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
        {activeTab === 'complaints' && renderComplaints()}
        {activeTab === 'gatepass' && renderGatepass()}
        {activeTab === 'announcements' && renderAnnouncements()}
        {activeTab === 'new-complaint' && renderNewComplaint()}
        {activeTab === 'new-gatepass' && renderNewGatepass()}
      </main>
    </div>
  );
}

// New Complaint Form Component
function NewComplaintForm({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    urgency: 'low' // Default urgency
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('issue', formData.issue);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('urgency', formData.urgency); // Corrected to use formData.urgency
      formDataToSend.append('userId', JSON.parse(localStorage.getItem('user')).id);

      await axios.post('http://localhost:8080/api/v1/complaints/raise-complaint', formDataToSend, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Complaint raised successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to raise complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <h3 className="text-xl font-semibold">Raise New Complaint</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// New Gatepass Form Component
function NewGatepassForm({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    guardComments: '',
    visitPurpose: '',
    visitDate: '',
    visitTime: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Combine date + time into a single Date object
      const fullDateTime = new Date(`${formData.visitDate}T${formData.visitTime}`);

      await axios.post('http://localhost:8080/api/v1/gatepass/requestGatepass', {
        visitorName: formData.visitorName,
        visitPurpose: formData.visitPurpose,
        guardComments: formData.guardComments,
        visitTime: fullDateTime.toISOString(), // send as ISO
      }, {
        headers: { Authorization: token }
      });

      toast.success('Gatepass request submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error("Gatepass post error:", error.response?.data || error.message);
      toast.error('Failed to submit gatepass request');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <h3 className="text-xl font-semibold">Request Visitor Gatepass</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
          <input
            type="text"
            value={formData.visitorName}
            onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guard Comments if any </label>
          <input
            type="text"
            value={formData.guardComments}
            onChange={(e) => setFormData({ ...formData, guardComments: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
          <input
            type="text"
            value={formData.visitPurpose}
            onChange={(e) => setFormData({ ...formData, visitPurpose: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time</label>
            <input
              type="time"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
     
    </div>
  );
}

export default ResidentDashboard;
