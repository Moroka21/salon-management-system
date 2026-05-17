import React, { Component, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DesignServices from '@mui/icons-material/DesignServices';
import HelpOutline from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/icons-material/Menu';
import Paid from '@mui/icons-material/Paid';
import Person from '@mui/icons-material/Person';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Dashboard from './Pages/Dashboard.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import BookAppointment from './Pages/BookAppointment.jsx';
import Home from './Pages/Home.jsx';
import FAQ from './Pages/FAQ.jsx';
import Services from './Pages/Services.jsx';
import Profile from './Pages/Profile.jsx';
import Receipt from './Pages/Receipt.jsx';
import JJLogo from './components/JJLogo.jsx';
import './style.css';

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#b55378' },
    secondary: { main: '#c49a45' },
    background: { default: '#fff8fb' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'].join(','),
    h3: { fontWeight: 900, letterSpacing: 0 },
    h4: { fontWeight: 850, letterSpacing: 0 },
    h6: { fontWeight: 750, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 800 },
  },
});

function readStoredUser() {
  try {
    const raw = localStorage.getItem('salon_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('salon_user');
    localStorage.removeItem('salon_token');
    return null;
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            The app could not load
          </Typography>
          <Typography color="text.secondary">{this.state.error.message}</Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => {
              localStorage.removeItem('salon_user');
              localStorage.removeItem('salon_token');
              window.location.reload();
            }}
          >
            Reset session
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(readStoredUser);
  const [page, setPage] = useState(user ? 'dashboard' : 'home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [receiptAppointmentId, setReceiptAppointmentId] = useState(null);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (!user && !['home', 'faq', 'login', 'register'].includes(page)) setPage('home');
    if (user && ['home', 'faq', 'login', 'register'].includes(page)) setPage('dashboard');
  }, [user, page]);

  const navItems = useMemo(() => {
    const base = [
      { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { key: 'booking', label: 'Book Appointment', icon: <CalendarMonth /> },
      { key: 'bookings', label: 'My Bookings', icon: <ReceiptLong /> },
      { key: 'receipt', label: 'Receipt', icon: <ReceiptLong /> },
      { key: 'services', label: 'Services', icon: <DesignServices /> },
      { key: 'profile', label: 'Profile', icon: <Person /> },
    ];
    if (['Admin', 'Staff'].includes(user?.role)) {
      base.splice(3, 0, { key: 'payments', label: 'Payments', icon: <Paid /> });
    }
    return base;
  }, [user]);

  const handleAuth = ({ token, user: nextUser }) => {
    localStorage.setItem('salon_token', token);
    localStorage.setItem('salon_user', JSON.stringify(nextUser));
    setUser(nextUser);
    setPage('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('salon_token');
    localStorage.removeItem('salon_user');
    setReceiptAppointmentId(null);
    setUser(null);
    setPage('home');
  };

  if (user && page === 'receipt') {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Receipt
          appointmentId={receiptAppointmentId}
          onBack={() => setPage('bookings')}
        />
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {page === 'home' && <Home onLogin={() => setPage('login')} onRegister={() => setPage('register')} onFAQ={() => setPage('faq')} />}
        {page === 'faq' && <FAQ onHome={() => setPage('home')} />}
        {page === 'login' && <Login onAuth={handleAuth} onRegister={() => setPage('register')} />}
        {page === 'register' && <Register onAuth={handleAuth} onLogin={() => setPage('login')} />}
      </ThemeProvider>
    );
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Toolbar>
        <JJLogo />
      </Toolbar>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={page === item.key}
            onClick={() => {
              setPage(item.key);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              transition: 'background-color 160ms ease, transform 160ms ease',
              '&:hover': { bgcolor: '#fff0f5', transform: 'translateX(3px)' },
              '&.Mui-selected': { bgcolor: '#fce7ef', color: '#9d4767' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItemButton onClick={logout} sx={{ borderRadius: 2 }}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" secondary={user.role} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff8fb' }}>
        <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #f1dbe4' }}>
          <Toolbar>
            {!isDesktop && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }} aria-label="Open menu">
                <Menu />
              </IconButton>
            )}
            <HomeIcon sx={{ mr: 1, color: '#c49a45' }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              J&J Beauty Bar
            </Typography>
            <Button startIcon={<HelpOutline />} onClick={() => setPage('services')} sx={{ mr: 1 }}>
              Services
            </Button>
            <Typography variant="body2">{`${user.firstName} ${user.lastName}`}</Typography>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant={isDesktop ? 'permanent' : 'temporary'}
            open={isDesktop || mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid #f1dbe4' } }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8, width: '100%' }}>
          {page === 'dashboard' && <Dashboard user={user} onBook={() => setPage('booking')} onReceipt={(id) => { setReceiptAppointmentId(id); setPage('receipt'); }} />}
          {page === 'booking' && <BookAppointment user={user} />}
          {page === 'bookings' && <Dashboard user={user} focus="bookings" onBook={() => setPage('booking')} onReceipt={(id) => { setReceiptAppointmentId(id); setPage('receipt'); }} />}
          {page === 'services' && <Services />}
          {page === 'profile' && <Profile user={user} />}
          {page === 'payments' && <Dashboard user={user} focus="payments" onReceipt={(id) => { setReceiptAppointmentId(id); setPage('receipt'); }} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
