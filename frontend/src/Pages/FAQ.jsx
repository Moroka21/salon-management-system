import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import ArrowBack from '@mui/icons-material/ArrowBack';
import api from '../services/api';

export const salonFaqs = [
  ['How do I book an appointment?', 'Create an account, log in, open Book Appointment, choose hair or nails, select a service, staff member, and a time.'],
  ['Does my booking get confirmed immediately?', 'Bookings are first submitted as Pending. An admin reviews each request and approves or rejects it.'],
  ['Can I cancel my booking?', 'Yes. Customers can cancel a booking while it is still Pending. Approved bookings must be cancelled by contacting the salon.'],
  ['What time does the salon open?', 'J&J Beauty Bar works from 08:00 to 18:00. The booking form only accepts times inside those hours.'],
  ['What time does the salon close?', 'The salon closes at 18:00, and services must finish before closing time.'],
  ['Do I choose a staff member?', 'Yes. You can choose an available staff member during booking. If they are already booked, the system asks you to pick another time.'],
  ['How does staff availability work?', 'The system checks active bookings for the selected staff member and prevents double-booking.'],
  ['Can two customers book the same time?', 'The salon can accept limited simultaneous bookings, but a specific staff member cannot be double-booked.'],
  ['What services are available?', 'The salon offers hair services and nail services, including braids, styling, treatments, manicures, acrylic, gel, and nail art.'],
  ['How long do services take?', 'Each service has its own duration. You can see the estimated time on the service card before confirming.'],
  ['Where can I see prices?', 'Prices appear on service cards during booking and again on the confirmation step before you submit.'],
  ['Can prices change?', 'Prices may be updated by the salon. The current price shown during booking is the price used for your appointment receipt.'],
  ['Which payment methods are accepted?', 'The system supports recorded payments. Contact the salon for the currently accepted in-salon payment options.'],
  ['When do I receive a receipt?', 'Receipts become available after an appointment is approved or completed.'],
  ['Can I book nails and hair together?', 'Book one service at a time so each appointment has the correct staff member, time, and price.'],
  ['Can I update my profile?', 'Yes. Use Profile to review and update contact details such as your name and phone number.'],
  ['What does Pending mean?', 'Pending means your request has been received and is waiting for admin approval.'],
  ['What does Approved mean?', 'Approved means the salon accepted your appointment and you should arrive at the selected date and time.'],
  ['What does Cancelled mean?', 'Cancelled means the appointment will not take place. You can make a new booking for another time.'],
  ['Can staff manage bookings?', 'Staff can view assigned schedules and complete bookings, while admins approve or reject booking requests.'],
  ['How do admins approve bookings?', 'Admins use the dashboard bookings table to review pending appointments and approve or reject them.'],
  ['How do I contact the salon?', 'Call 0639390931 / 0608185119, email mamcyrachidi@icloud.com, or visit Strydkraal B Mabokotswane House 20057.'],
];

export default function FAQ({ onHome }) {
  const [faqs, setFaqs] = useState(salonFaqs.map(([question, answer]) => ({ question, answer })));

  useEffect(() => {
    api
      .get('/faqs')
      .then((response) => {
        if (response.data?.length) setFaqs(response.data);
      })
      .catch(() => {});
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff8fb', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBack />} onClick={onHome} sx={{ mb: 3 }}>Back Home</Button>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Chip label="Salon Help Centre" sx={{ alignSelf: 'flex-start', bgcolor: '#fff1d6', color: '#8a641d', fontWeight: 900 }} />
          <Typography variant="h3" sx={{ fontWeight: 950, color: '#2f2528' }}>
            Frequently asked questions
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18 }}>
            Clear answers about bookings, pricing, staff availability, services, and salon hours.
          </Typography>
        </Stack>
        {faqs.map(({ question, answer }, index) => (
          <Accordion
            key={question}
            disableGutters
            sx={{
              mb: 1.3,
              border: '1px solid #f0d6c2',
              boxShadow: '0 12px 28px rgba(157,71,103,0.07)',
              '&:before': { display: 'none' },
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 18px 42px rgba(157,71,103,0.12)' },
            }}
          >
            <AccordionSummary expandIcon={<AddCircleOutline sx={{ color: '#9d4767' }} />}>
              <Typography sx={{ fontWeight: 850 }}>
                {String(index + 1).padStart(2, '0')}. {question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>{answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}
