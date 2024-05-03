import { CircularProgress, Divider, FormControl, Grid, Paper, Select, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CloudWordNegative from '../CloudWordNegative';
import GeographicGraph from '../GeographicGraph';
import GraphicArea from '../GraphicArea';
import GraphicBarDate from '../GraphicBarDate';
import GraphicBarPercentage from '../GraphicBarPercentage';
import GraphicBarScore from '../GraphicBarScore';
import GraphicPie from '../GraphicPie';
import TableReview from '../Tablereview';
import HeatMap from '../HeatMap';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const GridDashboard = ({ darkMode, token }) => {
  const [startDate, setStartDate] = useState(dayjs().year(2018).startOf('year').toISOString());
  const [endDate, setEndDate] = useState(dayjs().year(2018).endOf('year').toISOString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFromApi, setDataFromApi] = useState(null);
  const [startInput, setStartInput] = useState('2018-08-01');
  const [endInput, setEndInput] = useState('2018-09-01');
  const [selectedSent, setSelectedSent] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const handleSentChange = (event) => {
    setSelectedSent(event.target.value);
    console.log(selectedSent)
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    console.log(selectedState)
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const formattedStartDate = new Date(startDate).toISOString().slice(0, -5) + 'Z';
        const formattedEndDate = new Date(endDate).toISOString().slice(0, -5) + 'Z';

        let url = `http://localhost:8080/graphics/listByDateRange?startDate=${encodeURIComponent(formattedStartDate)}&endDate=${encodeURIComponent(formattedEndDate)}`;
        // Se um sentimento foi selecionado, adiciona-o à URL
        if (selectedSent) {
          url += `&sentimentoPredito=${selectedSent}`;
        }
        if (selectedState) {
          url += `&state=${selectedState}`;
        }
        const response = await axios.get(url);
        setDataFromApi(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedSent, selectedState]);

  const handleStartInputChange = (event) => {
    const inputValue = event.target.value;
    const formattedStartDate = dayjs(inputValue).toISOString();

    if (dayjs(inputValue).isAfter(dayjs(endInput))) {
      alert("The start date cannot be after the end date.");
      setStartInput(dayjs(startDate).format('YYYY-MM-DD'));
    } else {
      setStartInput(inputValue);
      setStartDate(formattedStartDate);
    }
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

        <FormControl variant="filled" fullWidth>
          <Select
            native
            value={selectedSent}
            onChange={handleSentChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'Sentiment',
              id: 'Sentiment',
              style: { paddingLeft: '40px', paddingRight: '30px' }
            }}
            sx={{ width: '150px' }}
          >
            <option aria-label="" value="">Sentiment</option>
            <option value="1">Positive</option>
            <option value="0">Negative</option>
            <option value="2">Neutral</option>
          </Select>
          <FavoriteIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </FormControl>

        <FormControl variant="filled" fullWidth>
          <Select
            native
            value={selectedState}
            onChange={handleStateChange}
            variant="outlined"
            color='success'
            fullWidth
            inputProps={{
              name: 'State',
              id: 'State',
              style: { paddingLeft: '40px', paddingRight: '30px' }
            }}
            sx={{ width: '150px' }}
          >
            <option aria-label="" value="">State</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MG">MG</option>
            <option value="MT">MT</option>
            <option value="PB">PB</option>
            <option value="PE">PE</option>
            <option value="PR">PR</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
          </Select>
          <FmdGoodIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </FormControl>
      </DemoContainer>

      <Divider sx={{ marginTop: '5px' }} />

      {loading && <CircularProgress />}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <Grid container spacing={3} sx={{ marginTop: '5px' }}>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <GeographicGraph token={token} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <TableReview token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 550 }}>
              <HeatMap token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} selectedSent={selectedSent} selectedState={selectedState} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicBarDate token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicBarScore token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicArea darkMode={darkMode} token={token} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicPie token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <CloudWordNegative token={token} darkMode={darkMode} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper style={{ height: 350 }}>
              <GraphicBarPercentage token={token} startDate={startDate} endDate={endDate} data={dataFromApi} selectedSent={selectedSent} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </LocalizationProvider>
  );
};

export default GridDashboard;
