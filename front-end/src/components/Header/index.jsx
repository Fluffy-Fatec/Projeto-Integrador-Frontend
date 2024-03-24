import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute" style={{ backgroundColor: '#ffffff' }}>
        <Toolbar>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
