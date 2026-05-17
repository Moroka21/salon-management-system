import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import AlternateEmail from '@mui/icons-material/AlternateEmail';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import ContentCut from '@mui/icons-material/ContentCut';
import LocationOn from '@mui/icons-material/LocationOn';
import PhoneInTalk from '@mui/icons-material/PhoneInTalk';
import Spa from '@mui/icons-material/Spa';
import JJLogo from '../components/JJLogo.jsx';

const heroImage =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=85';

const contactCards = [
  {
    icon: <PhoneInTalk />,
    label: 'Call us',
    title: '0639390931 / 0608185119',
    detail: 'Rachidi Jane / Rachidi Jessica',
  },
  {
    icon: <AlternateEmail />,
    label: 'Email',
    title: 'mamcyrachidi@icloud.com',
    detail: 'Send booking and service enquiries',
  },
  {
    icon: <LocationOn />,
    label: 'Visit',
    title: 'Strydkraal B Mabokotswane',
    detail: 'House 20057',
  },
];

const highlights = [
  { icon: <ContentCut />, title: 'Hair styling', copy: 'Braids, cuts, treatments, colour, and everyday styling.' },
  { icon: <Spa />, title: 'Nail care', copy: 'Manicure, acrylic, gel, nail art, and pedicure services.' },
  { icon: <CalendarMonth />, title: 'Simple booking', copy: 'Choose a service, staff member, and time between 08:00 and 18:00.' },
];

export default function Home({ onLogin, onRegister, onFAQ }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff8fb', color: '#2f2528' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(196, 144, 92, 0.18)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ height: 72, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
            <JJLogo compact />
            <Link component="button" underline="none" onClick={onFAQ} sx={{ color: '#7a5a2f', fontWeight: 800 }}>
              FAQ
            </Link>
            <Box sx={{ justifySelf: 'end' }}>
              <Button onClick={onLogin} sx={{ color: '#7a3551', '&:hover': { bgcolor: '#fff0f5' } }}>
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          minHeight: { xs: 620, md: 'calc(100vh - 72px)' },
          display: 'flex',
          alignItems: 'end',
          backgroundImage: `linear-gradient(90deg, rgba(35,22,25,0.72), rgba(35,22,25,0.2)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
          <Box sx={{ maxWidth: 680, color: 'white' }}>
            <JJLogo dark />
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: 40, md: 68 }, mb: 2 }}>
              Modern salon care, beautifully managed
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.7, maxWidth: 620, color: 'rgba(255,255,255,0.92)' }}>
              A warm, professional salon experience for polished hair, beautiful nails, and confident everyday style.
              Book appointments, manage visits, and stay connected with our team.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button variant="contained" size="large" onClick={onRegister} sx={{ bgcolor: '#d8a955', '&:hover': { bgcolor: '#c49543' } }}>
                Create Account
              </Button>
              <Button variant="outlined" size="large" onClick={onLogin} sx={{ color: 'white', borderColor: 'white' }}>
                Login
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 6, md: 9 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2.5}>
            {highlights.map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Card sx={{ height: '100%', border: '1px solid #f4dce5', boxShadow: '0 18px 45px rgba(157,71,103,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: '#fff1d6', color: '#9d6c18', mb: 2 }}>{item.icon}</Avatar>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>{item.copy}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff8fb', borderTop: '1px solid #f1dbe4' }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" sx={{ color: '#a87822', fontWeight: 900 }}>
                Contact us
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 950, color: '#2f2528' }}>
                J&J Beauty Bar
              </Typography>
            </Box>
            <Grid container spacing={2.5}>
              {contactCards.map((item) => (
                <Grid item xs={12} md={4} key={item.label}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid #f0d6c2',
                      boxShadow: '0 16px 38px rgba(157,71,103,0.1)',
                      transition: 'transform 180ms ease, box-shadow 180ms ease',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 24px 55px rgba(157,71,103,0.18)' },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar sx={{ bgcolor: '#fbe4ec', color: '#9d4767', mb: 2 }}>{item.icon}</Avatar>
                      <Typography variant="overline" sx={{ color: '#a87822', fontWeight: 900 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{item.title}</Typography>
                      <Typography color="text.secondary">{item.detail}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
