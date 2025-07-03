// Full updated ResidentBookings.jsx
import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/service-booking',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

const BookingCard = ({ booking, isHistory }) => {
  const date = new Date(booking.dateTime).toLocaleDateString();
  const time = new Date(booking.dateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'pending':
        return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      case 'rejected':
        return 'text-red-500 border-red-200 bg-red-50';
      default:
        return 'text-gray-500 border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={14} />;
      case 'pending':
        return <AlertCircle size={14} />;
      case 'rejected':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg transition-all border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {booking.serviceprovider_id?.name || 'N/A'}
              </h3>
              <p className="text-gray-600 text-sm">{booking.service}</p>
            </div>
          </div>

          {isHistory && (
            <span
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{time}</span>
          </div>
          {booking.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{booking.location}</span>
            </div>
          )}
          {booking.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{booking.phone}</span>
            </div>
          )}
        </div>

        {isHistory && booking.rating && (
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < booking.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({booking.rating}/5)</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ResidentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('upcoming');
  const [bookingStatusTab, setBookingStatusTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/resident-booking');
        setBookings(res.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.dateTime) >= now);
  const pastBookings = bookings.filter((b) => new Date(b.dateTime) < now);

  const statusFilteredBookings =
    view === 'history'
      ? pastBookings.filter((b) => bookingStatusTab === 'all' || b.status === bookingStatusTab)
      : upcomingBookings;

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto p-6 space-y-8">
        {/* Toggle Upcoming/History */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow p-2 border border-gray-100 flex gap-2">
            {['upcoming', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  view === tab
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {tab === 'upcoming' ? <Calendar className="w-4 h-4" /> : <History className="w-4 h-4" />}
                  <span>{tab === 'upcoming' ? 'Upcoming Bookings' : 'Booking History'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs - only for history */}
        {view === 'history' && (
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow p-2 border border-gray-100 flex gap-2 mt-4">
              {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setBookingStatusTab(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                    bookingStatusTab === status
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking Cards */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            {view === 'upcoming' ? 'Upcoming Bookings' : 'Booking History'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : statusFilteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found.</p>
              <p className="text-gray-400 text-sm mt-2">Try changing your filters or booking a new service.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {statusFilteredBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} isHistory={view === 'history'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentBookings;
