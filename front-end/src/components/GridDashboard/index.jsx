import { Grid, Paper } from '@mui/material';
import React from 'react';
import GeographicGraph from '../GeographicGraph';
import GraphicArea from '../GraphicArea';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicBarScore from '../GraphicBarScore';
import GraphicPie from '../GraphicPie';
import TableReview from '../TableReview';
import CloudWordPositive from '../CloudWordPositive';
import CloudWordNegative from '../CloudWordNegative';



const GridDashboard = ({ darkMode, theme, token }) => {
  return (
    <Grid container spacing={3} sx={{ marginTop: '50px' }}>
      {/* Primeira Linha */}
      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 550 }}>
          <GeographicGraph darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 550 }}>
          <TableReview darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 550 }}>
          <GraphicBarPercentage darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      {/* Segunda Linha */}
      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <GraphicBarDate darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <GraphicBarScore darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <GraphicArea darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      {/* Terceira Linha */}
      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <GraphicPie darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <CloudWordPositive darkMode={darkMode} token={token} />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Paper style={{ height: 350 }}>
          <CloudWordNegative darkMode={darkMode} token={token} />
        </Paper>
      </Grid>
    </Grid>
  );

};

export default GridDashboard;