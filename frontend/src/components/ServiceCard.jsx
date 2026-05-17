import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ServiceImage from './ServiceImage';

export default function ServiceCard({ service }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        overflow: 'hidden',
        '&:hover .service-card-image': { transform: 'scale(1.06)' },
      }}
    >
      <ServiceImage src={service.imageUrl} alt={service.name} height={180} />
      <CardContent>
        <Typography variant="h6">{service.name}</Typography>
        <Typography color="text.secondary">{service.durationMinutes} minutes</Typography>
        <Typography sx={{ mt: 1 }}>R{service.price}</Typography>
      </CardContent>
    </Card>
  );
}
