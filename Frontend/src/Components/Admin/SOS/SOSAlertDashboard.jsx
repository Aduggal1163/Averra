import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Heart, Flame, Clock, CheckCircle, User, Calendar, RefreshCw } from 'lucide-react';

const SOSAlertDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [unresolvedAlerts, setUnresolvedAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');

  // Configure your backend URL here
  const API_BASE_URL = 'http://localhost:8080/api/v1'; // Change this to your actual backend URL

  const alertTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', textColor: 'text-red-700' },
    { value: 'fire', label: 'Fire Emergency', icon: Flame, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { value: 'security', label: 'Security Alert', icon: Shield, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' }
  ];

  // API call helper function
  const makeAPICall = async (endpoint, method = 'GET', data = null) => {
    try {
      const token = localStorage.getItem('token'); // Adjust token storage as needed
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token })
      };

      const config = {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) })
      };

      // Use axios here in your actual implementation
      // For demo purposes, showing the structure
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Fetch all alerts
  const fetchAllAlerts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Replace with: const response = await axios.get(`${API_BASE_URL}/sos/alerts`, axiosConfig);
      const response = await makeAPICall('/sos/all');
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to fetch alerts. Please check your connection.');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unresolved alerts
  const fetchUnresolvedAlerts = async () => {
    try {
      // Replace with: const response = await axios.get(`${API_BASE_URL}/sos/unresolved`, axiosConfig);
      const response = await makeAPICall('/sos/getunresolvedSOS');
      setUnresolvedAlerts(response.alerts || []);
    } catch (error) {
      console.error('Error fetching unresolved alerts:', error);
      setUnresolvedAlerts([]);
    }
  };

  // Create new SOS alert
  const createSOSAlert = async (type) => {
    try {
      setCreating(true);
      setError('');
      
      // Replace with: await axios.post(`${API_BASE_URL}/sos/create`, { type }, axiosConfig);
      await makeAPICall('/sos/create', 'POST', { type });
      
      // Refresh data after creating
      await fetchAllAlerts();
      await fetchUnresolvedAlerts();
      setSelectedType('');
      
      // Show success message
      setError('SOS Alert created successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error creating alert:', error);
      setError('Failed to create SOS alert. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Respond to SOS alert
  const respondToAlert = async (alertId) => {
    try {
      // Replace with: await axios.put(`${API_BASE_URL}/sos/respond/${alertId}`, {}, axiosConfig);
      await makeAPICall(`/sos/respond/${alertId}`, 'post');
      
      // Refresh data after responding
      await fetchAllAlerts();
      await fetchUnresolvedAlerts();
      
      setError('Successfully responded to alert!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error responding to alert:', error);
      setError('Failed to respond to alert. Please try again.');
    }
  };

  useEffect(() => {
    fetchAllAlerts();
    fetchUnresolvedAlerts();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!creating) { // Don't refresh while creating
        fetchAllAlerts();
        fetchUnresolvedAlerts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getAlertTypeConfig = (type) => {
    return alertTypes.find(alert => alert.value === type) || alertTypes[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const AlertCard = ({ alert, showRespond = false }) => {
    const typeConfig = getAlertTypeConfig(alert.type);
    const IconComponent = typeConfig.icon;

    return (
      <div className={`p-6 rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        alert.isResolved ? 'bg-gray-50 border-l-gray-400' : `${typeConfig.bgColor} border-l-${alert.type === 'medical' ? 'red' : alert.type === 'fire' ? 'orange' : 'blue'}-500`
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${alert.isResolved ? 'bg-gray-200' : `bg-gradient-to-br ${typeConfig.color}`}`}>
              <IconComponent className={`w-6 h-6 ${alert.isResolved ? 'text-gray-600' : 'text-white'}`} />
            </div>
            <div>
              <h3 className={`font-bold text-xl ${alert.isResolved ? 'text-gray-600' : typeConfig.textColor}`}>
                {typeConfig.label}
              </h3>
              <p className="text-sm text-gray-600 flex items-center mt-2">
                <User className="w-4 h-4 mr-2" />
                {alert.userId?.name || 'Unknown User'} ({alert.userId?.role || 'User'})
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
              alert.isResolved 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse'
            }`}>
              {alert.isResolved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolved
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Active
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(alert.createdAt)}
          </div>
          
          {showRespond && !alert.isResolved && (
            <button
              onClick={() => respondToAlert(alert._id)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Respond Now
            </button>
          )}
        </div>
        
        {alert.respondedBy && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800 flex items-center font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Responded by: {alert.respondedBy?.name || 'Unknown Responder'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-xl border-b backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  SOS Alert System
                </h1>
                <p className="text-gray-600 font-medium">Emergency Response Dashboard</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  activeTab === 'dashboard' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  activeTab === 'create' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Create Alert
              </button>
              <button
                onClick={() => setActiveTab('respond')}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  activeTab === 'respond' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Respond
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error/Success Message */}
      {error && (
        <div className={`max-w-7xl mx-auto px-6 py-4`}>
          <div className={`p-4 rounded-xl ${
            error.includes('successfully') || error.includes('Success') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Alerts</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{alerts.length}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Active Alerts</p>
                    <p className="text-4xl font-bold text-yellow-600 mt-2">{unresolvedAlerts.length}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Resolved</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{alerts.length - unresolvedAlerts.length}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Response Rate</p>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">
                      {alerts.length > 0 ? Math.round(((alerts.length - unresolvedAlerts.length) / alerts.length) * 100) : 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Alerts</h2>
                <button
                  onClick={() => {
                    fetchAllAlerts();
                    fetchUnresolvedAlerts();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <p className="text-gray-600 text-xl font-bold mb-2">No alerts found</p>
                  <p className="text-gray-500">Create your first SOS alert to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {alerts.slice(0, 5).map((alert) => (
                    <AlertCard key={alert._id} alert={alert} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Alert Tab */}
        {activeTab === 'create' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New SOS Alert</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {alertTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        selectedType === type.value
                          ? 'border-blue-500 bg-blue-50 shadow-2xl'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
                      }`}
                    >
                      <div className={`p-6 rounded-2xl bg-gradient-to-br ${type.color} mb-6 mx-auto w-fit shadow-lg`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{type.label}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {type.value === 'medical' && 'Medical emergency requiring immediate assistance from healthcare professionals'}
                        {type.value === 'fire' && 'Fire emergency or safety hazard alert requiring immediate evacuation'}
                        {type.value === 'security' && 'Security threat or safety concern requiring immediate response'}
                      </p>
                    </button>
                  );
                })}
              </div>
              
              {selectedType && (
                <div className="mt-10 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Ready to create {getAlertTypeConfig(selectedType).label}?
                      </h3>
                      <p className="text-gray-600">This will immediately notify all responders in your network.</p>
                    </div>
                    <button
                      onClick={() => createSOSAlert(selectedType)}
                      disabled={creating}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {creating ? 'Creating...' : 'Create Alert'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Respond Tab */}
        {activeTab === 'respond' && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Active Alerts Requiring Response</h2>
                <button
                  onClick={fetchUnresolvedAlerts}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all transform hover:scale-105 shadow-lg font-bold flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh
                </button>
              </div>
              
              {unresolvedAlerts.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                  <p className="text-gray-600 text-xl font-bold mb-2">No active alerts</p>
                  <p className="text-gray-500">All alerts have been resolved</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {unresolvedAlerts.map((alert) => (
                    <AlertCard key={alert._id} alert={alert} showRespond={true} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSAlertDashboard;