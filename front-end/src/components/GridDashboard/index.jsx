import React from 'react';
import { Box, Paper } from '@mui/material';
import GraphicBarScore from '../GraphicBarScore';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicArea from '../GraphicArea';
import GraphicPie from '../GraphicPie';
import GeographicGraph from '../GeographicGraph';
import TableReview from '../TableReview';



const GridDashboard = () => {
    return (
        <Box component="main" sx={{ p: 2, marginTop: '60px' }}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr', lg: 'repeat(2, 1fr)' }} gap={1}>
                <Box>
                    <Paper sx={{ height: '765px', width: '675px', marginTop: '5px', padding: 5 }}> <GeographicGraph /> </Paper>
                    <Paper sx={{ height: '765px', width: '675px', marginTop: '10px' }}> <TableReview /> </Paper>
                </Box>
                <Box>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '5px', display: 'grid', gridTemplateColumns: '5fr 3fr' }}>
                        <GraphicArea />
                        <GraphicPie />
                    </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}> <GraphicBarDate /> </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}> <GraphicBarPercentage /> </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}> <GraphicBarScore /> </Paper>
                    <Paper sx={{ height: '300px', width: '675px', marginTop: '10px' }}>  </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default GridDashboard;

