import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar>
        <Typography variant="h6">Salon Management</Typography>
      </Toolbar>
    </AppBar>
  );
}
