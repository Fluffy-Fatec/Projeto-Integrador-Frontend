import React from 'react';
import { Box, Paper } from '@mui/material';
import GraphicBar from '../GraphicBar';
import GraphicBar2 from '../GraphicBar2';
import GraphicBar3 from '../GraphicBar3';

const GridDashboard = () => {
    return (
        <Box component="main" sx={{ p: 2, marginTop: '60px' }}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr', lg: 'repeat(2, 1fr)' }} gap={1}>
                <Box>
                    <Paper sx={{ height: '765px', width: '675px', marginTop: '5px' }}></Paper>
                    <Paper sx={{ height: '765px', width: '675px', marginTop: '10px' }}></Paper>
                </Box>
                <Box>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '5px' }}> <GraphicBar /> </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}> </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}><GraphicBar2 /></Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}></Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}><GraphicBar3 /></Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default GridDashboard;
