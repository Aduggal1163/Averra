import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/service-booking/allbookings', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const uniqueServiceProviders = bookings.reduce((acc, booking) => {
    if (
      booking.serviceprovider_id &&
      !acc.find((sp) => sp._id === booking.serviceprovider_id._id)
    ) {
      acc.push(booking.serviceprovider_id);
    }
    return acc;
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-black-200 text-black-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="text-2xl text-black-600 animate-pulse">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-6 sm:p-10" style={{ backgroundColor: "#F6F5ED", fontFamily: "Poppins, sans-serif" }}>
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10" style={{ backgroundColor: "#F6F5ED" }} >
        <h1 className="text-4xl font-extrabold text-green-900" >Service Booking Dashboard</h1>
        <i><p className="mt-4 text-green-700 text-lg">Track all service bookings and provider activities.</p></i>
      </header>

      {/* Bookings Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-green-800 mb-6">📋 All Service Bookings</h2>
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-green-500 text-2xl bg-white rounded-xl shadow">
            No bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white border border-purple-200 rounded-xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center">
                  <span className="text-md text-black-400 font-medium">#{index + 1}</span>
                  <span className={`text-md font-bold px-3 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900">
                    {booking.serviceprovider_id?.name || 'Unknown'}
                  </h3>
                  <b><p className="text-lg text-black-500">Service Provider</p></b>
                </div>
                <div>
                  <p className="text-lg font-medium text-blue-900">
                    {booking.resident_id?.name || 'Unknown'}
                  </p>
                  <b><p className="text-lg text-black-500">Resident Name</p></b>
                </div>
                <div>
                  <p className="text-lg text-black-700">{booking.service}</p>
                  <b><p className="text-lg text-black-500">Service Booked</p></b>
                </div>
                <div>
                  <p className="text-lg text-black-700">
                    {new Date(booking.dateTime).toLocaleString()}
                  </p>
                  <b><p className="text-lg text-black-500">Date & Time</p></b>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Providers Section */}
      <section className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-green-800 mb-6">🧰 Service Providers Overview</h3>
        {uniqueServiceProviders.length === 0 ? (
          <div className="p-10 text-center text-green-500 text-2xl bg-white rounded-xl shadow">
            No service providers found from bookings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueServiceProviders.map((provider, index) => (
              <div
                key={provider._id}
                className="bg-white border border-purple-200 rounded-xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-md text-black-400 font-medium">#{index + 1}</span>
                </div>
                <h4 className="text-xl font-semibold text-green-900">{provider.name}</h4>
                <p className="text-lg text-black-700 mt-2">
                  {provider.services_offered?.join(', ') || 'No services listed'}
                </p>
                <b>
                  <p className="text-lg text-black-500 mt-1">Services Offered</p>
                </b>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AllBookings;
