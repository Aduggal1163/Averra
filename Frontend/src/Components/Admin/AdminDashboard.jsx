import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserManagement from './users/UserManagement.jsx';
import Booking from './booking/Booking.jsx'
import BroadcastDashboard from './Broadcast/BroadcastDashboard.jsx';
import ComplaintDashboard from './Complaint/ComplaintDashboard.jsx';
import GuardDashboard from './Guard/GuardDashboard.jsx';
import SOSAlertDashboard from './SOS/SOSAlertDashboard.jsx';
import PollDashboard from './Polls/PollDashboard.jsx';
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Content to display in the modal
     
  // Helper function to render a section title
  const SectionTitle = ({ title }) => (
    <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-300 pb-2">
      {title}
    </h2>
  );

  // Modal Component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-900">
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Tailwind CSS config for Inter font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <header className="bg-blue-700 text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-center">Admin Dashboard</h1>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row container mx-auto px-6 py-8 gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full lg:w-64 bg-white rounded-xl shadow-lg p-6 lg:p-0">
          <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {['users', 'service_providers', 'broadcasts', 'complaints', 'tasks', 'polls', 'sos_alerts'].map((section) => (
              <li key={section} className="flex-shrink-0">
                <button
                  onClick={() => setActiveSection(section)}
                  className={`block px-4 py-3 text-lg font-medium rounded-lg text-left w-full whitespace-nowrap
                    ${activeSection === section
                      ? 'bg-blue-100 text-blue-700 shadow-inner'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    } transition duration-200 mb-2 lg:mx-0 mx-2`}
                >
                  {section.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-xl shadow-lg p-8">
          {/* Users Section */}
          {
            activeSection === 'users' && (
              <UserManagement/>
            )
          }

          {/* Service Providers Section */}
          {activeSection === 'service_providers' && (
              <Booking/>
          )}

          {/* Broadcasts Section */}
          {activeSection === 'broadcasts' && (
            <section>
              <SectionTitle title="Broadcast Management" />
              <BroadcastDashboard/>
            </section>
          )}

          {/* Complaints Section */}
          {activeSection === 'complaints' && (
            <section>
                <ComplaintDashboard/>
            </section>
          )}

          {/* Tasks Section for Guards */}
          {activeSection === 'tasks' && (
            <section>
              <GuardDashboard/>
            </section>
          )}

          {/* Polls Section */}
          {activeSection === 'polls' && (
            <section>
              <PollDashboard/>
            </section>
          )}

          {/* SOS Alerts Section */}
          {activeSection === 'sos_alerts' && (
            <section>
              <SOSAlertDashboard/>
            </section>
          )}
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
