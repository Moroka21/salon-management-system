import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Spa from '@mui/icons-material/Spa';

export default function ServiceImage({ src, alt, height = 190, compact = false, sx }) {
  const [failed, setFailed] = useState(!src);
  const label = alt || 'Salon service';

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height,
        aspectRatio: compact ? '1 / 1' : '4 / 3',
        bgcolor: '#fff1f6',
        borderRadius: compact ? 1.5 : 0,
        ...sx,
      }}
    >
      {!failed ? (
        <Box
          component="img"
          src={src}
          alt={label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="service-card-image"
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 280ms ease, filter 280ms ease',
          }}
        />
      ) : (
        <Box
          role="img"
          aria-label={`${label} image unavailable`}
          sx={{
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            color: '#9d4767',
            background:
              'linear-gradient(135deg, rgba(255,247,250,0.95), rgba(241,219,228,0.95))',
            p: compact ? 1 : 2,
          }}
        >
          <Box>
            <Spa fontSize={compact ? 'small' : 'large'} />
            {!compact && (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 800 }}>
                Image loading
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
