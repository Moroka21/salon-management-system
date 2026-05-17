import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import api, { getErrorMessage } from '../services/api';
import ServiceImage from '../components/ServiceImage';

const steps = ['Category', 'Style', 'Staff', 'Date & Time', 'Confirm'];
const categories = [
  { key: 'Hairstyle', label: 'Hairstyles', description: 'Braids, cuts, colour, styling, and treatments' },
  { key: 'Nails', label: 'Nail Styles', description: 'Manicure, acrylic, gel, nail art, and pedicure' },
];

function SelectCard({ title, subtitle, image, selected, onClick, chip }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderColor: selected ? '#c49a45' : '#efd8df',
        bgcolor: selected ? '#fff7e6' : '#fff',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 18px 42px rgba(157,71,103,0.16)' },
        '&:hover .service-card-image': { transform: 'scale(1.06)' },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        {image && <ServiceImage src={image} alt={title} height={180} />}
        <CardContent>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Typography variant="h6">{title}</Typography>
            {chip}
          </Stack>
          <Typography color="text.secondary">{subtitle}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function BookAppointment({ user }) {
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selection, setSelection] = useState({ category: '', serviceId: '', staffId: '', startTime: '', paymentMethod: 'Cash' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/services'), api.get('/users?role=Staff')])
      .then(([serviceRes, staffRes]) => {
        setServices(serviceRes.data.filter((service) => service.isActive));
        setStaff(staffRes.data.slice(0, 2));
      })
      .catch((error) => setStatus({ type: 'error', message: getErrorMessage(error) }))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = useMemo(
    () => services.filter((service) => service.category === selection.category),
    [services, selection.category]
  );
  const selectedService = useMemo(
    () => services.find((service) => Number(service.id) === Number(selection.serviceId)),
    [services, selection.serviceId]
  );
  const selectedStaff = useMemo(
    () => staff.find((member) => Number(member.id) === Number(selection.staffId)),
    [staff, selection.staffId]
  );

  const selectedDate = selection.startTime ? new Date(selection.startTime) : null;
  const selectedHour = selectedDate ? selectedDate.getHours() + selectedDate.getMinutes() / 60 : null;
  const timeError =
    selectedDate && (selectedDate <= new Date() || selectedHour < 8 || selectedHour >= 18)
      ? 'Choose a future time between 08:00 and 18:00'
      : '';

  const canContinue =
    (activeStep === 0 && selection.category) ||
    (activeStep === 1 && selection.serviceId) ||
    (activeStep === 2 && selection.staffId) ||
    (activeStep === 3 && selection.startTime && !timeError) ||
    activeStep === 4;

  const submitBooking = async () => {
    if (!selection.serviceId || !selection.staffId || !selection.startTime || timeError) {
      setStatus({ type: 'error', message: 'Please complete all booking steps with a valid time' });
      return;
    }
    try {
      await api.post('/appointments', {
        serviceId: selection.serviceId,
        staffId: selection.staffId,
        startTime: selection.startTime,
        paymentMethod: selection.paymentMethod,
      });
      setStatus({
        type: 'success',
        message:
          selection.paymentMethod === 'Cash'
            ? 'Booking request sent. Status: Pending Payment Approval.'
            : 'Booking request sent. Status: Pending approval.',
      });
      setSelection({ category: '', serviceId: '', staffId: '', startTime: '', paymentMethod: 'Cash' });
      setActiveStep(0);
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Book Appointment</Typography>
        <Typography color="text.secondary">Salon hours are 08:00 to 18:00. All bookings require admin approval.</Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, border: '1px solid #f1dbe4' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} md={6} key={category.key}>
                <SelectCard
                  title={category.label}
                  subtitle={category.description}
                  selected={selection.category === category.key}
                  onClick={() => setSelection((current) => ({ ...current, category: category.key, serviceId: '', staffId: '', startTime: '' }))}
                  chip={<Chip label={`${services.filter((service) => service.category === category.key).length} styles`} color="secondary" />}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {loading && (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <CircularProgress />
            <Typography color="text.secondary">Loading services...</Typography>
          </Stack>
        )}

        {activeStep === 1 && !loading && (
          <Grid container spacing={2}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <SelectCard
                  title={service.name}
                  subtitle={`${service.durationMinutes} minutes`}
                  image={service.imageUrl}
                  selected={Number(selection.serviceId) === Number(service.id)}
                  onClick={() => setSelection((current) => ({ ...current, serviceId: service.id }))}
                  chip={<Chip label={`R${service.price}`} />}
                />
              </Grid>
            ))}
            {!filteredServices.length && (
              <Grid item xs={12}>
                <Alert severity="info">No active services are available in this category right now.</Alert>
              </Grid>
            )}
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            {staff.map((member) => (
              <Grid item xs={12} sm={6} key={member.id}>
                <SelectCard
                  title={`${member.firstName} ${member.lastName}`}
                  subtitle={member.role === 'Admin' ? 'Senior stylist' : 'Stylist'}
                  selected={Number(selection.staffId) === Number(member.id)}
                  onClick={() => setSelection((current) => ({ ...current, staffId: member.id }))}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {activeStep === 3 && (
          <Stack spacing={1}>
            <TextField
              label="Date and time"
              type="datetime-local"
              value={selection.startTime}
              onChange={(event) => setSelection((current) => ({ ...current, startTime: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              error={Boolean(timeError)}
              helperText={timeError || 'Choose a future time between 08:00 and 18:00'}
              fullWidth
            />
          </Stack>
        )}

        {activeStep === 4 && (
          <Stack spacing={1}>
            <Typography><strong>Customer:</strong> {user.firstName} {user.lastName}</Typography>
            <Typography><strong>Category:</strong> {selection.category}</Typography>
            <Typography><strong>Style:</strong> {selectedService?.name}</Typography>
            <Typography><strong>Price:</strong> R{selectedService?.price}</Typography>
            <Typography><strong>Staff:</strong> {selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : ''}</Typography>
            <Typography><strong>Date:</strong> {selection.startTime ? new Date(selection.startTime).toLocaleString() : ''}</Typography>
            <RadioGroup
              row
              value={selection.paymentMethod}
              onChange={(event) => setSelection((current) => ({ ...current, paymentMethod: event.target.value }))}
            >
              <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
              <FormControlLabel value="Card" control={<Radio />} label="Card" />
            </RadioGroup>
            <Alert severity="info">
              {selection.paymentMethod === 'Cash'
                ? 'Cash bookings are submitted as Pending Payment Approval for admin confirmation.'
                : 'Card bookings are submitted as Pending for admin approval.'}
            </Alert>
          </Stack>
        )}

        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" disabled={!canContinue} onClick={() => setActiveStep((step) => step + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" disabled={!canContinue} onClick={submitBooking}>
              Confirm Booking
            </Button>
          )}
        </Stack>
      </Paper>

      <Snackbar
        open={Boolean(status)}
        autoHideDuration={5000}
        onClose={() => setStatus(null)}
        message={status?.message}
      />
      {status?.type === 'error' && <Alert severity="error">{status.message}</Alert>}
    </Stack>
  );
}
