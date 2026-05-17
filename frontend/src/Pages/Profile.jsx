import React, { useState } from 'react';
import { Alert, Button, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import api, { getErrorMessage } from '../services/api';

export default function Profile({ user }) {
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
  });
  const [status, setStatus] = useState(null);

  const saveProfile = async () => {
    try {
      const response = await api.patch('/users/me', form);
      const stored = JSON.parse(localStorage.getItem('salon_user') || '{}');
      localStorage.setItem('salon_user', JSON.stringify({ ...stored, ...response.data }));
      setStatus({ type: 'success', message: 'Profile updated. Reloading your session details...' });
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4">Profile</Typography>
        <Typography color="text.secondary">Keep your contact details current so booking updates reach you.</Typography>
      </Stack>
      <Paper sx={{ p: 3, maxWidth: 640, border: '1px solid #f1dbe4', boxShadow: '0 18px 45px rgba(157,71,103,0.08)' }}>
        <Stack spacing={2}>
          <TextField label="First name" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} />
          <TextField label="Last name" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} />
          <TextField label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <TextField label="Email" value={user.email} disabled />
          <TextField label="Role" value={user.role} disabled />
          <Button variant="contained" onClick={saveProfile} sx={{ alignSelf: 'flex-start' }}>Save Profile</Button>
        </Stack>
      </Paper>
      {status?.type === 'error' && <Alert severity="error">{status.message}</Alert>}
      <Snackbar open={status?.type === 'success'} autoHideDuration={3000} message={status?.message} onClose={() => setStatus(null)} />
    </Stack>
  );
}
