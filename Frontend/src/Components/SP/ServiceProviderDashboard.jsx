import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, CircularProgress,
  Snackbar, Alert, Chip, Stack, Tabs, Tab, Grid, Card, CardContent, Divider,
  ButtonBase
} from '@mui/material';
import { Done, Close, MonetizationOn, Handyman } from '@mui/icons-material';

const ServiceProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tabValue, setTabValue] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [servicesOffered, setServicesOffered] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:8080/api/v1/service-booking';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBookings();
    // Fetch provider info (earnings, services)
    fetchProviderInfo();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/provider-booking`, {
        headers: { Authorization: token },
      });
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings. Please try again.');
      setLoading(false);
      setSnackbar({ open: true, message: 'Failed to fetch bookings.', severity: 'error' });
    }
  };

  const fetchProviderInfo = async () => {
    try {
      // Replace with your actual endpoint for provider info
      const res = await axios.get(`${BASE_URL}/provider-info`, {
        headers: { Authorization: token },
      });
      setEarnings(res.data.earnings || 0);
      setServicesOffered(res.data.services_offered || []);
    } catch (err) {
      console.error("Could not fetch provider info:", err);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.post(
        `${BASE_URL}/status/${bookingId}`,
        { status },
        { headers: { Authorization: token } }
      );
      fetchBookings();
      setSnackbar({ open: true, message: `Booking ${status} successfully!`, severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update booking status.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter bookings by status
  const filteredBookings = bookings.filter(booking => {
    if (tabValue === 0) return booking.status === 'pending';
    if (tabValue === 1) return booking.status === 'accepted';
    if (tabValue === 2) return booking.status === 'rejected';
    return true;
  });

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Typography color="error">{error}</Typography>
    </Box>
  );
  const handleLogoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Service Provider Dashboard
        <span
          className="p-3 text-lg rounded-full hover:bg-red-400 bg-white outline outline-2 outline-red-500"
          style={{ marginLeft: "63%" }}
        >
          <button onClick={() => handleLogoutFunction()}>Logout</button>
        </span>
      </Typography>

      {/* Header: Earnings & Services */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <MonetizationOn color="primary" fontSize="large" />
                <Typography variant="h5">Earnings: ${earnings.toFixed(2)}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Handyman color="primary" fontSize="large" />
                <Typography variant="h5">Services Offered</Typography>
              </Stack>
              <Box mt={1}>
                {servicesOffered.map((service, idx) => (
                  <Chip key={idx} label={service} sx={{ mr: 1, mt: 1 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Tabs for Pending/Accepted/Rejected */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bookings
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
        </Tabs>
      </Paper>

      {/* Bookings Table */}
      <Paper elevation={3} sx={{ p: 2 }}>
        {filteredBookings.length === 0 ? (
          <Typography>No bookings found</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Resident Name</TableCell>
                  <TableCell>Resident Email</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.resident_id?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.resident_id?.email || 'N/A'}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{new Date(booking.dateTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={
                          booking.status === 'accepted' ? 'success' :
                            booking.status === 'rejected' ? 'error' : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {booking.status === 'pending' && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Done />}
                            onClick={() => updateStatus(booking._id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Close />}
                            onClick={() => updateStatus(booking._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Stack>
                      )}
                      {booking.status !== 'pending' && <em>No actions available</em>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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
  );
};

export default ServiceProviderBookings;
