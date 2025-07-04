import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, CircularProgress,
  Snackbar, Alert, Chip, Stack, Tabs, Tab, Grid, Card, CardContent, Divider,
  AppBar, Toolbar, Avatar
} from '@mui/material';
import { Done, Close, Handyman, SentimentDissatisfied } from '@mui/icons-material';

const BASE_URL = 'http://localhost:8080/api/v1/service-booking';

const ServiceProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tabValue, setTabValue] = useState(0);
  const [servicesOffered, setServicesOffered] = useState([]);
  const navigate = useNavigate();

  // Assuming user info is stored as JSON string in localStorage under "user"
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    fetchProviderInfo();
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/provider-booking`, {
        headers: { Authorization: token },
      });
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      setLoading(false);
      setSnackbar({ open: true, message: 'Failed to fetch bookings.', severity: 'error' });
    }
  }, [token]);

  const fetchProviderInfo = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/provider-info`, {
        headers: { Authorization: token },
      });
      setServicesOffered(res.data.services_offered || []);
    } catch (err) {
      // Optionally handle error
    }
  }, [token]);

  const updateStatus = async (bookingId, status) => {
    try {
      setActionLoading(bookingId);
      await axios.post(
        `${BASE_URL}/status/${bookingId}`,
        { status },
        { headers: { Authorization: token } }
      );
      await fetchBookings();
      setSnackbar({ open: true, message: `Booking ${status} successfully!`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update booking status.', severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleLogoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Filter bookings by status
  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return booking.status === 'pending';
    if (tabValue === 1) return booking.status === 'accepted';
    if (tabValue === 2) return booking.status === 'rejected';
    return true;
  });

  // Resident Usage Summary
  const residentUsage = {};
  bookings.forEach(booking => {
    const residentName = booking.resident_id?.name || 'N/A';
    if (!residentUsage[residentName]) {
      residentUsage[residentName] = [];
    }
    residentUsage[residentName].push({
      service: booking.service,
      dateTime: booking.dateTime,
      status: booking.status,
    });
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={4} style={{ backgroundColor: "#F6F5ED" }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" mt={4} style={{ backgroundColor: "#F6F5ED" }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: "#F6F5ED" }}>

      {/* Beautiful Header with User Info */}
      <AppBar
        position="static"
        elevation={2}
        style={{ backgroundColor: "#F6F5ED", color: "black", marginBottom: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ letterSpacing: 1 }}>
            Service Provider Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "#1976d2", color: "#fff" }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="subtitle1" color="black" sx={{ fontWeight: 500 }}>
              {user?.name || user?.email || "User"}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderColor: "#1976d2",
                color: "#1976d2",
                ml: 2,
                "&:hover": { borderColor: "#115293", background: "#e3eafc" }
              }}
              onClick={handleLogoutFunction}
              aria-label="Logout"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Summary Cards */}
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={6}>
            <Card style={{ backgroundColor: "#F6F5ED" }} sx={{ boxShadow: 4, borderRadius: 3 }}>
              {/* You can add content here if needed */}
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={{ backgroundColor: "#F6F5ED" }} sx={{ boxShadow: 4, borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Handyman color="primary" fontSize="large" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Services Offered
                  </Typography>
                </Stack>
                <Box>
                  {servicesOffered.length > 0 ? (
                    servicesOffered.map((service, idx) => (
                      <Chip
                        key={idx}
                        label={service}
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No services added.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Resident Usage Summary */}
        <Paper elevation={2} style={{ backgroundColor: "#F6F5ED" }} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="black">
            Residents Who Used Your Services
          </Typography>
          {Object.keys(residentUsage).length === 0 ? (
            <Typography color="text.secondary">No residents have used your services yet.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead style={{ backgroundColor: "#F6F5ED" }}>
                  <TableRow>
                    <TableCell><strong>Resident Name</strong></TableCell>
                    <TableCell><strong>Service</strong></TableCell>
                    <TableCell><strong>Date & Time</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(residentUsage).map(([residentName, usageArr]) =>
                    usageArr.map((usage, idx) => (
                      <TableRow key={residentName + idx}>
                        <TableCell>{residentName}</TableCell>
                        <TableCell>{usage.service}</TableCell>
                        <TableCell>
                          {new Date(usage.dateTime).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* Bookings Section */}
        <Paper elevation={3} style={{ backgroundColor: "#F6F5ED" }} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} color="black">
            Manage Bookings
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
          >
            <Tab label="Pending" />
            <Tab label="Accepted" />
            <Tab label="Rejected" />
          </Tabs>
        </Paper>

        {/* Bookings Table */}
        <Paper elevation={3} style={{ backgroundColor: "#F6F5ED" }} sx={{ p: 3, borderRadius: 3 }}>
          {filteredBookings.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={5}>
              <SentimentDissatisfied color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography align="center" color="text.secondary">
                No bookings found in this category.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead style={{ backgroundColor: "#F6F5ED" }}>
                  <TableRow>
                    <TableCell><strong>Resident Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Service</strong></TableCell>
                    <TableCell><strong>Date & Time</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking._id} hover>
                      <TableCell>{booking.resident_id?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.resident_id?.email || 'N/A'}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>
                        {new Date(booking.dateTime).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === 'accepted'
                              ? 'success'
                              : booking.status === 'rejected'
                                ? 'error'
                                : 'warning'
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<Done />}
                              onClick={() => updateStatus(booking._id, 'accepted')}
                              aria-label="Accept booking"
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? <CircularProgress size={18} /> : "Accept"}
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<Close />}
                              onClick={() => updateStatus(booking._id, 'rejected')}
                              aria-label="Reject booking"
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? <CircularProgress size={18} /> : "Reject"}
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No actions available
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ServiceProviderBookings;
