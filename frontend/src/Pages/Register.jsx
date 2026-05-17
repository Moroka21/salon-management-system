import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Person from '@mui/icons-material/Person';
import Phone from '@mui/icons-material/Phone';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import api, { getErrorMessage } from '../services/api';
import JJLogo from '../components/JJLogo.jsx';

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters')
    .required('Full name is required'),
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must contain exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters and contain a number or symbol')
    .matches(/[0-9\W]/, 'Password must be at least 6 characters and contain a number or symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function Register({ onAuth, onLogin }) {
  const [toast, setToast] = useState(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff8fb', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="md">
        <Card sx={{ border: '1px solid #f0d6c2', boxShadow: '0 28px 70px rgba(157,71,103,0.16)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <JJLogo />
              <Typography variant="h4" sx={{ fontWeight: 950 }}>Create Account</Typography>
              <Typography color="text.secondary">All new registrations are automatically created as Customer accounts.</Typography>
            </Stack>
            <Formik
              initialValues={{ name: '', email: '', phone: '', password: '', confirmPassword: '' }}
              validationSchema={registerValidationSchema}
              validateOnBlur
              validateOnChange
              onSubmit={async (values, helpers) => {
                try {
                  const { confirmPassword, ...payload } = values;
                  const { data } = await api.post('/auth/register', payload);
                  setToast({ type: 'success', message: 'Account created successfully. Opening your dashboard...' });
                  window.setTimeout(() => onAuth(data), 650);
                } catch (error) {
                  const message = getErrorMessage(error);
                  helpers.setStatus(message);
                  setToast({ type: 'error', message });
                } finally {
                  helpers.setSubmitting(false);
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status, submitCount, isValid, setStatus }) => {
                const showError = (field) => Boolean((touched[field] || values[field] || submitCount) && errors[field]);
                return (
                  <Form>
                    <Stack spacing={2.2}>
                      {status && <Alert severity="error">{status}</Alert>}
                      <TextField
                        name="name"
                        label="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError('name')}
                        helperText={showError('name') && errors.name}
                        fullWidth
                        InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="email"
                            label="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError('email')}
                            helperText={showError('email') && errors.email}
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="phone"
                            label="Phone Number"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError('phone')}
                            helperText={showError('phone') && errors.phone}
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError('password')}
                            helperText={showError('password') && errors.password}
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError('confirmPassword')}
                            helperText={showError('confirmPassword') && errors.confirmPassword}
                            fullWidth
                            InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                          />
                        </Grid>
                      </Grid>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        onClick={() => {
                          if (!isValid) {
                            const message = 'Account was not created. Please correct the highlighted fields.';
                            setStatus(message);
                            setToast({ type: 'error', message });
                          }
                        }}
                        sx={{ py: 1.3 }}
                      >
                        Register
                      </Button>
                      <Typography align="center" color="text.secondary">
                        Already have an account?{' '}
                        <Link component="button" type="button" onClick={onLogin} sx={{ fontWeight: 900 }}>
                          Login
                        </Link>
                      </Typography>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </CardContent>
        </Card>
      </Container>
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.type}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
