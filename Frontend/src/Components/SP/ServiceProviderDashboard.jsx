import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Wrench,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Plus,
  User,
  Phone,
  MapPin,
  Star,
  Settings,
  TrendingUp,
  Package
} from "lucide-react";

function ServiceProviderDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setAvailability(userData.availability || false);
    if (userData._id) {
      fetchServiceProviderData(userData._id);
    }
  }, [navigate]);

  const fetchServiceProviderData = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch bookings
      const bookingRes = await axios.get(`http://localhost:8080/api/v1/service-booking/getBookings/${userId}`, { headers });
      setBookings(bookingRes.data.bookings || []);

      // Calculate earnings
      const completedBookings = bookingRes.data.bookings?.filter(b => b.status === 'completed') || [];
      const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      setEarnings(totalEarnings);

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

  const handleBookingAction = async (bookingId, action) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/v1/service-booking/${action}Booking/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Booking ${action}ed successfully!`);
      fetchServiceProviderData(user._id);
    } catch (error) {
      toast.error(`Failed to ${action} booking`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/v1/users/updateAvailability/${user._id}`, {
        availability: !availability
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAvailability(!availability);
      toast.success(`Availability ${!availability ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Pending Bookings</p>
            <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Completed Jobs</p>
            <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'completed').length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold">₹{earnings}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Services Offered</p>
            <p className="text-2xl font-bold">{user?.services_offered?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Service Bookings</h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">{booking.customerName}</h4>
                </div>
                <p className="text-gray-600 text-sm">Service: {booking.serviceType}</p>
                <p className="text-gray-600 text-sm">Address: {booking.address}</p>
                <p className="text-gray-600 text-sm">Phone: {booking.customerPhone}</p>
                <p className="text-gray-600 text-sm">Amount: ₹{booking.amount}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookingAction(booking._id, 'accept')}
                      disabled={loading}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleBookingAction(booking._id, 'reject')}
                      disabled={loading}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {booking.status === 'accepted' && (
                  <button
                    onClick={() => handleBookingAction(booking._id, 'complete')}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-500 text-center py-8">No bookings found</p>
        )}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">My Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.services_offered?.map((service, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold capitalize">{service}</h4>
            </div>
            <p className="text-gray-600 text-sm">Service available</p>
          </div>
        ))}
        {(!user?.services_offered || user.services_offered.length === 0) && (
          <p className="text-gray-500 text-center py-8 col-span-full">No services configured</p>
        )}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Earnings Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">₹{earnings}</div>
          <p className="text-gray-600">Total Earnings</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{bookings.filter(b => b.status === 'completed').length}</div>
          <p className="text-gray-600">Completed Jobs</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {earnings > 0 && bookings.filter(b => b.status === 'completed').length > 0 
              ? Math.round(earnings / bookings.filter(b => b.status === 'completed').length)
              : 0}
          </div>
          <p className="text-gray-600">Average per Job</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">Recent Completed Jobs</h4>
        <div className="space-y-3">
          {bookings.filter(b => b.status === 'completed').slice(0, 5).map((booking) => (
            <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-sm text-gray-600">{booking.serviceType}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">₹{booking.amount}</p>
                <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {bookings.filter(b => b.status === 'completed').length === 0 && (
            <p className="text-gray-500 text-center py-4">No completed jobs yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-semibold">Availability Status</h4>
            <p className="text-sm text-gray-600">
              {availability ? 'You are currently accepting new bookings' : 'You are currently not accepting new bookings'}
            </p>
          </div>
          <button
            onClick={handleAvailabilityToggle}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              availability 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Updating...' : availability ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-semibold mb-2">Profile Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {user?.name}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
            <p><span className="font-medium">Phone:</span> {user?.phoneNumber}</p>
            <p><span className="font-medium">Services:</span> {user?.services_offered?.join(', ') || 'None'}</p>
          </div>
        </div>
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
              <Wrench className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Averra Service Provider Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Service Provider</p>
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
            { id: 'overview', label: 'Overview', icon: Wrench },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'services', label: 'Services', icon: Package },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
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
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}

export default ServiceProviderDashboard;
