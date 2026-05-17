import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Rating,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip as MuiTooltip,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Cancel from '@mui/icons-material/Cancel';
import CheckCircle from '@mui/icons-material/CheckCircle';
import EventAvailable from '@mui/icons-material/EventAvailable';
import Groups from '@mui/icons-material/Groups';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import Paid from '@mui/icons-material/Paid';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Search from '@mui/icons-material/Search';
import Spa from '@mui/icons-material/Spa';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api, { getErrorMessage } from '../services/api';
import ServiceImage from '../components/ServiceImage';

const money = (value) => `R${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const statusColor = {
  Pending: 'warning',
  Approved: 'success',
  Completed: 'primary',
  Cancelled: 'default',
};

const palette = ['#b55378', '#c49a45', '#6f8f72', '#2f6f8f', '#805a8f'];

function StatCard({ label, value, icon, tone = '#9d4767' }) {
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid #f1dbe4',
        minHeight: 150,
        boxShadow: '0 18px 45px rgba(157,71,103,0.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 22px 54px rgba(157,71,103,0.14)' },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.2, height: '100%' }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: `${tone}18`, color: tone }}>{icon}</Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 950 }}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function AnalyticsPanel({ title, subtitle, children, height = 360 }) {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        height: { xs: 'auto', md: height },
        minHeight: height,
        border: '1px solid #f1dbe4',
        boxShadow: '0 18px 50px rgba(157,71,103,0.08)',
      }}
    >
      <Stack spacing={0.4} sx={{ mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Stack>
      <Box sx={{ height: `calc(${height}px - 96px)`, minHeight: 240 }}>{children}</Box>
    </Paper>
  );
}

function AppointmentTable({ appointments, user, onStatus, onCancel, onReceipt }) {
  const isAdmin = user.role === 'Admin';
  const isCustomer = user.role === 'Customer';

  return (
    <Paper sx={{ overflow: 'auto', border: '1px solid #f1dbe4', boxShadow: '0 18px 45px rgba(157,71,103,0.08)' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 900, bgcolor: '#fff7fa' } }}>
            <TableCell>Service</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Staff</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 800 }}>{appointment.service?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{appointment.service?.category}</Typography>
              </TableCell>
              <TableCell>{appointment.customer ? `${appointment.customer.firstName} ${appointment.customer.lastName}` : '-'}</TableCell>
              <TableCell>{appointment.staff ? `${appointment.staff.firstName} ${appointment.staff.lastName}` : '-'}</TableCell>
              <TableCell>{new Date(appointment.startTime).toLocaleString()}</TableCell>
              <TableCell>{money(appointment.service?.price)}</TableCell>
              <TableCell>
                <Chip size="small" label={appointment.status} color={statusColor[appointment.status] || 'default'} />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {isAdmin && appointment.status === 'Pending' && (
                    <>
                      <MuiTooltip title="Approve booking">
                        <IconButton color="success" onClick={() => onStatus(appointment.id, 'Approved')} aria-label="Approve booking">
                          <CheckCircle />
                        </IconButton>
                      </MuiTooltip>
                      <MuiTooltip title="Reject booking">
                        <IconButton color="error" onClick={() => onStatus(appointment.id, 'Cancelled')} aria-label="Reject booking">
                          <Cancel />
                        </IconButton>
                      </MuiTooltip>
                    </>
                  )}
                  {!isCustomer && appointment.status === 'Approved' && (
                    <Button size="small" onClick={() => onStatus(appointment.id, 'Completed')}>Complete</Button>
                  )}
                  {isCustomer && appointment.status === 'Pending' && (
                    <Button size="small" color="error" onClick={() => onCancel(appointment.id)}>Cancel</Button>
                  )}
                  {['Approved', 'Completed'].includes(appointment.status) && (
                    <Button size="small" startIcon={<ReceiptLong />} onClick={() => onReceipt(appointment.id)}>
                      Receipt
                    </Button>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {!appointments.length && (
            <TableRow>
              <TableCell colSpan={7}>
                <Alert severity="info">No bookings match the current view.</Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default function Dashboard({ user, onBook, onReceipt, focus }) {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', search: '' });
  const [adminUserForm, setAdminUserForm] = useState({ name: '', email: '', phone: '', password: '', role: 'Customer' });
  const [serviceForm, setServiceForm] = useState({ id: '', name: '', price: '', category: 'Hairstyle', imageUrl: '', durationMinutes: 60, description: '' });
  const [reviewForm, setReviewForm] = useState({ appointmentId: '', rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const isAdmin = user?.role === 'Admin';
  const canManage = ['Admin', 'Staff'].includes(user?.role);

  const load = async () => {
    try {
      setError('');
      const params = {};
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const [appointmentRes, statsRes, paymentRes, invoiceRes, serviceRes, reviewRes, userRes, notificationRes] = await Promise.all([
        api.get('/appointments', { params }),
        isAdmin ? api.get('/dashboard/stats') : Promise.resolve({ data: null }),
        api.get('/payments').catch(() => ({ data: [] })),
        api.get('/payments/invoices').catch(() => ({ data: [] })),
        api.get('/services').catch(() => ({ data: [] })),
        api.get('/reviews').catch(() => ({ data: [] })),
        isAdmin ? api.get('/users') : Promise.resolve({ data: [] }),
        api.get('/notifications').catch(() => ({ data: [] })),
      ]);
      setAppointments(appointmentRes.data);
      setStats(statsRes.data);
      setPayments(paymentRes.data);
      setInvoices(invoiceRes.data);
      setServices(serviceRes.data);
      setReviews(reviewRes.data);
      setUsers(userRes.data);
      setNotifications(notificationRes.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    load();
  }, [user?.id, filters.from, filters.to]);

  const upcoming = useMemo(
    () => appointments.filter((item) => ['Pending', 'Approved'].includes(item.status)),
    [appointments]
  );
  const history = useMemo(
    () => appointments.filter((item) => ['Completed', 'Cancelled'].includes(item.status)),
    [appointments]
  );
  const filteredAppointments = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const base = focus === 'history' ? history : focus === 'bookings' ? appointments : upcoming;
    if (!term) return base;
    return base.filter((appointment) =>
      [
        appointment.service?.name,
        appointment.customer?.firstName,
        appointment.customer?.lastName,
        appointment.staff?.firstName,
        appointment.staff?.lastName,
        appointment.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [appointments, filters.search, focus, history, upcoming]);

  const searchedUsers = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    if (!term) return users.slice(0, 8);
    return users.filter((item) => `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase().includes(term)).slice(0, 8);
  }, [filters.search, users]);

  const staffSchedules = useMemo(() => {
    const map = new Map();
    appointments.forEach((appointment) => {
      const staffName = appointment.staff ? `${appointment.staff.firstName} ${appointment.staff.lastName}` : 'Unassigned';
      if (!map.has(staffName)) map.set(staffName, []);
      map.get(staffName).push(appointment);
    });
    return [...map.entries()].map(([staffName, items]) => ({ staffName, count: items.length, next: items[0]?.startTime }));
  }, [appointments]);

  const popularServices = useMemo(() => {
    const map = new Map();
    appointments.forEach((appointment) => {
      const name = appointment.service?.name || 'Unknown';
      map.set(name, (map.get(name) || 0) + 1);
    });
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [appointments]);

  const pendingPayments = useMemo(() => payments.filter((payment) => payment.status === 'Pending'), [payments]);
  const reviewableAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.status === 'Completed' && !reviews.some((review) => Number(review.appointmentId) === Number(appointment.id))
      ),
    [appointments, reviews]
  );

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status });
    load();
  };

  const cancelBooking = async (id) => {
    await api.patch(`/appointments/${id}/cancel`);
    load();
  };

  const notify = (type, message) => setToast({ type, message });

  const createAdminUser = async () => {
    try {
      await api.post('/auth/admin/register', adminUserForm);
      setAdminUserForm({ name: '', email: '', phone: '', password: '', role: 'Customer' });
      notify('success', `${adminUserForm.role} account created successfully.`);
      load();
    } catch (requestError) {
      notify('error', getErrorMessage(requestError));
    }
  };

  const saveService = async () => {
    try {
      const payload = { ...serviceForm, durationMinutes: Number(serviceForm.durationMinutes), price: Number(serviceForm.price) };
      if (serviceForm.id) await api.put(`/services/${serviceForm.id}`, payload);
      else await api.post('/services', payload);
      setServiceForm({ id: '', name: '', price: '', category: 'Hairstyle', imageUrl: '', durationMinutes: 60, description: '' });
      notify('success', 'Service saved successfully.');
      load();
    } catch (requestError) {
      notify('error', getErrorMessage(requestError));
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      notify('success', 'Service removed from active services.');
      load();
    } catch (requestError) {
      notify('error', getErrorMessage(requestError));
    }
  };

  const approvePayment = async (id) => {
    await api.patch(`/payments/${id}/approve`);
    notify('success', 'Cash payment approved and booking approved.');
    load();
  };

  const rejectPayment = async (id) => {
    await api.patch(`/payments/${id}/reject`);
    notify('success', 'Cash payment rejected and booking cancelled.');
    load();
  };

  const submitReview = async () => {
    try {
      await api.post('/reviews', reviewForm);
      setReviewForm({ appointmentId: '', rating: 5, comment: '' });
      notify('success', 'Review submitted. Thank you for the feedback.');
      load();
    } catch (requestError) {
      notify('error', getErrorMessage(requestError));
    }
  };

  const pending = appointments.filter((item) => item.status === 'Pending').length;
  const pendingPaymentApprovalCount = appointments.filter((item) => item.status === 'Pending Payment Approval').length;
  const completed = appointments.filter((item) => item.status === 'Completed').length;
  const approved = appointments.filter((item) => item.status === 'Approved').length;
  const dashboardPopularServices = stats?.popularServices?.length ? stats.popularServices : popularServices.map((item) => ({ ...item, bookings: item.value }));
  const dashboardPopularHairstyles = stats?.popularHairstyles?.length ? stats.popularHairstyles : dashboardPopularServices.filter((item) => item.category === 'Hairstyle');
  const staffPerformance = stats?.staffPerformance || staffSchedules.map((item) => ({ name: item.staffName, bookings: item.count, completed: 0, pending: 0, revenue: 0 }));

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">{isAdmin ? 'Admin Dashboard' : `${user.role} Dashboard`}</Typography>
          <Typography color="text.secondary">
            {isAdmin ? 'Approve bookings, monitor performance, and manage daily salon operations.' : 'Book appointments, track statuses, view receipts, and follow updates.'}
          </Typography>
        </Box>
        {user.role === 'Customer' && (
          <Button variant="contained" startIcon={<CalendarMonth />} onClick={onBook}>
            Book Appointment
          </Button>
        )}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} lg={3}><StatCard label={isAdmin ? 'Total users' : 'Upcoming'} value={isAdmin ? stats?.totalUsers ?? users.length : upcoming.length} icon={<Groups />} /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard label="Total appointments" value={isAdmin ? stats?.totalAppointments ?? appointments.length : appointments.length} icon={<EventAvailable />} tone="#c49a45" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard label="Pending bookings" value={isAdmin ? stats?.pendingAppointments ?? pending : pending} icon={<NotificationsActive />} tone="#a87822" /></Grid>
        <Grid item xs={12} sm={6} lg={3}><StatCard label={isAdmin ? 'Revenue' : 'Receipts ready'} value={isAdmin ? money(stats?.revenue) : approved + completed} icon={<Paid />} tone="#6f8f72" /></Grid>
      </Grid>

      {isAdmin && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <StatCard label="Pending payment approvals" value={stats?.pendingPaymentApprovals ?? pendingPaymentApprovalCount} icon={<Paid />} tone="#805a8f" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatCard label="Approved bookings" value={stats?.approvedAppointments ?? approved} icon={<CheckCircle />} tone="#2f6f8f" />
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 2, border: '1px solid #f1dbe4', boxShadow: '0 14px 36px rgba(157,71,103,0.07)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label="Search bookings or users"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="From" type="date" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="To" type="date" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth onClick={() => setFilters({ from: '', to: '', search: '' })}>Clear</Button>
          </Grid>
        </Grid>
      </Paper>

      {isAdmin && stats && focus !== 'payments' && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} xl={8}>
            <AnalyticsPanel title="Booking analytics" subtitle="Monthly bookings, completed appointments, and revenue" height={430}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1dbe4" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="count" allowDecimals={false} />
                  <YAxis yAxisId="money" orientation="right" tickFormatter={(value) => `R${Number(value) / 1000}k`} />
                  <Tooltip formatter={(value, name) => (name === 'revenue' ? money(value) : value)} />
                  <Legend />
                  <Line yAxisId="count" type="monotone" dataKey="appointments" stroke="#b55378" strokeWidth={3} dot={false} />
                  <Line yAxisId="count" type="monotone" dataKey="completed" stroke="#6f8f72" strokeWidth={3} dot={false} />
                  <Line yAxisId="money" type="monotone" dataKey="revenue" stroke="#c49a45" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </AnalyticsPanel>
          </Grid>
          <Grid item xs={12} xl={4}>
            <AnalyticsPanel title="Popular services" subtitle="Most requested salon services" height={430}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="bookings" data={dashboardPopularServices} innerRadius={70} outerRadius={125} paddingAngle={4} label>
                    {dashboardPopularServices.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Demand']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </AnalyticsPanel>
          </Grid>
          <Grid item xs={12} lg={6}>
            <AnalyticsPanel title="Popular hairstyles" subtitle="Hair service demand by booking volume" height={380}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardPopularHairstyles} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1dbe4" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={130} />
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
                  <Bar dataKey="bookings" fill="#b55378" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsPanel>
          </Grid>
          <Grid item xs={12} lg={6}>
            <AnalyticsPanel title="Staff performance" subtitle="Bookings, completed work, and assigned pending items" height={380}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffPerformance} margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1dbe4" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#2f6f8f" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#6f8f72" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" fill="#c49a45" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsPanel>
          </Grid>
        </Grid>
      )}

      {focus === 'payments' && (
        <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
          <Typography variant="h6" gutterBottom>Payments</Typography>
          <Stack spacing={1}>
            {payments.map((payment) => (
              <Box key={payment.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Typography>{payment.appointment?.service?.name || `Appointment #${payment.appointmentId}`}</Typography>
                <Typography sx={{ fontWeight: 900 }}>{money(payment.amount)}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {focus !== 'payments' && (
        <>
          <Typography variant="h6">
            {focus === 'history' ? 'Booking History' : focus === 'bookings' ? 'My Bookings' : isAdmin ? 'All Bookings' : 'Upcoming Bookings'}
          </Typography>
          <AppointmentTable appointments={filteredAppointments} user={user} onStatus={updateStatus} onCancel={cancelBooking} onReceipt={onReceipt} />
        </>
      )}

      {isAdmin && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Staff schedules</Typography>
              <Stack spacing={1.3}>
                {staffSchedules.map((item) => (
                  <Box key={item.staffName} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography>{item.staffName}</Typography>
                    <Typography color="text.secondary">{item.count} bookings {item.next ? `- next ${new Date(item.next).toLocaleDateString()}` : ''}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Users</Typography>
              <Stack spacing={1.2}>
                {searchedUsers.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: '#fbe4ec', color: '#9d4767' }}><AccountCircle /></Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 800 }}>{item.firstName} {item.lastName}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.email} - {item.role}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {isAdmin && (
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>User and staff management</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}><TextField label="Full name" value={adminUserForm.name} onChange={(event) => setAdminUserForm((current) => ({ ...current, name: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Email" value={adminUserForm.email} onChange={(event) => setAdminUserForm((current) => ({ ...current, email: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Phone" value={adminUserForm.phone} onChange={(event) => setAdminUserForm((current) => ({ ...current, phone: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Password" type="password" value={adminUserForm.password} onChange={(event) => setAdminUserForm((current) => ({ ...current, password: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Account type" value={adminUserForm.role} onChange={(event) => setAdminUserForm((current) => ({ ...current, role: event.target.value }))} fullWidth>
                    <MenuItem value="Customer">Customer</MenuItem>
                    <MenuItem value="Staff">Staff</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}><Button variant="contained" fullWidth sx={{ height: '100%' }} onClick={createAdminUser}>Create Account</Button></Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Payment approvals</Typography>
              <Stack spacing={1.2}>
                {pendingPayments.map((payment) => (
                  <Box key={payment.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 850 }}>{payment.customer ? `${payment.customer.firstName} ${payment.customer.lastName}` : 'Customer'}</Typography>
                      <Typography color="text.secondary">{payment.appointment?.service?.name} - {money(payment.amount)}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" color="success" onClick={() => approvePayment(payment.id)}>Approve</Button>
                      <Button size="small" color="error" onClick={() => rejectPayment(payment.id)}>Reject</Button>
                    </Stack>
                  </Box>
                ))}
                {!pendingPayments.length && <Alert severity="info">No pending cash payments.</Alert>}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Service management</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6} md={3}><TextField label="Name" value={serviceForm.name} onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6} md={2}><TextField label="Price" type="number" value={serviceForm.price} onChange={(event) => setServiceForm((current) => ({ ...current, price: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField select label="Category" value={serviceForm.category} onChange={(event) => setServiceForm((current) => ({ ...current, category: event.target.value }))} fullWidth>
                    <MenuItem value="Hairstyle">Hairstyle</MenuItem>
                    <MenuItem value="Nails">Nailstyle</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={2}><TextField label="Duration" type="number" value={serviceForm.durationMinutes} onChange={(event) => setServiceForm((current) => ({ ...current, durationMinutes: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12} md={3}><TextField label="Image URL" value={serviceForm.imageUrl} onChange={(event) => setServiceForm((current) => ({ ...current, imageUrl: event.target.value }))} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Description" value={serviceForm.description} onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))} fullWidth multiline minRows={2} /></Grid>
                <Grid item xs={12}><Button variant="contained" onClick={saveService}>{serviceForm.id ? 'Update Service' : 'Add Service'}</Button></Grid>
              </Grid>
              <Table size="small" sx={{ mt: 2 }}>
                <TableHead><TableRow><TableCell>Service</TableCell><TableCell>Category</TableCell><TableCell>Price</TableCell><TableCell>Preview</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{money(service.price)}</TableCell>
                      <TableCell>
                        <ServiceImage
                          src={service.imageUrl}
                          alt={service.name}
                          height={58}
                          compact
                          sx={{ width: 72, '&:hover .service-card-image': { transform: 'scale(1.08)' } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => setServiceForm(service)}>Edit</Button>
                        <Button size="small" color="error" onClick={() => deleteService(service.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Receipt management</Typography>
              <Table size="small">
                <TableHead><TableRow><TableCell>Receipt</TableCell><TableCell>Customer</TableCell><TableCell>Service</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.payment?.customer ? `${invoice.payment.customer.firstName} ${invoice.payment.customer.lastName}` : '-'}</TableCell>
                      <TableCell>{invoice.appointment?.service?.name || '-'}</TableCell>
                      <TableCell>{money(invoice.total)}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      )}

      {user.role === 'Customer' && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <Stack spacing={1.2}>
                {notifications.slice(0, 5).map((item) => (
                  <Alert key={item.id} severity={item.isRead ? 'info' : 'success'} icon={<NotificationsActive />}>
                    <strong>{item.title}</strong> {item.message}
                  </Alert>
                ))}
                {!notifications.length && <Alert severity="info">Booking updates will appear here.</Alert>}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #f1dbe4' }}>
              <Typography variant="h6" gutterBottom>Reviews</Typography>
              <Stack spacing={1.5}>
                <TextField select label="Completed booking" value={reviewForm.appointmentId} onChange={(event) => setReviewForm((current) => ({ ...current, appointmentId: event.target.value }))} fullWidth>
                  {reviewableAppointments.map((appointment) => (
                    <MenuItem key={appointment.id} value={appointment.id}>{appointment.service?.name} - {new Date(appointment.startTime).toLocaleDateString()}</MenuItem>
                  ))}
                </TextField>
                <Rating value={Number(reviewForm.rating)} onChange={(_, value) => setReviewForm((current) => ({ ...current, rating: value || 5 }))} />
                <TextField label="Review" multiline minRows={2} value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} />
                <Button variant="contained" disabled={!reviewForm.appointmentId} onClick={submitReview}>Submit Review</Button>
                {reviews.slice(0, 3).map((review) => (
                  <Box key={review.id}>
                    <Rating size="small" value={review.rating} readOnly />
                    <Typography color="text.secondary">{review.comment || review.service?.name}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.type}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Stack>
  );
}
