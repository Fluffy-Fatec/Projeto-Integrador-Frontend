import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { CircularProgress, Divider, Grid, Paper, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GeographicGraph from '../GeographicGraph'; // Importe o componente GeographicGraph
import TableReview from '../Tablereview';
import CloudWordPositive from '../CloudWordPositive';
import CloudWordNegative from '../CloudWordNegative';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarScore from '../GraphicBarScore';
import GraphicArea from '../GraphicArea';
import GraphicPie from '../GraphicPie';

const GridDashboard = ({ darkMode, token }) => {
  const [startDate, setStartDate] = useState(dayjs().year(2018).startOf('year').toISOString());
  const [endDate, setEndDate] = useState(dayjs().year(2018).endOf('year').toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFromApi, setDataFromApi] = useState(null);
  const [startInput, setStartInput] = useState('2018-08-01');
  const [endInput, setEndInput] = useState('2018-09-01');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
        const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

        const url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}&sentimentoPredito=1`;
        const response = await axios.get(url);

        const counts = {};
        console.log('Data from server:', response.data);
        setDataFromApi(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleStartInputChange = (event) => {
    const inputValue = event.target.value;
    const formattedStartDate = dayjs(inputValue).toISOString();
    setStartInput(inputValue);
    setStartDate(formattedStartDate);
  };

  const handleEndInputChange = (event) => {
    const inputValue = event.target.value;
    const formattedEndDate = dayjs(inputValue).endOf('day').toISOString();
    setEndInput(inputValue);
    setEndDate(formattedEndDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField']} sx={{ marginTop: '50px' }}>
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startInput}
          onChange={handleStartInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endInput}
          onChange={handleEndInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DemoContainer>

      <Divider sx={{ marginTop: '5px' }} />

      {loading && <CircularProgress />}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <Grid container spacing={3} sx={{ marginTop: '5px' }}>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <GeographicGraph token={token} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <TableReview token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <GraphicBarPercentage token={token} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicBarDate token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicBarScore token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicArea darkMode={darkMode} token={token} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicPie token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <CloudWordPositive token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <CloudWordNegative token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </LocalizationProvider>
  );
};

export default GridDashboard;
