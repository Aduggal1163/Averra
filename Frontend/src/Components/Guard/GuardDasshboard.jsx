import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SOSAlertDashboard from '../Admin/SOS/SOSAlertDashboard.jsx';
import GuardTasks from "./GuardTaskDashboard.jsx";
import { BACKEND_URL } from "../../../config.js";
import axios from "axios";
import {
  LogOut,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  ClipboardList,
  ListChecks,
  AlertTriangle,
  ClipboardX,
  Users,
} from 'lucide-react';
import { createTheme } from "@mui/material/styles";

// Inject Google Font: Poppins
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// MUI Theme (not directly used here but included for completeness)
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    background: { default: "#f8f9fb" },
  },
  typography: { fontFamily: "Poppins, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: "none", fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

const GuardDashboard = () => {
  const navigate = useNavigate();
  const [pendingGatepasses, setPendingGatepasses] = useState([]);
  const [approvedRejectedGatepasses, setApprovedRejectedGatepasses] = useState([]);
  const [visitorLog, setVisitorLog] = useState([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("approved");
  const [selectedGatepass, setSelectedGatepass] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [currentTab, setCurrentTab] = useState(0);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const fetchPendingGatepasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/gatepass/allpendinggatepasses`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setPendingGatepasses(res.data.pendinggatepass || []);
    } catch (error) {
      showSnackbar("Failed to fetch pending gatepasses", "error");
    }
  };

  const fetchApprovedRejectedGatepasses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/gatepass/viewAllVisitorGatepass`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const gatepasses = Array.isArray(res.data.data)
        ? res.data.data.filter(gp => gp.status !== "pending")
        : [];
      setApprovedRejectedGatepasses(gatepasses);
    } catch (error) {
      showSnackbar("Failed to fetch approved/rejected gatepasses", "error");
    }
  };

  const fetchVisitorLog = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/gatepass/visitorlog`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const allLogs = res.data.visitorLog || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const todaysLogs = allLogs.filter(log => {
        const logDate = new Date(log.visitTime);
        return logDate >= today && logDate < tomorrow;
      });
      setVisitorLog(todaysLogs);
    } catch (error) {
      showSnackbar("Failed to fetch visitor log", "error");
    }
  };

  const handleApproveReject = async (id) => {
    try {
      await axios.post(`${BACKEND_URL}/gatepass/updateGatepassStatus/${id}`, {
        status,
        guardComments: comment,
      }, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      showSnackbar(`Gatepass updated to ${status}`, "success");
      fetchPendingGatepasses();
      fetchApprovedRejectedGatepasses();
      setSelectedGatepass(null);
      setComment("");
    } catch (error) {
      showSnackbar("Failed to update gatepass", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchPendingGatepasses();
    fetchApprovedRejectedGatepasses();
    fetchVisitorLog();
  }, []);

  const tabs = [
    { label: 'Pending', index: 0, icon: <ClipboardList className="inline h-4 w-4 mr-1" /> },
    { label: 'Approved/Rejected', index: 1, icon: <ListChecks className="inline h-4 w-4 mr-1" /> },
    { label: 'Visitor Log', index: 2, icon: <Users className="inline h-4 w-4 mr-1" /> },
    { label: 'SOS Logs', index: 3, icon: <AlertTriangle className="inline h-4 w-4 mr-1" /> },
    { label: 'My Tasks', index: 4, icon: <ClipboardX className="inline h-4 w-4 mr-1" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50">
      <div className="px-4 py-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 p-3">
          <h1 className="text-3xl font-semibold text-gray-900 flex items-center">
            <User className="h-8 w-8 text-blue-600 mr-2" />
            Guard Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-3">
          <div className="flex space-x-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.index}
                onClick={() => setCurrentTab(tab.index)}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1
                  ${currentTab === tab.index
                    ? 'text-blue-700 border-b-4 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {currentTab === 0 && (
          <div className="animate-fadeIn mt-10">
            <h2 className="text-xl font-medium mb-2 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
              Pending Gatepasses
            </h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingGatepasses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                        <Eye className="mx-auto mb-2 h-7 w-7 text-blue-300" />
                        <span className="block text-base">No pending gatepasses</span>
                      </td>
                    </tr>
                  ) : (
                    pendingGatepasses.map(g => (
                      <tr key={g._id} className="hover:bg-blue-50 transition-all duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitPurpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(g.visitTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.name || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.houseNumber || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => setSelectedGatepass(g)}
                            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors shadow"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-2 flex items-center">
              <ListChecks className="h-5 w-5 mr-2 text-green-600" />
              Approved/Rejected Gatepasses
            </h2>

            {/* Sub-tabs for Approved & Rejected */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1
                  ${status === 'approved' ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setStatus('approved')}
              >
                <CheckCircle className="h-4 w-4" />
                Approved
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1
                  ${status === 'rejected' ? 'bg-red-600 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setStatus('rejected')}
              >
                <XCircle className="h-4 w-4" />
                Rejected
              </button>
            </div>

            {/* Filtered table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-100 via-gray-50 to-red-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedRejectedGatepasses.filter(g => g.status === status).length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                        {status === "approved" ? (
                          <CheckCircle className="mx-auto mb-2 h-7 w-7 text-green-300" />
                        ) : (
                          <XCircle className="mx-auto mb-2 h-7 w-7 text-red-300" />
                        )}
                        <span className="block text-base">No {status} gatepasses</span>
                      </td>
                    </tr>
                  ) : (
                    approvedRejectedGatepasses
                      .filter(g => g.status === status)
                      .map(g => (
                        <tr key={g._id} className="hover:bg-green-50 transition-all duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitorName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitPurpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(g.visitTime).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.name || "Unknown"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.houseNumber || "Unknown"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1
                              ${g.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {g.status === 'approved'
                                ? <CheckCircle className="h-3 w-3" />
                                : <XCircle className="h-3 w-3" />}
                              {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.guardComments || "—"}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-2 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Today's Visitor Log
            </h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-100 via-blue-50 to-green-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Visit Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitorLog.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                        <Users className="mx-auto mb-2 h-7 w-7 text-indigo-300" />
                        <span className="block text-base">No visitor logs for today</span>
                      </td>
                    </tr>
                  ) : (
                    visitorLog.map((log, index) => (
                      <tr key={index} className="hover:bg-indigo-50 transition-all duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.visitorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.visitTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.residentId?.name || log.residentName || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.residentId?.houseNumber || log.houseNumber || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1
                            ${log.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {log.status === 'approved'
                              ? <CheckCircle className="h-3 w-3" />
                              : log.status === 'rejected'
                                ? <XCircle className="h-3 w-3" />
                                : <AlertTriangle className="h-3 w-3" />}
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 3 && (
          <div className="animate-fadeIn">
            <SOSAlertDashboard />
          </div>
        )}

        {currentTab === 4 && (
          <div className="animate-fadeIn">
            <GuardTasks />
          </div>
        )}

        {/* Review Card - Enhanced */}
        {selectedGatepass && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-500 rounded-lg p-1 mb-4 shadow-lg">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Review Gatepass: {selectedGatepass.visitorName}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Visitor Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-500" />
                        Visitor Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Visitor Name</p>
                            <p className="text-gray-900">{selectedGatepass.visitorName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Purpose</p>
                            <p className="text-gray-900">{selectedGatepass.visitPurpose}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Visit Time</p>
                            <p className="text-gray-900">{new Date(selectedGatepass.visitTime).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Resident Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                        <User className="h-5 w-5 mr-2 text-orange-500" />
                        Resident Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Resident Name</p>
                            <p className="text-gray-900">{selectedGatepass.residentId?.name || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">House Number</p>
                            <p className="text-gray-900">{selectedGatepass.residentId?.houseNumber || "Unknown"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Review Form */}
                  <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Review Decision
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Decision Status
                        </label>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setStatus('approved')}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center
                              ${status === 'approved'
                                ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-green-300'
                              }`}
                          >
                            <CheckCircle className="h-5 w-5 mb-1" />
                            <span className="block text-sm font-medium">Approve</span>
                          </button>
                          <button
                            onClick={() => setStatus('rejected')}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center
                              ${status === 'rejected'
                                ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-red-300'
                              }`}
                          >
                            <XCircle className="h-5 w-5 mb-1" />
                            <span className="block text-sm font-medium">Reject</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Guard Comments
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Enter your comments or reason for decision..."
                        />
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedGatepass(null)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel Review
                      </button>
                      <button
                        onClick={() => handleApproveReject(selectedGatepass._id)}
                        className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl
                          ${status === "approved"
                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                          }`}
                      >
                        {status === 'approved' ? 'Approve Gatepass' : 'Reject Gatepass'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {openSnackbar && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`px-4 py-2 rounded-lg shadow-lg text-white flex items-center space-x-2
              ${snackbarSeverity === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
              <span>{snackbarMessage}</span>
              <button
                onClick={() => setOpenSnackbar(false)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GuardDashboard;
