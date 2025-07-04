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
  Calendar,
  TrendingUp
} from "lucide-react";
import Dashboard from './Dashboard';

// Main Resident Dashboard Component
function ResidentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [gatepasses, setGatepasses] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [polls,setPolls]=useState([]);

  // Slides for complaints and gatepass
  const [complaintsTab, setComplaintsTab] = useState('all');
  const [gatepassTab, setGatepassTab] = useState('all');

  // Announcements tabs
  const announcementTabs = [
    { id: 'all', label: 'All' },
    { id: 'info', label: 'Info' },
    { id: 'warning', label: 'Warning' },
    { id: 'error', label: 'Error' }
  ];
  const [announcementTab, setAnnouncementTab] = useState('all');
  const [sosAlerts,setSosAlerts ]=useState([]);
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
    // eslint-disable-next-line
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

      // Fetch SOS alerts
    const sosRes = await axios.get(`http://localhost:8080/api/v1/sos/getunresolvedSOS`, { headers });
    setSosAlerts(sosRes.data.alerts || []);

    const poll=await axios.get('http://localhost:8080/api/v1/poll/getallpolls',{headers});
    setPolls(poll.data.polls||[]);

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

  // SOS Alert logic
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

  // Overview Card
const renderOverview = () => {
  const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'in-progress');
  const totalComplaints = complaints.length;
  const recentAnnouncements = broadcasts.filter(b => new Date(b.createdAt) > new Date(Date.now() - 72 * 60 * 60 * 1000));
  const lastGatepass = gatepasses[gatepasses.length - 1];
  const activeSOSAlerts = sosAlerts.filter(alert => alert.isResolved === false);
  const activePolls = polls.filter(p => new Date(p.expiresAt) > new Date());

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Complaints */}
        <div className="bg-gradient-to-br from-teal-100 to-teal-50 p-6 rounded-xl shadow-lg border border-teal-200 hover:shadow-xl transition">
          <MessageSquare className="h-10 w-10 text-teal-700 mb-3" />
          <h3 className="text-lg font-semibold text-teal-800">Total Complaints</h3>
          <p className="text-3xl font-bold text-teal-900 mt-1">{totalComplaints}</p>
        </div>

        {/* Open/In-progress Complaints */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition">
          <AlertTriangle className="h-10 w-10 text-yellow-700 mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800">Open Complaints</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-1">{openComplaints.length}</p>
        </div>

        {/* Recent Announcements */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition">
          <Megaphone className="h-10 w-10 text-purple-700 mb-3" />
          <h3 className="text-lg font-semibold text-purple-800">New Announcements</h3>
          <p className="text-3xl font-bold text-purple-900 mt-1">{recentAnnouncements.length}</p>
        </div>

        {/* Last Gatepass Status */}
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition col-span-1 md:col-span-2 lg:col-span-1">
          <Key className="h-10 w-10 text-emerald-700 mb-3" />
          <h3 className="text-lg font-semibold text-emerald-800">Last Gatepass</h3>
          {lastGatepass ? (
            <>
              <p className="text-sm text-emerald-700">Visitor: {lastGatepass.visitorName}</p>
              <p className="text-sm text-emerald-700">Purpose: {lastGatepass.visitPurpose}</p>
              <p className="text-sm text-emerald-700">Status:
                <span className={`ml-1 font-semibold ${
                  lastGatepass.status === 'approved' ? 'text-green-600' :
                  lastGatepass.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {lastGatepass.status}
                </span>
              </p>
              <p className="text-xs text-emerald-600 mt-2">
                {new Date(lastGatepass.visitTime).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-emerald-700 text-sm mt-2">No gatepass records found</p>
          )}
        </div>

        {/* SOS Alerts */}
        <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition">
          <AlertTriangle className="h-10 w-10 text-red-700 mb-3" />
          <h3 className="text-lg font-semibold text-red-800">Active SOS Alerts</h3>
          <p className="text-3xl font-bold text-red-900 mt-1">{activeSOSAlerts.length}</p>
        </div>
        
         <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition">
          <TrendingUp className="h-10 w-10 text-blue-700 mb-3" />
          <h3 className="text-lg font-semibold text-blue-800">Active Polls</h3>
          <p className="text-3xl font-bold text-blue-900 mt-1">{activePolls.length}</p>
        </div>

      </div>
    </div>
  );
};


  // Complaint Delete
  const handleDeleteComplaint = async (complaintId) => {
    try {
      const token = localStorage.getItem('token');
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

  // Complaint Slides
  const complaintTabs = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' }
  ];

  const filterComplaints = (complaints, tab) => {
    if (tab === 'all') return complaints;
    if (tab === 'in-progress') return complaints.filter(c => c.status === 'in-progress' || c.status === 'in_progress');
    return complaints.filter(c => c.status === tab);
  };

  const renderComplaints = () => (
    <div className="bg-white/90 rounded-xl shadow-lg p-7 border border-teal-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-teal-900">My Complaints</h3>
        <button
          onClick={() => setActiveTab('new-complaint')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 font-semibold shadow"
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </button>
      </div>
      {/* Complaint Status Tabs */}
      <div className="flex gap-2 mb-5">
        {complaintTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setComplaintsTab(tab.id)}
            className={`px-4 py-1 rounded-full font-semibold transition
              ${complaintsTab === tab.id ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filterComplaints(complaints, complaintsTab).map((complaint) => (
          <div key={complaint.id} className="border border-teal-100 rounded-lg p-4 bg-teal-50/50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-teal-800">Issue: {complaint.issue}</h4>
                <p className="text-teal-700 text-sm">Description: {complaint.description}</p>
                <p className="text-teal-700 text-sm">Urgency: {complaint.urgency}</p>
                <p className="text-teal-700 text-sm">Status: {complaint.status}</p>
                <p className="text-xs text-teal-500 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                <button onClick={() => handleDeleteComplaint(complaint._id)}
                  className='text-lg bg-red-400 mt-3 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded shadow'>
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
                {(complaint.status === 'in_progress' || complaint.status === 'in-progress') && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">In Progress</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filterComplaints(complaints, complaintsTab).length === 0 && (
          <p className="text-teal-500 text-center py-8">No complaints found</p>
        )}
      </div>
    </div>
  );

  // Gatepass Slides
  const gatepassTabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' }
  ];

  const filterGatepasses = (gatepasses, tab) => {
    if (tab === 'all') return gatepasses;
    return gatepasses.filter(g => g.status === tab);
  };

  const renderGatepass = () => (
    <div className="bg-white/90 rounded-xl shadow-lg p-7 border border-teal-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-teal-900">Visitor Gatepass</h3>
        <button
          onClick={() => setActiveTab('new-gatepass')}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 font-semibold shadow"
        >
          <Plus className="h-4 w-4" />
          Request Gatepass
        </button>
      </div>
      {/* Gatepass Status Tabs */}
      <div className="flex gap-2 mb-5">
        {gatepassTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setGatepassTab(tab.id)}
            className={`px-4 py-1 rounded-full font-semibold transition
              ${gatepassTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filterGatepasses(gatepasses, gatepassTab).map((gatepass) => (
          <div key={gatepass.id} className="border border-teal-100 rounded-lg p-4 bg-teal-50/50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-teal-800">{gatepass.visitorName || 'N/A'}</h4>
                <p className="text-teal-700 text-sm">Purpose: {gatepass.visitPurpose || 'N/A'}</p>
                <p className="text-teal-700 text-sm">Guard Comments: {gatepass.guardComments || 'N/A'}</p>
                <p className="text-xs text-teal-500 mt-2">
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
        {filterGatepasses(gatepasses, gatepassTab).length === 0 && (
          <p className="text-teal-500 text-center py-8">No gatepass requests found</p>
        )}
      </div>
    </div>
  );

  // Announcements Helpers
  const filterAnnouncements = (broadcasts, tab) => {
    if (tab === 'all') return broadcasts;
    return broadcasts.filter(b => b.type === tab);
  };

  const getAnnouncementStyle = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-200 bg-blue-50/50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50';
      case 'error':
        return 'border-red-200 bg-red-50/50';
      default:
        return 'border-teal-100 bg-teal-50/50';
    }
  };

  // Announcements Tab
  const renderAnnouncements = () => (
    <div className="bg-white/90 rounded-xl shadow-lg p-7 border border-teal-100">
      <h3 className="text-xl font-bold text-teal-900 mb-6">Community Announcements</h3>
      {/* Announcement Type Tabs */}
      <div className="flex gap-2 mb-5">
        {announcementTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAnnouncementTab(tab.id)}
            className={`px-4 py-1 rounded-full font-semibold transition
              ${announcementTab === tab.id ? 'bg-teal-600 text-white' : 'bg-teal-50 text-black-700 hover:bg-teal-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filterAnnouncements(broadcasts, announcementTab).map((broadcast) => (
          <div
            key={broadcast.id}
            className={`border rounded-lg p-4 flex items-start gap-3 ${getAnnouncementStyle(broadcast.type)}`}
          >
            {/* Icon based on type */}
            {broadcast.type === 'info' && <Megaphone className="h-5 w-5 text-blue-600 mt-1" />}
            {broadcast.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />}
            {broadcast.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />}
            <div className="flex-1">
              <h4 className="font-semibold text-teal-800">{broadcast.title}</h4>
              <p className="text-teal-700 text-sm mt-1">{broadcast.message}</p>
              <p className="text-xs text-teal-500 mt-2">
                {new Date(broadcast.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {filterAnnouncements(broadcasts, announcementTab).length === 0 && (
          <p className="text-teal-500 text-center py-8">No announcements found</p>
        )}
      </div>
    </div>
  );

  // New Complaint Form
  const renderNewComplaint = () => (
    <NewComplaintForm onBack={() => setActiveTab('complaints')} onSuccess={() => {
      setActiveTab('complaints');
      fetchUserData(user.id);
    }} />
  );

  // New Gatepass Form
  const renderNewGatepass = () => (
    <NewGatepassForm onBack={() => setActiveTab('gatepass')} onSuccess={() => {
      setActiveTab('gatepass');
      fetchUserData(user.id);
    }} />
  );

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-amber-50">
      <ToastContainer />

      {/* Header */}
      <header className="bg-white/90 shadow border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-teal-600" />
              <h1 className="text-2xl font-extrabold text-teal-900 tracking-tight">Averra Resident Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-teal-900">{user.name}</p>
                <p className="text-xs text-teal-500">Appt Number: {user.houseNumber}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition font-semibold shadow"
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
          className="bg-red-500 text-white p-5 rounded-full shadow-lg hover:bg-red-600 transition border-4 border-white"
          aria-label="Raise SOS Alert"
        >
          <AlertTriangle className="h-7 w-7" />
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-white/90 rounded-xl shadow p-2 mb-8 border border-teal-100">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'complaints', label: 'Complaints', icon: MessageSquare },
            { id: 'gatepass', label: 'Gatepass', icon: Key },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'communties', label: 'Communties', icon: BarChart2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-base font-medium transition
                ${activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-teal-700 hover:text-teal-900 hover:bg-teal-50'
                }`}
            >
              <tab.icon className="h-5 w-5" />
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
        {activeTab === 'communties' && <Dashboard />}
      </main>
    </div>
  );
}

// New Complaint Form Component
function NewComplaintForm({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    issue: '',
    description: '',
    category: 'general',
    urgency: 'low'
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
      formDataToSend.append('urgency', formData.urgency);
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
    <div className="bg-white/90 rounded-xl shadow-lg p-7 border border-teal-100 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-teal-600 hover:text-teal-900 font-semibold">
          ← Back
        </button>
        <h3 className="text-xl font-bold text-teal-900">Raise New Complaint</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50 placeholder:text-black-400"
            placeholder="Describe the issue"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Urgency</label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50 placeholder:text-black-400"
            placeholder="Add more details"
            required
          />
        </div>
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700 transition-colors disabled:opacity-60 font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-teal-50 text-teal-700 px-5 py-2 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors font-semibold"
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
      // Combine date + time into a single Date object
      const fullDateTime = new Date(`${formData.visitDate}T${formData.visitTime}`);

      await axios.post('http://localhost:8080/api/v1/gatepass/requestGatepass', {
        visitorName: formData.visitorName,
        visitPurpose: formData.visitPurpose,
        guardComments: formData.guardComments,
        visitTime: fullDateTime.toISOString(),
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
    <div className="bg-white/90 rounded-xl shadow-lg p-7 border border-teal-100 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-teal-600 hover:text-teal-900 font-semibold">
          ← Back
        </button>
        <h3 className="text-xl font-bold text-teal-900">Request Visitor Gatepass</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Visitor Name</label>
          <input
            type="text"
            value={formData.visitorName}
            onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Guard Comments if any</label>
          <input
            type="text"
            value={formData.guardComments}
            onChange={(e) => setFormData({ ...formData, guardComments: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Purpose of Visit</label>
          <input
            type="text"
            value={formData.visitPurpose}
            onChange={(e) => setFormData({ ...formData, visitPurpose: e.target.value })}
            className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Visit Date</label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-teal-700 mb-1">Visit Time</label>
            <input
              type="time"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-teal-50/50"
              required
            />
          </div>
        </div>
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg shadow hover:bg-emerald-700 transition-colors disabled:opacity-60 font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-teal-50 text-teal-700 px-5 py-2 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResidentDashboard;
