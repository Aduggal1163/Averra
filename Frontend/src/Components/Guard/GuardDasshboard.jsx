import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SOSAlertDashboard from '../Admin/SOS/SOSAlertDashboard.jsx';
import { LogOut, Eye, MessageSquare } from 'lucide-react';
import GuardTasks from "./GuardTaskDashboard.jsx";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

// Inject Google Font: Poppins
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f8f9fb",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
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
      const res = await axios.get("http://localhost:8080/api/v1/gatepass/allpendinggatepasses", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setPendingGatepasses(res.data.pendinggatepass || []);
    } catch (error) {
      showSnackbar("Failed to fetch pending gatepasses", "error");
    }
  };

  const fetchApprovedRejectedGatepasses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/gatepass/viewAllVisitorGatepass", {
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
      const res = await axios.get("http://localhost:8080/api/v1/gatepass/visitorlog", {
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
      await axios.post(`http://localhost:8080/api/v1/gatepass/updateGatepassStatus/${id}`, {
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
    { label: 'Pending', index: 0 },
    { label: 'Approved/Rejected', index: 1 },
    { label: 'Visitor Log', index: 2 },
    { label: 'SOS Logs', index: 3 },
    { label: 'My Tasks', index: 4 }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-semibold text-gray-900">Guard Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currentTab === tab.index
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {currentTab === 0 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-medium mb-2">Pending Gatepasses</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingGatepasses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No pending gatepasses
                      </td>
                    </tr>
                  ) : (
                    pendingGatepasses.map(g => (
                      <tr key={g._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitPurpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(g.visitTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.name || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.houseNumber || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => setSelectedGatepass(g)}
                            className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
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
            <h2 className="text-xl font-medium mb-2">Approved/Rejected Gatepasses</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedRejectedGatepasses.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No approved/rejected gatepasses
                      </td>
                    </tr>
                  ) : (
                    approvedRejectedGatepasses.map(g => (
                      <tr key={g._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.visitPurpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(g.visitTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.name || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.residentId?.houseNumber || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            g.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {g.status}
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
            <h2 className="text-xl font-medium mb-2">Today's Visitor Log</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitorLog.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No visitor logs for today
                      </td>
                    </tr>
                  ) : (
                    visitorLog.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.visitorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.visitTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.residentId?.name || log.residentName || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.residentId?.houseNumber || log.houseNumber || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            log.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.status}
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

        {/* Review Card - Beautiful Alternative to Modal */}
        {selectedGatepass && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-1 mb-4">
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
                      <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                        Visitor Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Visitor Name</p>
                            <p className="text-gray-900">{selectedGatepass.visitorName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Purpose</p>
                            <p className="text-gray-900">{selectedGatepass.visitPurpose}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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
                      <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                        Resident Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Resident Name</p>
                            <p className="text-gray-900">{selectedGatepass.residentId?.name || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                              status === 'approved'
                                ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-green-300'
                            }`}
                          >
                            <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                            <span className="block text-sm font-medium">Approve</span>
                          </button>
                          <button
                            onClick={() => setStatus('rejected')}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                              status === 'rejected'
                                ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-red-300'
                            }`}
                          >
                            <XCircle className="h-5 w-5 mx-auto mb-1" />
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
                        className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                          status === "approved" 
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
            <div className={`px-4 py-2 rounded-lg shadow-lg text-white flex items-center space-x-2 ${
              snackbarSeverity === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
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
