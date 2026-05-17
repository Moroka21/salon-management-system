import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Spa from '@mui/icons-material/Spa';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import api, { getErrorMessage } from '../services/api';
import JJLogo from '../components/JJLogo.jsx';

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login({ onAuth, onRegister }) {
  const [toast, setToast] = useState(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff8fb', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            border: '1px solid #f0d6c2',
            boxShadow: '0 28px 70px rgba(157,71,103,0.16)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, bgcolor: '#2f2528', color: 'white' }}>
            <JJLogo dark />
            <Typography variant="h4" sx={{ mt: 3, fontWeight: 950 }}>Welcome back</Typography>
            <Typography sx={{ color: '#f8dbe5', mt: 1 }}>Sign in to manage bookings, receipts, services, and salon updates.</Typography>
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginValidationSchema}
              validateOnBlur
              validateOnChange
              onSubmit={async (values, helpers) => {
                try {
                  const { data } = await api.post('/auth/login', values);
                  setToast({ type: 'success', message: 'Login successful. Opening your dashboard...' });
                  window.setTimeout(() => onAuth(data), 450);
                } catch (error) {
                  const message = getErrorMessage(error);
                  helpers.setStatus(message);
                  setToast({ type: 'error', message });
                } finally {
                  helpers.setSubmitting(false);
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
                <Form>
                  <Stack spacing={2.2}>
                    {status && <Alert severity="error">{status}</Alert>}
                    <TextField
                      name="email"
                      label="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean((touched.email || values.email) && errors.email)}
                      helperText={(touched.email || values.email) && errors.email}
                      fullWidth
                      InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean((touched.password || values.password) && errors.password)}
                      helperText={(touched.password || values.password) && errors.password}
                      fullWidth
                      InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={<Spa />}
                      sx={{ py: 1.3, transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-2px)' } }}
                    >
                      Login
                    </Button>
                    <Typography align="center" color="text.secondary">
                      New to J&J Beauty Bar?{' '}
                      <Link component="button" type="button" onClick={onRegister} sx={{ fontWeight: 900 }}>
                        Create Account
                      </Link>
                    </Typography>
                  </Stack>
                </Form>
              )}
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
