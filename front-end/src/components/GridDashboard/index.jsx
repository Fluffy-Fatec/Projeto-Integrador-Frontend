import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Divider, Grid, Paper, IconButton } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GeographicGraph from '../GeographicGraph';
import GraphicArea from '../GraphicArea';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicBarScore from '../GraphicBarScore';
import GraphicPie from '../GraphicPie';
import TableReview from '../Tablereview';
import CloudWordPositive from '../CloudWordPositive';
import CloudWordNegative from '../CloudWordNegative';
import Typography from '@mui/material/Typography';

const GridDashboard = ({ darkMode, token }) => {
  const [value, setValue] = useState(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
     <DemoContainer components={['DateField', 'DateField']} sx={{ marginTop: '50px' }}>
  <DateField
    size=''
    color='success'
    defaultValue={dayjs('2022-04-17')}
    format="LL"
    InputProps={{
      endAdornment: (
        <IconButton>
          <CalendarTodayIcon />
        </IconButton>
      ),
    }}
    sx={{ border: 'none', width:'5px' }}
  />

  <DateField
    defaultValue={dayjs('2022-04-24')}
    format="LL"
    color='success'
    InputProps={{
      endAdornment: (
        <IconButton>
          <CalendarTodayIcon />
        </IconButton>
      ),
    }}
    sx={{ border: 'none', width:'5px'  }}
  />
</DemoContainer>


      <Divider sx={{ marginTop: '5px' }} />

      <Grid container spacing={3} sx={{ marginTop: '5px' }}>
        {/* First Row */}
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

        {/* Second Row */}
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

        {/* Third Row */}
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
    </LocalizationProvider>
  );
};

export default GridDashboard;
