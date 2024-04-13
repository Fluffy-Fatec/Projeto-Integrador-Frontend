import React from 'react';
import { Grid, Paper } from '@mui/material';
import GraphicBarScore from '../GraphicBarScore';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicArea from '../GraphicArea';
import GraphicPie from '../GraphicPie';
import GeographicGraph from '../GeographicGraph';
import CloudWord from '../CloudWord';

const GridDashboard = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: '50px'}}>
      {/* Primeira coluna */}
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 550 }}>
          <CloudWord />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 550 }}>
          <GraphicArea />
        </Paper>
      </Grid>
      {/* Segunda coluna */}
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarScore />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarDate />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarPercentage />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicPie />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarScore />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarScore />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GridDashboard;