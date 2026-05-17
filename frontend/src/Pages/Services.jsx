import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import api, { getErrorMessage } from '../services/api';
import ServiceImage from '../components/ServiceImage';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services')
      .then((response) => setServices(response.data.filter((service) => service.isActive)))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(
    () => ({
      Hairstyles: services.filter((service) => service.category === 'Hairstyle'),
      'Nail Styles': services.filter((service) => service.category === 'Nails'),
    }),
    [services]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Services</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
          <CircularProgress />
          <Typography color="text.secondary">Loading services...</Typography>
        </Stack>
      )}
      {!loading && Object.entries(grouped).map(([title, items]) => (
        <Stack spacing={2} key={title}>
          <Typography variant="h5">{title}</Typography>
          <Grid container spacing={2}>
            {items.map((service) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 18px 42px rgba(157,71,103,0.14)',
                    },
                    '&:hover .service-card-image': { transform: 'scale(1.06)' },
                  }}
                >
                  <ServiceImage src={service.imageUrl} alt={service.name} height={180} />
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="h6">{service.name}</Typography>
                      <Chip size="small" label={`R${service.price}`} />
                    </Stack>
                    <Typography color="text.secondary">{service.durationMinutes} minutes</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  );
}
