import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/service-booking',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = token;
  return config;
});

const BookingCard = ({ booking, isHistory }) => (
  <div className={`bg-white rounded-xl shadow-md p-5 border ${isHistory ? 'opacity-80' : ''}`}>
    <div className="flex justify-between items-center mb-2">
      <div className="text-lg font-medium capitalize">{booking.service}</div>
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <Calendar size={16} />
        {new Date(booking.dateTime).toLocaleDateString()}
      </div>
    </div>
    <div className="flex items-center text-sm text-gray-700 gap-2 mb-2">
      <User size={16} />
      <span>Provider: {booking.serviceprovider_id?.name || 'N/A'}</span>
    </div>
    <div className="flex items-center text-sm text-gray-700 gap-2 mb-2">
      <Clock size={16} />
      <span>
        {new Date(booking.dateTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
    <div className="flex items-center text-sm font-semibold gap-2">
      {booking.status === 'pending' && <AlertCircle className="text-yellow-500" size={18} />}
      {booking.status === 'accepted' && <CheckCircle className="text-green-600" size={18} />}
      {booking.status === 'rejected' && <XCircle className="text-red-500" size={18} />}
      <span
        className={`capitalize ${
          booking.status === 'rejected'
            ? 'text-red-600'
            : booking.status === 'accepted'
            ? 'text-green-600'
            : 'text-yellow-500'
        }`}
      >
        {booking.status}
      </span>
    </div>
  </div>
);

const ResidentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [view, setView] = useState('upcoming'); // 👈 NEW: toggle view
  const [form, setForm] = useState({
    serviceprovider_id: '',
    service: '',
    dateTime: '',
  });
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/resident-booking');
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await api.get('/all-providers');
      setProviders(res.data.providers || []);
    } catch (error) {
      console.error('Error fetching providers:', error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProviders();
  }, []);

  const handleProviderChange = (e) => {
    const selectedId = e.target.value;
    const selectedProvider = providers.find((p) => p._id === selectedId);
    setForm({ ...form, serviceprovider_id: selectedId, service: '' });
    setServices(selectedProvider?.services_offered || []);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/book-service', form);
      setMessage(res.data.message);
      setForm({ serviceprovider_id: '', service: '', dateTime: '' });
      setServices([]);
      fetchBookings();
    } catch (error) {
      console.error('Booking Error:', error);
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.dateTime) >= now);
  const pastBookings = bookings.filter((b) => new Date(b.dateTime) < now);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* ✅ Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Book a Service Provider</h2>
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Provider</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={form.serviceprovider_id}
              onChange={handleProviderChange}
              required
            >
              <option value="">-- Select Provider --</option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Select Service</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              required
              disabled={!services.length}
            >
              <option value="">-- Select Service --</option>
              {services.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Select Date & Time</label>
            <input
              type="datetime-local"
              className="w-full mt-1 p-2 border rounded"
              value={form.dateTime}
              onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Book Now
          </button>

          {message && <div className="text-center text-green-600 mt-2 font-medium">{message}</div>}
        </form>
      </div>

      {/* ✅ Toggle Tabs */}
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            view === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('upcoming')}
        >
          Upcoming Bookings
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            view === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setView('history')}
        >
          Booking History
        </button>
      </div>

      {/* ✅ Conditionally Show Bookings */}
      <div>
        <h2 className="text-xl font-semibold text-center mb-4">
          {view === 'upcoming' ? 'Upcoming Bookings' : 'Booking History'}
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : view === 'upcoming' ? (
          upcomingBookings.length === 0 ? (
            <div className="text-center text-gray-500">No upcoming bookings.</div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )
        ) : pastBookings.length === 0 ? (
          <div className="text-center text-gray-400">No past bookings.</div>
        ) : (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} isHistory />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentBookings;
