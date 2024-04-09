import React from 'react';
import { Box, Paper } from '@mui/material';
import './index.css'; // import the CSS file
import GraphicBar from '../GraphicBar';

const GridDashboard = () => {
    return (
        <Box component="main" sx={{ p: 2, marginTop: '60px' }}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr', lg: 'repeat(2, 1fr)' }} gap={1}>
                <Box>
                    <Paper sx={{ height: '765px', width: '100%', marginTop: '5px' }}> <GraphicBar /></Paper>
                    <Paper sx={{ height: '765px', width: '100%', marginTop: '10px' }}> <GraphicBar /></Paper>
                </Box>
                <Box>
                    <Paper sx={{ height: '300px', width: '100%', marginTop: '5px' }}> <GraphicBar /></Paper>
                    <Paper sx={{ height: '300px', width: '100%', marginTop: '10px' }}> <GraphicBar /> </Paper>
                    <Paper sx={{ height: '300px', width: '100%', marginTop: '10px' }}> <GraphicBar /></Paper>
                    <Paper sx={{ height: '300px', width: '100%', marginTop: '10px' }}> <GraphicBar /></Paper>
                    <Paper sx={{ height: '300px', width: '100%', marginTop: '10px' }}> <GraphicBar /></Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default GridDashboard;

