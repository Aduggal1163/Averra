import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserManagement from './users/UserManagement.jsx';
import Booking from './booking/Booking.jsx'
import BroadcastDashboard from './Broadcast/BroadcastDashboard.jsx';
import ComplaintDashboard from './Complaint/ComplaintDashboard.jsx';
import GuardDashboard from './Guard/GuardDashboard.jsx';
import SOSAlertDashboard from './SOS/SOSAlertDashboard.jsx';
import PollDashboard from './Polls/PollDashboard.jsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Content to display in the modal
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Helper function to render a section title
  const SectionTitle = ({ title }) => (
    <div className="flex items-center space-x-3 mb-8">
      <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
      <h2 className="text-3xl font-bold text-gray-800">
        {title}
      </h2>
    </div>
  );

  // Modal Component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100 relative border border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }

  const sectionIcons = {
    users: '👥',
    service_providers: '🔧',
    broadcasts: '📢',
    complaints: '📋',
    tasks: '⚡',
    polls: '📊',
    sos_alerts: '🚨'
  };

  const sectionLabels = {
    users: 'Users',
    service_providers: 'Service Providers',
    broadcasts: 'Broadcasts',
    complaints: 'Complaints',
    tasks: 'Tasks',
    polls: 'Polls',
    sos_alerts: 'SOS Alerts'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter text-gray-900">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          .sidebar-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .slide-in {
            animation: slideIn 0.3s ease-out forwards;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

      {/* Header */}
      <header className="glass-effect border-b border-white/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <button
              onClick={() => handleLogout()}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row container mx-auto px-6 py-8 gap-8">
        {/* Sidebar Navigation */}
        <nav className={`${sidebarCollapsed && window.innerWidth >= 1024 ? 'w-20' : 'w-full lg:w-72'} transition-all duration-300 ease-in-out`}>
          <div className="sidebar-gradient rounded-2xl shadow-2xl p-6 sticky top-24">
            <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 space-y-0 lg:space-y-2">
              {['users', 'service_providers', 'broadcasts', 'complaints', 'tasks', 'polls', 'sos_alerts'].map((section, index) => (
                <li key={section} className="flex-shrink-0">
                  <button
                    onClick={() => setActiveSection(section)}
                    className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl font-medium transition-all duration-200 group slide-in text-left whitespace-nowrap
                      ${activeSection === section
                        ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                        : 'text-white/90 hover:bg-white/20 hover:text-white'
                      } mb-2 lg:mx-0 mx-2`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-2xl">{sectionIcons[section]}</span>
                    {(!sidebarCollapsed || window.innerWidth < 1024) && (
                      <span className="text-lg font-semibold">
                        {sectionLabels[section]}
                      </span>
                    )}
                    {activeSection === section && (!sidebarCollapsed || window.innerWidth < 1024) && (
                      <div className="ml-auto w-2 h-2 bg-purple-700 rounded-full"></div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1">
          <div >
            {/* Users Section */}
            {
              activeSection === 'users' && (
                <div className="space-y-6">
                  <SectionTitle title="User Management" />
                  <div className="">
                    <UserManagement />
                  </div>
                </div>
              )
            }

            {/* Service Providers Section */}
            {activeSection === 'service_providers' && (
              <div className="space-y-6">
                <SectionTitle title="Service Providers" />
                <div className="">
                  <Booking />
                </div>
              </div>
            )}

            {/* Broadcasts Section */}
            {activeSection === 'broadcasts' && (
              <section>
                <SectionTitle title="Broadcast Management" />
                <div className="">
                  <BroadcastDashboard />
                </div>
              </section>
            )}

            {/* Complaints Section */}
            {activeSection === 'complaints' && (
              <section>
                <SectionTitle title="Complaints Management" />
                <div className="">
                  <ComplaintDashboard />
                </div>
              </section>
            )}

            {/* Tasks Section for Guards */}
            {activeSection === 'tasks' && (
              <section>
                <SectionTitle title="Guard Tasks" />
                <div className="">
                  <GuardDashboard />
                </div>

              </section>
            )}

            {/* Polls Section */}
            {activeSection === 'polls' && (
              <section>
                <SectionTitle title="Polls Management" />
                <div className="">
                  <PollDashboard />
                </div>
              </section>
            )}

            {/* SOS Alerts Section */}
            {activeSection === 'sos_alerts' && (
              <section>
                <SectionTitle title="SOS Alerts" />
                <div className="">
                  <SOSAlertDashboard />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Reusable Modal Component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default AdminDashboard;