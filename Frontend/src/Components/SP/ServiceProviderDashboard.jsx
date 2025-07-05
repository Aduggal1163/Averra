import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, CircularProgress,
  Snackbar, Alert, Chip, Stack, Tabs, Tab, Grid, Card, CardContent,
  AppBar, Toolbar, Avatar, TextField, InputAdornment, IconButton,
  Badge, Tooltip, LinearProgress, useTheme, alpha
} from '@mui/material';
import {
  Done, Close, Handyman, SentimentDissatisfied, Search,
  TrendingUp, People, Schedule, CheckCircle, Cancel,
  PendingActions, FilterList, CalendarToday, Star,
  Refresh, ExitToApp
} from '@mui/icons-material';
import { BACKEND_URL } from '../../../config';
const BASE_URL = `${BACKEND_URL}/service-booking`;

const ServiceProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [tabValue, setTabValue] = useState(0);
  const [bookingTab, setBookingTab] = useState(0);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

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
      console.error('Failed to fetch provider info');
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
      setSnackbar({ 
        open: true, 
        message: `Booking ${status} successfully!`, 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to update booking status.', 
        severity: 'error' 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    await fetchProviderInfo();
    setRefreshing(false);
    setSnackbar({ 
      open: true, 
      message: 'Dashboard refreshed successfully!', 
      severity: 'success' 
    });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleMainTabChange = (event, newValue) => setTabValue(newValue);
  const handleBookingTabChange = (event, newValue) => setBookingTab(newValue);

  const handleLogoutFunction = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Enhanced filtering with search
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.resident_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.resident_id?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      (bookingTab === 0 && booking.status === 'pending') ||
      (bookingTab === 1 && booking.status === 'accepted') ||
      (bookingTab === 2 && booking.status === 'rejected');
    
    return matchesSearch && matchesStatus;
  });

  // Enhanced statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    uniqueResidents: new Set(bookings.map(b => b.resident_id?.name)).size,
    thisMonth: bookings.filter(b => {
      const bookingDate = new Date(b.dateTime);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Enhanced resident usage with more details
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
      email: booking.resident_id?.email || 'N/A'
    });
  });

  if (loading) return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{ backgroundColor: "#f8f9fa" }}
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Loading Dashboard...
      </Typography>
    </Box>
  );

  if (error) return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{ backgroundColor: "#f8f9fa" }}
    >
      <Typography color="error" variant="h6">{error}</Typography>
      <Button 
        variant="contained" 
        onClick={() => window.location.reload()} 
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: "#f8f9fa" }}>
      {/* Enhanced Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Handyman sx={{ fontSize: 32, color: 'white' }} />
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color="white"
              sx={{ letterSpacing: 0.5 }}
            >
              Service Provider Dashboard
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh Dashboard">
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ color: 'white' }}
              >
                <Refresh sx={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Tooltip>
            
            <Avatar 
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            
            <Box>
              <Typography variant="subtitle1" color="white" fontWeight="600">
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">
                Service Provider
              </Typography>
            </Box>
            
           <b>
             <Button
              variant="outlined"
              startIcon={<ExitToApp />}
              onClick={handleLogoutFunction}
              style={{fontWeight:800}}
              sx={{ 
                bgcolor: alpha('#fff', 0.2), 
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                ml: 2,
                '&:hover': { 
                  borderColor: 'white', 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              Logout
            </Button>
           </b>
          </Box>
        </Toolbar>
        
        {/* Enhanced Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleMainTabChange}
          centered
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)'
              }
            },
            '& .Mui-selected': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.15)'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
              height: 3,
              borderRadius: '2px 2px 0 0'
            }
          }}
        >
          <Tab label="Dashboard" />
          <Tab label="Manage Bookings" />
        </Tabs>
      </AppBar>

      {/* Dashboard Tab */}
      {tabValue === 0 && (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          {/* Enhanced Stats Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Bookings
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.pending}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Pending Requests
                      </Typography>
                    </Box>
                    <Badge badgeContent={stats.pending} color="error">
                      <PendingActions sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.uniqueResidents}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Unique Residents
                      </Typography>
                    </Box>
                    <People sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  height: '100%'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.thisMonth}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        This Month
                      </Typography>
                    </Box>
                    <CalendarToday sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Services Offered Card */}
          <Card sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Handyman color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">
                  Services Offered
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {servicesOffered.length > 0 ? (
                  servicesOffered.map((service, idx) => (
                    <Chip
                      key={idx}
                      label={service}
                      color="primary"
                      variant="outlined"
                      icon={<Star />}
                      sx={{ 
                        fontWeight: 500,
                        '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No services added yet.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Enhanced Resident Usage */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Recent Service History
              </Typography>
              {Object.keys(residentUsage).length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SentimentDissatisfied sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No service history available yet.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.08) }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                          Resident Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                          Service
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                          Date & Time
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(residentUsage)
                        .flatMap(([residentName, usageArr]) =>
                          usageArr.map((usage, idx) => ({
                            ...usage,
                            residentName,
                            key: residentName + idx
                          }))
                        )
                        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                        .slice(0, 10)
                        .map((usage) => (
                          <TableRow key={usage.key} hover>
                            <TableCell>{usage.residentName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={usage.service} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(usage.dateTime).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={usage.status}
                                size="small"
                                color={
                                  usage.status === 'accepted' ? 'success' :
                                  usage.status === 'rejected' ? 'error' : 'warning'
                                }
                                icon={
                                  usage.status === 'accepted' ? <CheckCircle /> :
                                  usage.status === 'rejected' ? <Cancel /> : <Schedule />
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Enhanced Manage Bookings Tab */}
      {tabValue === 1 && (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Manage Bookings
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
              </Box>
              
              <Tabs
                value={bookingTab}
                onChange={handleBookingTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                sx={{ 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }
                }}
              >
                <Tab 
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge badgeContent={stats.pending} color="error">
                        <PendingActions />
                      </Badge>
                      Pending
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge badgeContent={stats.accepted} color="success">
                        <CheckCircle />
                      </Badge>
                      Accepted
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge badgeContent={stats.rejected} color="error">
                        <Cancel />
                      </Badge>
                      Rejected
                    </Box>
                  } 
                />
              </Tabs>

              {/* Enhanced Bookings Table */}
              {filteredBookings.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={6}>
                  <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    No bookings found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'Try adjusting your search terms' : 'No bookings in this category yet'}
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.08) }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Resident</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking._id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                {booking.resident_id?.name || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {booking.resident_id?.email || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={booking.service} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(booking.dateTime).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              size="small"
                              color={
                                booking.status === 'accepted' ? 'success' :
                                booking.status === 'rejected' ? 'error' : 'warning'
                              }
                              icon={
                                booking.status === 'accepted' ? <CheckCircle /> :
                                booking.status === 'rejected' ? <Cancel /> : <Schedule />
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
                                  disabled={actionLoading === booking._id}
                                  sx={{ minWidth: 90 }}
                                >
                                  {actionLoading === booking._id ? 
                                    <CircularProgress size={16} color="inherit" /> : "Accept"
                                  }
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  startIcon={<Close />}
                                  onClick={() => updateStatus(booking._id, 'rejected')}
                                  disabled={actionLoading === booking._id}
                                  sx={{ minWidth: 90 }}
                                >
                                  {actionLoading === booking._id ? 
                                    <CircularProgress size={16} color="inherit" /> : "Reject"
                                  }
                                </Button>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Action completed
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceProviderBookings;