import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SOSAlertDashboard from '../Admin/SOS/SOSAlertDashboard.jsx';
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
} from "@mui/material";
import GuardTasks from "./GuardTaskDashboard.jsx";

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
      const response = await axios.get(
        "http://localhost:8080/api/v1/gatepass/allpendinggatepasses",
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setPendingGatepasses(response.data.pendinggatepass || []);
    } catch (error) {
      console.error("Failed to fetch pending gatepasses:", error);
      showSnackbar("Failed to fetch pending gatepasses", "error");
    }
  };

  const fetchApprovedRejectedGatepasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/gatepass/viewAllVisitorGatepass",
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const gatepasses = Array.isArray(response.data.data)
        ? response.data.data.filter(gp => gp.status !== "pending")
        : [];
      setApprovedRejectedGatepasses(gatepasses);
    } catch (error) {
      console.error("Failed to fetch approved/rejected gatepasses:", error);
      showSnackbar("Failed to fetch approved/rejected gatepasses", "error");
    }
  };

  const fetchVisitorLog = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/gatepass/visitorlog",
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const allLogs = response.data.visitorLog || [];
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
      console.error("Failed to fetch visitor log:", error);
      showSnackbar("Failed to fetch visitor log", "error");
    }
  };

  const handleApproveReject = async (gatepassId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/gatepass/updateGatepassStatus/${gatepassId}`,
        { status, guardComments: comment },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      showSnackbar(`Gatepass updated to ${status}`, "success");
      fetchPendingGatepasses();
      fetchApprovedRejectedGatepasses();
      setSelectedGatepass(null);
      setComment("");
    } catch (error) {
      console.error("Failed to update gatepass:", error);
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

  return (
    <Box sx={{ m: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Guard Dashboard
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
        <Tab label="Pending Gatepasses" />
        <Tab label="Approved/Rejected Gatepasses" />
        <Tab label="Today's Visitor Log" />
        <Tab label="SOS Logs" />
        <Tab label="My Tasks" />
      </Tabs>

      {/* Tab 0: Pending Gatepasses */}
      {currentTab === 0 && (
        <>
          <Typography variant="h6" gutterBottom>Pending Gatepasses</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor Name</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Visit Time</TableCell>
                  <TableCell>Resident Name</TableCell>
                  <TableCell>House Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingGatepasses.map((gatepass) => (
                  <TableRow key={gatepass._id}>
                    <TableCell>{gatepass.visitorName}</TableCell>
                    <TableCell>{gatepass.visitPurpose}</TableCell>
                    <TableCell>{new Date(gatepass.visitTime).toLocaleString()}</TableCell>
                    <TableCell>{gatepass.residentId?.name || "Unknown"}</TableCell>
                    <TableCell>{gatepass.residentId?.houseNumber || "Unknown"}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => setSelectedGatepass(gatepass)}>
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab 1: Approved/Rejected */}
      {currentTab === 1 && (
        <>
          <Typography variant="h6" gutterBottom>Approved/Rejected Gatepasses</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor Name</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Visit Time</TableCell>
                  <TableCell>Resident Name</TableCell>
                  <TableCell>House Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Guard Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedRejectedGatepasses.map((gatepass) => (
                  <TableRow key={gatepass._id}>
                    <TableCell>{gatepass.visitorName}</TableCell>
                    <TableCell>{gatepass.visitPurpose}</TableCell>
                    <TableCell>{new Date(gatepass.visitTime).toLocaleString()}</TableCell>
                    <TableCell>{gatepass.residentId?.name || "Unknown"}</TableCell>
                    <TableCell>{gatepass.residentId?.houseNumber || "Unknown"}</TableCell>
                    <TableCell>{gatepass.status}</TableCell>
                    <TableCell>{gatepass.guardComments || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab 2: Visitor Log */}
      {currentTab === 2 && (
        <>
          <Typography variant="h6" gutterBottom>Today's Visitor Log</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor Name</TableCell>
                  <TableCell>Visit Time</TableCell>
                  <TableCell>Resident Name</TableCell>
                  <TableCell>House Number</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitorLog.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.visitorName}</TableCell>
                    <TableCell>{new Date(log.visitTime).toLocaleString()}</TableCell>
                    <TableCell>{log.residentId?.name || log.residentName || "Unknown"}</TableCell>
                    <TableCell>{log.residentId?.houseNumber || log.houseNumber || "Unknown"}</TableCell>
                    <TableCell>{log.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab 3: SOS Logs */}
      {currentTab === 3 && <SOSAlertDashboard />}
      {currentTab===4 && <GuardTasks/>}

      {/* Review Card */}
      {selectedGatepass && (
        <Card sx={{ mt: 4, maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6">Review Gatepass: {selectedGatepass.visitorName}</Typography>
            <Typography>Resident: {selectedGatepass.residentId?.name || "Unknown"}</Typography>
            <Typography>House Number: {selectedGatepass.residentId?.houseNumber || "Unknown"}</Typography>
            <Typography>Purpose: {selectedGatepass.visitPurpose}</Typography>
            <Typography>Visit Time: {new Date(selectedGatepass.visitTime).toLocaleString()}</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="approved">Approve</MenuItem>
                <MenuItem value="rejected">Reject</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Guard Comments"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={() => handleApproveReject(selectedGatepass._id)}>
              Submit
            </Button>
            <Button variant="outlined" onClick={() => setSelectedGatepass(null)}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GuardDashboard;
