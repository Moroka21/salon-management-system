import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Print from '@mui/icons-material/Print';
import api, { getErrorMessage } from '../services/api';
import JJLogo from '../components/JJLogo.jsx';

const money = (value) => `R${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function Receipt({ appointmentId, onBack }) {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!appointmentId) return;
    api
      .get(`/appointments/${appointmentId}/receipt`)
      .then((response) => setReceipt(response.data))
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [appointmentId]);

  if (!appointmentId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Select an approved booking from My Bookings to view a receipt.</Alert>
        {onBack && <Button sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={onBack}>Back to bookings</Button>}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        {onBack && <Button sx={{ mt: 2 }} startIcon={<ArrowBack />} onClick={onBack}>Back to bookings</Button>}
      </Container>
    );
  }
  if (!receipt) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#fff8fb' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">Preparing receipt...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff8fb', py: { xs: 2, md: 5 } }}>
      <Container maxWidth="md">
        <Stack className="receipt-actions" direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          {onBack ? <Button startIcon={<ArrowBack />} onClick={onBack}>Back to bookings</Button> : <Box />}
          <Button variant="contained" startIcon={<Print />} onClick={() => window.print()}>Print / Download</Button>
        </Stack>

        <Paper
          className="receipt-paper"
          sx={{
            p: { xs: 3, md: 5 },
            border: '1px solid #f1dbe4',
            boxShadow: '0 28px 80px rgba(157,71,103,0.14)',
            bgcolor: '#fff',
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <JJLogo />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>{receipt.salon?.address}</Typography>
              <Typography color="text.secondary">{receipt.salon?.phone}</Typography>
              <Typography color="text.secondary">{receipt.salon?.email}</Typography>
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="overline" sx={{ color: '#a87822', fontWeight: 900 }}>Official receipt</Typography>
              <Typography variant="h5" sx={{ fontWeight: 950 }}>{receipt.receiptNumber}</Typography>
              <Typography color="text.secondary">Issued {new Date().toLocaleDateString()}</Typography>
              <Chip sx={{ mt: 1 }} color={receipt.paymentStatus === 'Paid' ? 'success' : 'warning'} label={receipt.paymentStatus} />
            </Box>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="text.secondary">Customer</Typography>
              <Typography variant="h6">{receipt.customerName}</Typography>
              <Typography color="text.secondary">Booking #{receipt.bookingId}</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="overline" color="text.secondary">Appointment</Typography>
              <Typography variant="h6">{new Date(receipt.dateTime).toLocaleString()}</Typography>
              <Typography color="text.secondary">Staff: {receipt.staffName}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, border: '1px solid #f1dbe4', borderRadius: 2, overflow: 'hidden' }}>
            <Grid container sx={{ bgcolor: '#fff7fa', px: 2, py: 1.4, fontWeight: 900 }}>
              <Grid item xs={7}><Typography sx={{ fontWeight: 900 }}>Service</Typography></Grid>
              <Grid item xs={2}><Typography sx={{ fontWeight: 900 }}>Status</Typography></Grid>
              <Grid item xs={3} sx={{ textAlign: 'right' }}><Typography sx={{ fontWeight: 900 }}>Amount</Typography></Grid>
            </Grid>
            <Grid container sx={{ px: 2, py: 2 }}>
              <Grid item xs={7}><Typography>{receipt.serviceName}</Typography></Grid>
              <Grid item xs={2}><Typography>{receipt.status}</Typography></Grid>
              <Grid item xs={3} sx={{ textAlign: 'right' }}><Typography>{money(receipt.price)}</Typography></Grid>
            </Grid>
          </Box>

          <Stack alignItems="flex-end" spacing={1.2} sx={{ mt: 4 }}>
            <Typography color="text.secondary">Payment method: {receipt.paymentMethod}</Typography>
            <Divider sx={{ width: { xs: '100%', sm: 320 } }} />
            <Typography variant="h4" sx={{ color: '#9d4767', fontWeight: 950 }}>
              Total {money(receipt.price)}
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
