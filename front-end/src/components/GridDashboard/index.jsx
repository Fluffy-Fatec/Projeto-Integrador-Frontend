import React from 'react';
import { Grid, Paper } from '@mui/material';
import GraphicBarScore from '../GraphicBarScore';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicArea from '../GraphicArea';
import GraphicPie from '../GraphicPie';
import GeographicGraph from '../GeographicGraph';
import CloudWord from '../CloudWord';
import Tablereview from '../Tablereview';


const GridDashboard = ({ darkMode, theme, token }) => {
  return (
    <Grid container spacing={2} sx={{ marginTop: '50px'}}>
      {/* Primeira coluna */}
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 550 }}>
          <CloudWord darkMode={darkMode} token={token} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 550 }}>
          <GraphicArea  darkMode={darkMode} token={token} />
        </Paper>
      </Grid>
      {/* Segunda coluna */}
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarScore darkMode={darkMode} token={token} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarDate darkMode={darkMode} token={token} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicBarPercentage  darkMode={darkMode}  token={token} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GraphicPie darkMode={darkMode}  token={token} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <GeographicGraph   darkMode={darkMode}  token={token}/>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ height: 350 }}>
          <Tablereview  darkMode={darkMode}  token={token}/>
        </Paper>
      </Grid>
    </Grid>
  );

};

export default GridDashboard;