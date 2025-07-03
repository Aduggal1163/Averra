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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', px: { xs: 2, md: 5 }, py: 4 }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Grid item>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Service Provider Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            sx={{ fontWeight: 600 }}
            onClick={handleLogoutFunction}
          >
            Logout
          </Button>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <MonetizationOn color="primary" fontSize="large" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Earnings
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${earnings.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
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

      <Divider sx={{ my: 4 }} />

      {/* Bookings Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
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
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {filteredBookings.length === 0 ? (
          <Typography align="center" py={5} color="text.secondary">
            No bookings found in this category.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f0f4f8' }}>
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
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<Close />}
                            onClick={() => updateStatus(booking._id, 'rejected')}
                          >
                            Reject
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
  );
};

export default ServiceProviderBookings;
