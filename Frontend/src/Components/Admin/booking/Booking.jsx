import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Briefcase, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react'

import axios from 'axios';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('pending');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="text-2xl text-black-600 animate-pulse">Loading bookings...</div>
      </div>
    );
  }

 const categorizedBookings = {
    pending: bookings.filter((b) => b.status === 'pending'),
    accepted: bookings.filter((b) => b.status === 'accepted'),
    rejected: bookings.filter((b) => b.status === 'rejected'),
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                <p className="text-purple-100 text-sm font-medium">Active Providers</p>
                <p className="text-3xl font-bold">{uniqueServiceProviders.length}</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white">
                <p className="text-indigo-100 text-sm font-medium">Completed Today</p>
                <p className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {['pending', 'accepted', 'rejected', 'providers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <section className="max-w-7xl mx-auto mb-16">
          {activeTab !== 'providers' ? (
            <>
              {categorizedBookings[activeTab].length === 0 ? (
                <div className="text-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
                  <h3 className="text-2xl font-semibold mb-2">No {activeTab} bookings</h3>
                  <p>No bookings found under "{activeTab}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categorizedBookings[activeTab].map((booking, index) => (
                    <div
                      key={booking._id}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <User className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-semibold text-gray-800">{booking.serviceprovider_id?.name}</p>
                            <p className="text-sm text-gray-500">Provider</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <User className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-semibold text-gray-800">{booking.resident_id?.name}</p>
                            <p className="text-sm text-gray-500">Client</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Briefcase className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="font-semibold text-gray-800">{booking.service}</p>
                            <p className="text-sm text-gray-500">Service Type</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {new Date(booking.dateTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">Scheduled Time</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Providers Tab
            <>
              {uniqueServiceProviders.length === 0 ? (
                <div className="text-center text-gray-600 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
                  <h3 className="text-2xl font-semibold mb-2">No providers found</h3>
                  <p>Service providers will appear here once available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniqueServiceProviders.map((provider) => (
                    <div
                      key={provider._id}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{provider.name}</h3>
                          <p className="text-sm text-gray-500">Service Professional</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-800 font-medium">
                              {provider.services_offered?.join(', ') || 'No services listed'}
                            </p>
                            <p className="text-sm text-gray-500">Available Services</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {provider.services_offered?.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 text-xs font-medium rounded-full border border-green-200"
                          >
                            {service}
                          </span>
                        ))}
                        {provider.services_offered?.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{provider.services_offered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default AllBookings;
