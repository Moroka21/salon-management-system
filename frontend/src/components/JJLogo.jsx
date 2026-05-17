import React from 'react';
import { Box, Typography } from '@mui/material';

export default function JJLogo({ compact = false, dark = false }) {
  const ink = dark ? '#fffafc' : '#24191d';
  const blush = '#d986a4';
  const gold = '#c79a43';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
      <Box
        component="svg"
        viewBox="0 0 96 96"
        role="img"
        aria-label="J&J Beauty Bar logo"
        sx={{ width: compact ? 42 : 54, height: compact ? 42 : 54, flex: '0 0 auto' }}
      >
        <circle cx="48" cy="48" r="45" fill={dark ? '#2b2024' : '#fff7fa'} stroke={gold} strokeWidth="2.5" />
        <path
          d="M22 54c6-30 43-39 55-12 5 12 0 25-11 31 4-13 0-27-12-34-12-7-26-2-32 15Z"
          fill={blush}
          opacity="0.36"
        />
        <path d="M28 61c10 14 31 16 43 1" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M32 58c6-19 27-29 42-13" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M45 43c-2 8-2 16 1 22" fill="none" stroke={ink} strokeWidth="2.7" strokeLinecap="round" />
        <path d="M38 55c3 2 7 2 10 0M56 55c3 2 7 2 10 0" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M49 70c4 2 9 2 13-1" fill="none" stroke={gold} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M72 24l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill={gold} />
      </Box>
      {!compact && (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ color: ink, fontWeight: 950, lineHeight: 1, letterSpacing: 0 }}>
            J&J Beauty Bar
          </Typography>
          <Typography variant="caption" sx={{ color: dark ? '#f5d6df' : '#9d4767', fontWeight: 800 }}>
            Hair | Nails | Beauty
          </Typography>
        </Box>
      )}
    </Box>
  );
}
