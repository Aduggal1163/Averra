import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, User, Calendar, Shield, Flame, Heart } from 'lucide-react';
import axios from 'axios';

const SOSAlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, resolved, unresolved

  // Get current user ID from token or context
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.userId;
      } catch (e) {
        console.error('Invalid token');
        return null;
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchMyAlerts();
  }, []);

  const fetchMyAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:8080/api/v1/sos/all', {
        headers: {
          'Authorization':token,
        }
      });
      
      // Filter to show only current user's alerts
      const myAlerts = response.data.alerts.filter(alert => 
        alert.userId._id === currentUserId || alert.userId === currentUserId
      );
      setAlerts(myAlerts);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      if (err.response) {
        // Backend returned an error response
        setError(`Server Error: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // Request was made but no response received
        setError('Network Error: Unable to reach server');
      } else {
        // Something else happened
        setError(err.message);
      }
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'medical':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (isResolved) => {
    if (isResolved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'resolved') return alert.isResolved;
    if (filter === 'unresolved') return !alert.isResolved;
    return true;
  });

  const getAlertTypeColor = (type) => {
    switch (type) {
      case 'medical':
        return 'border-l-red-500 bg-red-50';
      case 'fire':
        return 'border-l-orange-500 bg-orange-50';
      case 'security':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My SOS Alerts</h1>
                <p className="text-sm text-gray-600 mt-1">Track the status of your emergency alerts</p>
              </div>
              
            </div>
            
            {/* Filter buttons */}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilter('unresolved')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unresolved' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending ({alerts.filter(a => !a.isResolved).length})
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'resolved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Resolved ({alerts.filter(a => a.isResolved).length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Error: {error}</p>
              </div>
            )}

            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You haven't created any SOS alerts yet." 
                    : `No ${filter} alerts found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    className={`border-l-4 rounded-lg p-4 ${getAlertTypeColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900 capitalize">
                              {alert.type} Emergency
                            </h3>
                            {getStatusBadge(alert.isResolved)}
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Created: {formatDate(alert.createdAt)}
                            </div>
                            
                            {alert.respondedBy && (
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2" />
                                Responded by: {alert.respondedBy.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          alert.isResolved ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {alert.isResolved ? 'RESOLVED' : 'PENDING RESPONSE'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => !a.isResolved).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.isResolved).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSAlertsDashboard;