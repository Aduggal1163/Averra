import React, { useState } from 'react';
import ResidentBookings from './BookingDashboard';
import SOSAlertDashboard from './SOSAlertsDashboard'
import PollDashboard from './PollDashboard'
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const tabs = [
    { key: 'bookings', label: 'Service Bookings' },
    { key: 'sos', label: 'SOS Alerts' },
    { key: 'polls', label: 'Community Polls' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <ResidentBookings />;
      case 'sos':
        return <SOSAlertDashboard />;
      case 'polls':
        return <PollDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ml-100 flex flex-col w-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">Resident Dashboard</h1>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b shadow-sm px-6">
        <ul className="flex space-x-4 py-3">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Footer (Optional) */}
      <footer className="text-center text-sm text-gray-400 py-4 border-t">
        &copy; {new Date().getFullYear()} MyHoodHub. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
