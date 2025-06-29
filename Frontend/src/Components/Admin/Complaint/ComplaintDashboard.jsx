import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, User, Calendar, MapPin, FileText, Image } from 'lucide-react';
import axios from 'axios';
const  ComplaintDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/v1/complaints/getAllComplaints', {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      setComplaints(response.data.complaints|| []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
 const updateComplaintStatus = async (complaintId, newStatus) => {
  try {
    setUpdating(complaintId);
    const response = await axios.post(
      `http://localhost:8080/api/v1/complaints/updateComplaint/${complaintId}`,
      { status: newStatus }, // ✅ Correct way to send request body
      {
        headers: {
          'Authorization': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local state
    setComplaints(complaints.map(complaint =>
      complaint._id === complaintId
        ? { ...complaint, status: newStatus }
        : complaint
    ));
  } catch (error) {
    console.error('Error updating complaint status:', error);
    alert('Failed to update complaint status');
  } finally {
    setUpdating(null);
  }
};


  // Delete complaint
const deleteComplaint = async (complaintId) => {
  if (!window.confirm('Are you sure you want to delete this complaint?')) {
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/v1/complaints/deleteComplaint/${complaintId}`, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });

    setComplaints(complaints.filter(complaint => complaint._id !== complaintId));
  } catch (error) {
    console.error('Error deleting complaint:', error);
    alert('Failed to delete complaint');
  }
};


  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints based on search and filters
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userId?.houseNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || complaint.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplaintStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const cancelled = complaints.filter(c => c.status === 'cancelled').length;

    return { total, pending, inProgress, resolved, cancelled };
  };

  const stats = getComplaintStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading complaints...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
              <p className="text-gray-600">Manage and track all resident complaints</p>
            </div>
            <button
              onClick={fetchComplaints}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by issue, resident name, email, or house number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
              <p className="text-gray-500">
                {complaints.length === 0 
                  ? "There are no complaints to display." 
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.issue}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{complaint.userId?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>House {complaint.userId?.houseNumber || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(complaint.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(complaint.urgency)}`}>
                            {complaint.urgency?.toUpperCase()}
                          </span>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {getStatusIcon(complaint.status)}
                            <span>{complaint.status?.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {complaint.description && (
                        <div className="mb-4">
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
                        </div>
                      )}
                      
                      {complaint.image && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Image className="w-4 h-4" />
                            <span>Attachment</span>
                          </div>
                          <img
                            src={complaint.image}
                            alt="Complaint attachment"
                            className="max-w-sm h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="lg:w-64 flex lg:flex-col gap-2">
                      <h4 className="font-medium text-gray-900 mb-2 hidden lg:block">Actions</h4>
                      
                      {complaint.status !== 'resolved' && (
                        <>
                          {complaint.status === 'open' && (
                            <button
                              onClick={() => updateComplaintStatus(complaint._id, 'in_progress')}
                              disabled={updating === complaint._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {updating === complaint._id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                              <span>Start Progress</span>
                            </button>
                          )}
                          
                          {complaint.status === 'in_progress' && (
                            <button
                              onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                              disabled={updating === complaint._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {updating === complaint._id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              <span>Mark Resolved</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => updateComplaintStatus(complaint._id, 'cancelled')}
                            disabled={updating === complaint._id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {updating === complaint._id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => deleteComplaint(complaint._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Resident Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">Contact:</span>
                      <span>{complaint.userId?.email || 'No email'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDashboard;